"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/leads/leads_user_form";
import { Grid, Paper, TableContainer } from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Typography, Box, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import PaidIcon from "@mui/icons-material/Paid";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",

  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  overflow: "auto",
};

const innerStyle = {
  overflow: "auto",
  width: 400,
  height: 400,
};

function LeadsHistory(props) {
  const [showServiceTrans, setShowServiceTrans] = useState({});
  const dispatch = useDispatch();
  const [report, setReport] = useState(null);
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
    const getTnx = async () => {
      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };

      try {
        const response = await api.post(
          "/api/leads/lead-user-action-report",
          reqData
        );

        if (response.status === 200) {
          setShowServiceTrans(response.data.data);
          setReport(response.data.report);
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

  const [searchTerm, setSearchTerm] = useState("");

  const filteredRows = rows.filter((row) => {
    return (
      (row.first_name &&
        row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
      (row.mobile && row.mobile.includes(searchTerm))
    );
  });
  return (
    <Layout>
      <Grid container  sx={{ padding: 2 }}>
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="stretch"
        >
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={2}
            mb={2}
            sx={{ flexBasis: { lg: "20%" }, maxWidth: { lg: "20%" } }}
          >
            <Item
              sx={{
                height: 100,
                backgroundColor: "#FFC107",
                color: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "10px",
                position: "relative",
              }}
            >
              <LeaderboardIcon
                sx={{
                  fontSize: 40,
                  position: "absolute",
                  top: 10,
                  right: 10,
                  opacity: 0.2,
                }}
              />
              <Box>
                <Typography
                  variant="h2"
                  sx={{ padding: 1, fontSize: "22px", color: "#fff" }}
                >
                  Total Count
                </Typography>
                <Box sx={{ color: "#fff", fontSize: 24 }}>
                  {report ? report.total_count : 0}
                </Box>
              </Box>
            </Item>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={2}
            mb={2}
            sx={{ flexBasis: { lg: "20%" }, maxWidth: { lg: "20%" } }}
          >
            <Item
              sx={{
                height: 100,
                backgroundColor: "#2196f3",
                color: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "10px",
                position: "relative",
              }}
            >
              <PaidIcon
                sx={{
                  fontSize: 40,
                  position: "absolute",
                  top: 10,
                  right: 10,
                  opacity: 0.2,
                }}
              />
              <Box>
                <Typography
                  variant="h2"
                  sx={{ padding: 1, fontSize: "22px", color: "#fff" }}
                >
                  Total Distributed Amt.
                </Typography>
                <Box sx={{ color: "#fff", fontSize: 24 }}>
                  {report?.total_distributed_amount ?? 0}
                </Box>
              </Box>
            </Item>
          </Grid>
        </Grid>

        <Grid item={true} xs={12}>
          <TableContainer component={Paper} style={{ display: 'flex', justifyContent: 'space-between' , alignItems:'center'}}>
        
              <Typography variant="h5" sx={{ padding: 1 }} whiteSpace={"nowrap"}>
                User Lead Form Request List
              </Typography>
         

            <Box
              display={"inline-block"}
              justifyContent={"space-between"}
              alignItems={"right"}
             
              sx={{ width: "30%", verticalAlign: "top" }}
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
              mt={1}
              mb={1}
              mr={1}
              sx={{ verticalAlign: "top" }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <DatePicker
                    value={fromDate}
                    format="DD-MM-YYYY"
                    onChange={handleFromDateChange}
                    slotProps={{
                      textField: {
                        size: "small",
                        sx: {
                          width: 150,
                          '& .MuiInputBase-root': {
                            height: 40,
                            fontSize: '0.875rem'
                          }
                        }
                      }
                    }}
                  />
                  <DatePicker
                    value={toDate}
                    format="DD-MM-YYYY"
                    onChange={handleToDateChange}
                    slotProps={{
                      textField: {
                        size: "small",
                        sx: {
                          width: 150,
                          '& .MuiInputBase-root': {
                            height: 40,
                            fontSize: '0.875rem'
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </LocalizationProvider>
            </Box>
          </TableContainer>
        </Grid>
      </Grid>

      <Transactions showServiceTrans={filteredRows} />
    </Layout>
  );
}
export default withAuth(LeadsHistory);
