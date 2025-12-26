"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import PagesTransactions from "@/components/Pages/contentList";
import { Grid, Button, Typography, Box, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import SearchIcon from "@mui/icons-material/Search";

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

function PagesReport(props) {
  const [showServiceTrans, setShowServiceTrans] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  let rows;

  if (showServiceTrans && showServiceTrans.length > 0) {
    rows = [...showServiceTrans];
  } else {
    rows = [];
  }
  const handleSearch = (text) => {
    setSearchTerm(text);
  };
  const dispatch = useDispatch();

  const currentDate = new Date();
  const [fromDate, setFromDate] = React.useState(
    dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  );
  const [toDate, setToDate] = React.useState(dayjs(getDate.date));

  useEffect(() => {
    const getTnx = async () => {
      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };

      try {
        const response = await api.post("/api/page/get-pages-admin");

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

    if (fromDate || toDate) {
      getTnx();
    }
  }, [fromDate, toDate, dispatch]);

  const handleFromDateChange = (date) => {
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
  };

  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  let filteredRows;

  if (selectedValue != "") {
    filteredRows = rows.filter((row) => {
      return (
        row.title &&
        row.title.toLowerCase().includes(selectedValue.toLowerCase())
      );
    });
  } else {
    filteredRows = rows.filter((row) => {
      return (
        row.title && row.title.toLowerCase().includes(searchTerm.toLowerCase())

        // Add conditions for other relevant columns
      );
    });
  }

  return (
    <Layout>
      <Grid container spacing={3} sx={{ padding: 2 }}>
        <Grid item={true} xs={12}>
          <FilterRow>
            <Box
              display={"inline-block"}
              justifyContent={"space-between"}
              alignItems={"right"}
              style={{ width: "72%", verticalAlign: "top" }}
            >
              <Typography variant="h5">
                Pages
              </Typography>
            </Box>

            <Box
              display={"inline-block"}
              justifyContent={"space-between"}
              alignItems={"center"}
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

            <Box
              display={"inline-block"}
              justifyContent={"space-between"}
              alignItems={"center"}
              sx={{ verticalAlign: "top" }}
            >
              <Button
                variant="contained"
                style={{ marginRight: "5px" }}
                href={`/add-new-page/`}
                sx={{
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: 16,
                  px: 3,
                  py: 1.2,
                  background:
                    "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
                  boxShadow: "0 2px 8px 0 rgba(33, 203, 243, 0.15)",
                  textTransform: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Add New Content
              </Button>
            </Box>
          </FilterRow>
        </Grid>
      </Grid>
      <PagesTransactions showServiceTrans={filteredRows} />
    </Layout>
  );
}
export default withAuth(PagesReport);
