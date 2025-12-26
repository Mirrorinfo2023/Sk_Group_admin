"use client";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import dynamic from "next/dynamic";
const Transactions = dynamic(() => import("@/components/leads/category"), {
  ssr: false,
});
import {
  Grid,
  Paper,
  TableContainer,
  Button,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { DataEncrypt, DataDecrypt } from "../../utils/encryption";

const drawWidth = 220;
const getDate = (timeZone) => {
  const dateString = timeZone;
  const dateObject = new Date(dateString);

  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");
  const hours = String(dateObject.getHours()).padStart(2, "0");
  const minutes = String(dateObject.getMinutes()).padStart(2, "0");

  // Determine if it's AM or PM
  const amOrPm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  const formattedHours = hours % 12 === 0 ? "12" : String(hours % 12);

  const formattedDateTime = `${day}-${month}-${year} ${formattedHours}:${minutes} ${amOrPm}`;

  return formattedDateTime;
};


function TransactionHistory(props) {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const dispatch = useDispatch();
  const uid = Cookies.get("uid");

  let rows;

  if (showServiceTrans && showServiceTrans.length > 0) {
    rows = [...showServiceTrans];
  } else {
    rows = [];
  }

  const [fromDate, setFromDate] = React.useState(dayjs(getDate.dateObject));
  const [toDate, setToDate] = React.useState(dayjs(getDate.dateObject));

  useEffect(() => {
    const all_parameters = {
      category_name1: null,
    };
    const encryptedData = DataEncrypt(JSON.stringify(all_parameters));
    const getTnx = async () => {
      const reqData = {
        encReq: encryptedData,
      };

      try {
        const response = await api.post("/api/leads/get-category", reqData);
        if (response.status === 200) {
          const decryptedObject = DataDecrypt(response.data);
          console.log(decryptedObject);
          setShowServiceTrans(
            Array.isArray(decryptedObject.data) ? decryptedObject.data : []
          );
        }
      } catch (error) {
        if (error?.response?.data?.error) {
          dispatch(
            callAlert({ message: error.response.data.error, type: "FAILED" })
          );
        } else {
          dispatch(callAlert({ message: error.message, type: "FAILED" }));
        }
      }
    };

    if (uid) {
      getTnx();
    }
  }, [uid, fromDate, toDate, dispatch]);

  const handleFromDateChange = (date) => {
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredRows = rows.filter((row) => {
    return (
      row.category_name &&
      row.category_name.toLowerCase().includes(searchTerm.toLowerCase())
      // Add conditions for other relevant columns
    );
  });
  return (
    <Layout>
      <Grid container spacing={4} sx={{ padding: 2 }}>
        <Grid item={true} xs={12}>
          <TableContainer component={Paper}>
            <Box
              display={"inline-block"}
              justifyContent={"space-between"}
              alignItems={"right"}
              style={{ width: "70%", verticalAlign: "top" }}
            >
              <Typography variant="h5" sx={{ padding: 2 }}>
                Lead Categories
              </Typography>
            </Box>
            <Box
              display={"inline-block"}
              justifyContent={"space-between"}
              alignItems={"center"}
              mt={3}
              mb={1}
              sx={{ width: "20%", verticalAlign: "top" }}
            >
              <TextField
                id="standard-basic"
                placeholder="Search"
                variant="standard"
                mt={2}
                style={{ width: "100%" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon />,
                }}
              />
            </Box>

            <Box
              display={"inline-block"}
              justifyContent={"space-between"}
              alignItems={"center"}
              ml={2}
              mt={2}
              mb={1}
              sx={{ verticalAlign: "middle" }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
              </LocalizationProvider>

              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                href={`/add-new-lead-category/`}
                sx={{
                  background:
                    "linear-gradient(90deg, #1976d2 0%, #21cbf3 100%)",
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: 15,
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  boxShadow: "0 2px 8px 0 rgba(33,203,243,0.15)",
                  textTransform: "uppercase",
                  letterSpacing: 0,
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #21cbf3 0%, #1976d2 100%)",
                  },
                }}
              >
                Add New
              </Button>
            </Box>
          </TableContainer>
        </Grid>
      </Grid>
      <Transactions showServiceTrans={showServiceTrans} />
    </Layout>
  );
}
export default withAuth(TransactionHistory);
