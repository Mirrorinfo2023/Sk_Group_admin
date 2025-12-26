"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/Dashboard/User/idCardDetails";
import {
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import BadgeIcon from "@mui/icons-material/Badge";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CancelIcon from "@mui/icons-material/Cancel";

const getDate = (timeZone) => {
  const dateString = timeZone;
  const dateObject = new Date(dateString);
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");
  const hours = String(dateObject.getHours()).padStart(2, "0");
  const minutes = String(dateObject.getMinutes()).padStart(2, "0");
  const amOrPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? "12" : String(hours % 12);
  const formattedDateTime = `${day}-${month}-${year} ${formattedHours}:${minutes} ${amOrPm}`;
  return formattedDateTime;
};
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
  fontSize: 12,
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
  padding: "0 16px",
  display: "flex",
  alignItems: "center",
  gap: 20,
  marginBottom: 10,
  flexWrap: "nowrap",
  justifyContent: "space-between",
}));
function TransactionHistory(props) {
  const [showServiceTrans, setShowServiceTrans] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showMasterReport, setShowMasterReport] = useState({});
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
  const [totalPageCount, setTotalPageCount] = React.useState(
    dayjs(getDate.date)
  );

  useEffect(() => {
    const getTnx = async () => {
      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };

      try {
        const response = await api.post(
          "/api/report/idcard-request-report",
          reqData
        );

        if (response.status === 200) {
          setShowServiceTrans(response.data.data);
          setTotalPageCount(response.data.totalPageCount);
          setShowMasterReport(response.data.report);
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
        row.sub_type &&
        row.sub_type.toLowerCase().includes(selectedValue.toLowerCase())
      );
    });
  } else {
    filteredRows = rows.filter((row) => {
      return (
        (row.first_name &&
          row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
        (row.mobile && row.mobile.includes(searchTerm)) ||
        (row.email &&
          row.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
  }

  return (
    <Layout>
      <Grid container spacing={4} sx={{ padding: 2 }}>
        <Grid item={true} justifyContent="center" xs={12}>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              justifyContent: "center",
              mb: 1,
            }}
          >
            <StatCard bgcolor="#FFC107">
              <StatContent>
                <StatValue>
                  {" "}
                  {showMasterReport.totalRequestsCount ?? 0}
                </StatValue>
                <StatLabel> Total Requests</StatLabel>
              </StatContent>
              <StatIcon>
                <BadgeIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
            <StatCard bgcolor="#5C6BC0">
              <StatContent>
                <StatValue>
                  {" "}
                  {showMasterReport.totalPendingRequests ?? 0}
                </StatValue>
                <StatLabel> Pending Requests</StatLabel>
              </StatContent>
              <StatIcon>
                <PendingActionsIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
            <StatCard bgcolor="#26A69A">
              <StatContent>
                <StatValue>
                  {" "}
                  {showMasterReport.totalIssueRequests ?? 0}
                </StatValue>
                <StatLabel> Issue Requests</StatLabel>
              </StatContent>
              <StatIcon>
                <AssignmentTurnedInIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
            <StatCard bgcolor="#EC407A">
              <StatContent>
                <StatValue>
                  {showMasterReport.totalRejectedRequests_view ?? 0}
                </StatValue>
                <StatLabel> Rejected Requests</StatLabel>
              </StatContent>
              <StatIcon>
                <CancelIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
          </Box>
        </Grid>
        <Grid item={true} xs={12}>
          <FilterRow component={Paper}>

              <Typography variant="h5">
                Id Card Request
              </Typography>
          

           <Box sx={{ display: "flex", justifyContent: "space-between" }}>
           <Box
              display={"inline-block"}
              justifyContent={"space-between"}
              alignItems={"center"}
              sx={{ marginTop: "25px", width: "200px", verticalAlign: "top", marginRight:"12px" }}  
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
              sx={{ verticalAlign: "top" }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div>
                  <DatePicker
                    label="From Date"
                    value={fromDate}
                    sx={{   margin: 1,
                        lineHeight: 20,
                        minWidth: 140,
                        maxWidth: 170, }}
                    format="DD-MM-YYYY"
                    onChange={handleFromDateChange}
                  />

                  <DatePicker
                    label="To Date"
                    value={toDate}
                    sx={{  margin: 1,
                        lineHeight: 20,
                        minWidth: 140,
                        maxWidth: 170, }}
                    format="DD-MM-YYYY"
                    onChange={handleToDateChange}
                  />
                </div>
              </LocalizationProvider>
            </Box>
           </Box>
          </FilterRow>
        </Grid>
      </Grid>
      <Transactions
        showServiceTrans={filteredRows}
        totalPageCount={totalPageCount}
        setTotalPageCount={setTotalPageCount}
      />
    </Layout>
  );
}
export default withAuth(TransactionHistory);
