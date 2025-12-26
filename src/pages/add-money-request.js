"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import { DataEncrypt, DataDecrypt } from "../../utils/encryption";
import withAuth from "../../utils/withAuth";
import Layout from "@/components/Dashboard/layout";
import AddMoneyRequestTransactions from "@/components/AddMoneyRequest/AddMoneyRequestReport";
import {
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { styled } from "@mui/material/styles";



const drawWidth = 220;

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

const FilterRow = styled(Box)(() => ({
  background: "#f5faff",
  borderRadius: 12,
  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.06)",
  padding: "12px",
  display: "flex",
  alignItems: "center",
  gap: 20,
  marginBottom: 10,
  flexWrap: "nowrap",
  justifyContent: "space-between",
}));

function AddMoneyRequestReport() {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [masterReport, setMasterReport] = useState({});
  const [selectedValue, setSelectedValue] = useState("");

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
      // console.log("🟢 reqData:", reqData);

      try {
        // 🔹 Encrypt the request payload
        const encryptedPayload = DataEncrypt(JSON.stringify(reqData));
        // console.log("🟢 encryptedPayload:", encryptedPayload);

        // 🔹 Send in the expected format
        const response = await api.post("/api/add_money/2ffbd5ac811ff7360bd1599ac7eaf56b689da024", {
          data: encryptedPayload
        });
        // console.log("🟢 Response:", response);

        if (response.data) {
          // 🔹 Decrypt the response from backend
          const decryptedData = DataDecrypt(response.data.data);
          console.log("🟢 Decrypted Response:", decryptedData);

          setShowServiceTrans(decryptedData.data);
          setMasterReport(decryptedData.report);
        }
      } catch (error) {
        console.error("🚨 Error fetching Add Money report:", error);
      }
    };




    if (fromDate || toDate) {
      getTnx();
    }
  }, [fromDate, toDate]);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };


  const term = searchTerm.trim().toLowerCase();

  const filteredRows = showServiceTrans.filter((row) => {
    const isStatusMatch = selectedValue === "" || row.status === parseInt(selectedValue);
console.log("row",row)
    const isSearchTermMatch =
      (row.first_name || "").toLowerCase().includes(term) ||
      (row.last_name || "").toLowerCase().includes(term) ||
      (row.id || "").toString().toLowerCase().includes(term) ||
      (row.mobile || "").toString().includes(term) ||
      (row.category || "").toLowerCase().includes(term) ||
      (row.amount || "").toString().includes(term) ||
      (row.transaction_id || "").toLowerCase().includes(term) ||
      (row.upi_id || "").toLowerCase().includes(term);

    return isStatusMatch && (term === "" || isSearchTermMatch);
  });


  return (
    <Layout>
      <Grid container spacing={3} sx={{ padding: 2 }}>
        <Grid item xs={12}>
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
                <StatValue>{masterReport.totalAddmoneyCount ?? 0}</StatValue>
                <StatLabel>Total Add Money</StatLabel>
              </StatContent>
              <StatIcon>
                <AccountBalanceWalletIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
            <StatCard bgcolor="#5C6BC0">
              <StatContent>
                <StatValue>{masterReport.totalPendingAddMoney ?? 0}</StatValue>
                <StatLabel>Pending Add Money</StatLabel>
              </StatContent>
              <StatIcon>
                <PendingActionsIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
            <StatCard bgcolor="#26A69A">
              <StatContent>
                <StatValue>{masterReport.totalApprovedaddMoney ?? 0}</StatValue>
                <StatLabel>Approved Add Money</StatLabel>
              </StatContent>
              <StatIcon>
                <CheckCircleIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
            <StatCard bgcolor="#EC407A">
              <StatContent>
                <StatValue>
                  {masterReport.totalRejectedaddMoney_view ?? 0}
                </StatValue>
                <StatLabel>Rejected Add Money</StatLabel>
              </StatContent>
              <StatIcon>
                <CancelIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <FilterRow>
            <Box
              display="inline-block"
              justifyContent="space-between"
              alignItems="right"
              mt={1}
              mb={1}
              sx={{ width: "30%", verticalAlign: "top" }}
            >
              <Typography variant="h5">Add Money Request Report</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box
                display="inline-block"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  marginTop: "25px",
                  width: "200px",
                  verticalAlign: "top",
                  marginRight: "12px",
                }}
              >
                <TextField
                  placeholder="Search by User ID, User Name, Mobile, Payment Mode, Amount, Transaction ID, UPI ID"
                  variant="standard"
                  sx={{ width: "100%" }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon />,
                  }}
                />

              </Box>
              <Box
                display="inline-block"
                justifyContent="space-between"
                alignItems="right"
                mt={2}
                sx={{ width: "170px", verticalAlign: "center" }}
              >
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={selectedValue}
                    onChange={handleChange}
                    sx={{ minWidth: 140, maxWidth: 170, fontSize: "13px" }}
                  >
                    <MenuItem value="">Default</MenuItem>
                    <MenuItem value="0">Pending</MenuItem>
                    <MenuItem value="1">Approved</MenuItem>
                    <MenuItem value="2">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box
                display="inline-block"
                justifyContent="space-between"
                alignItems="center"
                mt={1}
                mb={1}
                sx={{ verticalAlign: "top" }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <div>
                    <DatePicker
                      label="From Date"
                      value={fromDate}
                      sx={{
                        margin: 1,
                        lineHeight: 20,
                        minWidth: 140,
                        maxWidth: 170,
                      }}
                      format="DD-MM-YYYY"
                      onChange={(date) => setFromDate(date)}
                    />
                    <DatePicker
                      label="To Date"
                      value={toDate}
                      sx={{
                        margin: 1,
                        lineHeight: 20,
                        minWidth: 140,
                        maxWidth: 170,
                      }}
                      format="DD-MM-YYYY"
                      onChange={(date) => setToDate(date)}
                    />
                  </div>
                </LocalizationProvider>
              </Box>
            </Box>
          </FilterRow>
        </Grid>
      </Grid>
      <AddMoneyRequestTransactions showServiceTrans={filteredRows} />
    </Layout>
  );
}

export default withAuth(AddMoneyRequestReport);
