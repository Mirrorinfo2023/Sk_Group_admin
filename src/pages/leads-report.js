"use client";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/leads/leads_report";
import { Grid, Paper, TableContainer, Button } from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Typography, Box, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

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

const StatCard = styled(Paper)(({ bgcolor }) => ({
    background: bgcolor,
    color: '#fff',
    borderRadius: 12,
    padding: '28px 36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 280,
    minHeight: 100,
    position: 'relative',
    overflow: 'hidden',
    marginRight: 24,
}));

const StatContent = styled('div')({
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
});

const StatValue = styled('div')({
    fontSize: 32,
    fontWeight: 700,
    lineHeight: 1.1,
    marginBottom: 4,
});

const StatLabel = styled('div')({
    fontSize: 14,
    fontWeight: 500,
    opacity: 0.85,
    letterSpacing: 1,
    textTransform: 'uppercase',
});

const StatIcon = styled('div')({
    position: 'absolute',
    right: 24,
    top: '50%',
    transform: 'translateY(-50%)',
    opacity: 0.18,
    fontSize: 64,
    zIndex: 1,
});

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
        const response = await api.post("/api/leads/get-leads-report", reqData);
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
      (row.category_name &&
        row.category_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.lead_name && row.lead_name.includes(searchTerm)) ||
      (row.description && row.description.includes(searchTerm))
    );
  });
  return (
    <Layout>
      <Grid container spacing={4} sx={{ padding: 2 }}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap', mb: 1 }}>
            <StatCard bgcolor="#FFC107">
              <StatContent>
                <StatValue>{report ? report.total_count : 0}</StatValue>
                <StatLabel>Total Count</StatLabel>
              </StatContent>
              <StatIcon>
                <LeaderboardIcon sx={{ fontSize: 64, color: '#fff' }} />
              </StatIcon>
            </StatCard>
            <StatCard bgcolor="#5C6BC0">
              <StatContent>
                <StatValue>{report ? report.total_active : 0}</StatValue>
                <StatLabel>Active Count</StatLabel>
              </StatContent>
              <StatIcon>
                <CheckCircleIcon sx={{ fontSize: 64, color: '#fff' }} />
              </StatIcon>
            </StatCard>
            <StatCard bgcolor="#26A69A">
              <StatContent>
                <StatValue>{report ? report.total_inactive : 0}</StatValue>
                <StatLabel>Inactive Count</StatLabel>
              </StatContent>
              <StatIcon>
                <HighlightOffIcon sx={{ fontSize: 64, color: '#fff' }} />
              </StatIcon>
            </StatCard>
          </Box>
        </Grid>

        <Grid item={true} xs={12}>
          <TableContainer component={Paper}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{ p: 1, gap: 4, flexWrap: 'wrap' }}
            >
              <Typography variant="h5" sx={{ minWidth: 160, fontWeight: 500 }}>
                Lead [List]
              </Typography>
              <TextField
                id="standard-basic"
                placeholder="Search"
                variant="standard"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: '#888', mr: 1 }} />,
                }}
                sx={{ minWidth: 240, background: '#fff', borderRadius: 2, mx: 2 }}
              />
              <Box display="flex" alignItems="center" gap={1} width="40%">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={fromDate}
                    sx={{ minWidth: 80, background: '#fff', borderRadius: 1 }}
                    format="DD-MM-YYYY"
                    onChange={handleFromDateChange}
                  />
                  <DatePicker
                    value={toDate}
                    sx={{ minWidth: 80, background: '#fff', borderRadius: 1 }}
                    format="DD-MM-YYYY"
                    onChange={handleToDateChange}
                  />
                </LocalizationProvider>
              </Box>
              <Button
                variant="contained"
                href={`/add-new-lead/`}
                sx={{
                  background: 'linear-gradient(90deg, #1976d2 0%, #21cbf3 100%)',
                  color: '#fff',
                  fontWeight: 500,
                  fontSize: 16,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  boxShadow: '0 2px 8px 0 rgba(33,203,243,0.15)',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  '&:hover': {
                    background: 'linear-gradient(90deg, #21cbf3 0%, #1976d2 100%)',
                  },
                }}
              >
                Add Product
              </Button>
            </Box>
          </TableContainer>
        </Grid>
      </Grid>

      <Transactions showServiceTrans={filteredRows} />
    </Layout>
  );
}
export default withAuth(LeadsHistory);
