"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/Employee/role";
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
import { styled } from "@mui/material/styles";
import GroupIcon from "@mui/icons-material/Group";
import SecurityIcon from "@mui/icons-material/Security";

const StatCard = styled(Paper)(({ bgcolor }) => ({
  background: bgcolor,
  color: "#fff",
  borderRadius: 12,
  padding: "28px 36px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  minWidth: 280,
  minHeight: 100,
  position: "relative",
  overflow: "hidden",
  marginRight: 24,
}));

const StatContent = styled("div")({
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
});

const StatValue = styled("div")({
  fontSize: 32,
  fontWeight: 700,
  lineHeight: 1.1,
  marginBottom: 4,
});

const StatLabel = styled("div")({
  fontSize: 14,
  fontWeight: 500,
  opacity: 0.85,
  letterSpacing: 1,
  textTransform: "uppercase",
});

const StatIcon = styled("div")({
  position: "absolute",
  right: 24,
  top: "50%",
  transform: "translateY(-50%)",
  opacity: 0.18,
  fontSize: 64,
  zIndex: 1,
});

const FilterRow = styled(Box)(({ theme }) => ({
  background: "#f5faff",
  borderRadius: 12,
  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.06)",
  padding: "16px",
  display: "flex",
  alignItems: "center",
  gap: 20,
  marginBottom: 10,
  flexWrap: "nowrap",
  justifyContent: "flex-start",
}));

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
  const [showServiceTrans, setShowServiceTrans] = useState({});
  const dispatch = useDispatch();
  const uid = Cookies.get("uid");

  let rows;

  if (showServiceTrans && showServiceTrans.length > 0) {
    rows = [...showServiceTrans];
  } else {
    rows = [];
  }
  // const [fromDate, setFromDate] = useState(new Date());
  // const [toDate, setToDate] = useState(new Date());

  const [fromDate, setFromDate] = React.useState(dayjs(getDate.dateObject));
  const [toDate, setToDate] = React.useState(dayjs(getDate.dateObject));

  useEffect(() => {
    const getTnx = async () => {
      // const reqData = {
      //     from_date: fromDate.toISOString().split('T')[0],
      //     to_date: toDate.toISOString().split('T')[0],
      //   };

      try {
        const response = await api.post("/api/employee/get-role-list");
        if (response.status === 200) {
          setShowServiceTrans(response.data.data);
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
      row.role_name &&
      row.role_name.toLowerCase().includes(searchTerm.toLowerCase())
      // Add conditions for other relevant columns
    );
  });
  return (
    <Layout>
      <Grid container spacing={3} sx={{ padding: 2 }}>
        <Grid item xs={12}>
          <Box
            display="flex"
            flexWrap="nowrap"
            justifyContent="center"
            overflow="auto"
            sx={{ mb: 1 }}
          >
            <StatCard bgcolor="#2196F3">
              <StatContent>
                <StatValue>{rows.length}</StatValue>
                <StatLabel>Total Roles</StatLabel>
              </StatContent>
              <StatIcon>
                <SecurityIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
            <StatCard bgcolor="#4CAF50">
              <StatContent>
                <StatValue>
                  {rows.filter((row) => row.status === 1).length}
                </StatValue>
                <StatLabel>Active Roles</StatLabel>
              </StatContent>
              <StatIcon>
                <GroupIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <FilterRow>
            <Box
              display={"inline-block"}
              justifyContent={"space-between"}
              alignItems={"right"}
              style={{ width: "70%", verticalAlign: "center" }}
            >
              <Typography variant="h5" sx={{ padding: 1 }}>
                Employee Role
              </Typography>
            </Box>

            <Box
              display={"inline-block"}
              justifyContent={"space-between"}
              alignItems={"center"}
              mt={1}
              mb={1}
              sx={{ width: "20%", verticalAlign: "top" }}
            >
              <TextField
                id="standard-basic"
                placeholder="Search"
                variant="standard"
                size="small"
                style={{ width: "100%" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon />,
                }}
              />
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              href={`/add-new-role/`}
              sx={{
                borderRadius: 2,
                fontWeight: 700,
                fontSize: 16,
                px: 3,
                py: 1.2,
                background: "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
                boxShadow: "0 2px 8px 0 rgba(33, 203, 243, 0.15)",
                textTransform: "none",
                whiteSpace: "nowrap",
                ml: 1,
              }}
            >
              Add New
            </Button>
          </FilterRow>
        </Grid>
      </Grid>
      <Transactions showServiceTrans={filteredRows} />
    </Layout>
  );
}
export default withAuth(TransactionHistory);
