"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/Employee/employee";
import {
  Grid,
  Button,
  TableContainer,
  Paper,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useRouter } from "next/router";

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

function TransactionHistory(props) {
  const [showServiceTrans, setShowServiceTrans] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [masterReport, setmasterReport] = useState({});
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

  const router = useRouter();
  const role = Cookies.get("employee_role");

  const { id, action } = router.query;

  useEffect(() => {
    const getMenus =
      localStorage.getItem("menu") !== "" &&
      localStorage.getItem("menu") != "undefined"
        ? JSON.parse(localStorage.getItem("menu"))
        : [];
    const page_url = "employee-list";
    let foundMenu = false;

    if (getMenus && role === "Admin") {
      for (const item of getMenus) {
        if (item.menu_url === page_url && item._list == 1) {
          foundMenu = true;
          break;
        }
      }
    }
    if (!foundMenu) {
      //window.location.href = '/dashboard';
    }
  }, [role, action]);

  useEffect(() => {
    const getTnx = async () => {
      try {
        const response = await api.post("/api/employee/get-employee-list");

        if (response.status === 200) {
          setShowServiceTrans(response.data.data);
          setmasterReport(response.data.report);
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

    getTnx();
  }, [dispatch]);

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
          row.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.employee_code &&
          row.employee_code.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
  }

  return (
    <Layout>
      <Grid container spacing={3} sx={{ padding: 2 }}>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", gap: 1, justifyContent:"center", flexWrap: "wrap", mb: 1 }}>
            <StatCard bgcolor="#FFC107">
              <StatContent>
                <StatValue>{masterReport.totalempCount ?? 0}</StatValue>
                <StatLabel>Total Employees</StatLabel>
              </StatContent>
              <StatIcon>
                <LeaderboardIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
            <StatCard bgcolor="#5C6BC0">
              <StatContent>
                <StatValue>{masterReport.totalActiveempCount ?? 0}</StatValue>
                <StatLabel>Active</StatLabel>
              </StatContent>
              <StatIcon>
                <CheckCircleIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
            <StatCard bgcolor="#26A69A">
              <StatContent>
                <StatValue>{masterReport.totalInactiveempCount ?? 0}</StatValue>
                <StatLabel>Inactive</StatLabel>
              </StatContent>
              <StatIcon>
                <HighlightOffIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
          </Box>
        </Grid>

        <Grid item={true} xs={12}>
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 2, boxShadow: "0 2px 8px 0 rgba(0,0,0,0.1)" }}
          >
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              p={2}
            >
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Staff List
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <TextField
                  id="standard-basic"
                  placeholder="Search"
                  variant="standard"
                  size="small"
                  style={{ width: "70%" }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon />,
                  }}
                />

                <Button
                  variant="contained"
                  href={`/add-new-employee/`}
                  startIcon={<AddIcon />}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: 16,
                    px: 4,
                    py: 1.2,
                    background:
                      "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
                    boxShadow: "0 2px 8px 0 rgba(33, 203, 243, 0.15)",
                    textTransform: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  Add New
                </Button>
              </Box>
            </Box>
          </TableContainer>
        </Grid>
      </Grid>
      <Transactions showServiceTrans={filteredRows} />
    </Layout>
  );
}
export default withAuth(TransactionHistory);
