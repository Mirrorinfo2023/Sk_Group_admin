"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import { DataDecrypt, DataEncrypt } from "../../utils/encryption";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/Dashboard/User/details";
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Box,
  TextField,
  Card,
  IconButton,
  Chip,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/router";
import PeopleIcon from "@mui/icons-material/People";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import PersonIcon from "@mui/icons-material/Person";
import AddNewUser from "./AddUserDialog";
import SetCashback from "./Set-user-Cashback";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import TuneIcon from "@mui/icons-material/Tune";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

function TransactionHistory(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [cashbackDialog, setCashbackDialog] = useState(false);
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [masterReport, setmasterReport] = useState({});
  const dispatch = useDispatch();
  const uid = Cookies.get("uid");
  const router = useRouter();

  const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
  const [toDate, setToDate] = useState(dayjs());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  let rows = showServiceTrans && showServiceTrans.length > 0 ? [...showServiceTrans] : [];

  useEffect(() => {
    const getTnx = async () => {
      try {
        // Prepare data
        const reqData = {
          from_date: fromDate.toISOString().split("T")[0],
          to_date: toDate.toISOString().split("T")[0],
        };

        console.log("Original reqData:", reqData);

        // 🔒 Encrypt before sending
        const encryptedPayload = { data: DataEncrypt(JSON.stringify(reqData)) };

        // 🔐 Send encrypted data
        const response = await api.post("/api/report/70b12e5fc4d4c51474b2b32706b248af89fce3d4", encryptedPayload);

        console.log("Raw Encrypted Response:", response);

        // 🔓 Decrypt response message
        const decryptedResponse = DataDecrypt(response.data.data);

        console.log("Decrypted Response:", decryptedResponse);

        if (response.status === 200) {
          setShowServiceTrans(decryptedResponse.data || []);
          setmasterReport(decryptedResponse.report || {});
        }

      } catch (error) {
        console.error("Error fetching transaction:", error);
        if (error?.response?.data?.error) {
          dispatch(callAlert({ message: error.response.data.error, type: "FAILED" }));
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

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleOKButtonClick = async () => {
    setLoading(true);

    // 🔹 Step 1: Prepare request data
    const requestData = {
      filter: selectedValue,
      searchTerm: searchTerm,
    };

    try {
      // 🔹 Step 2: Encrypt before sending
      const encryptedPayload = DataEncrypt(JSON.stringify(requestData));

      // Send encrypted data to backend
      const response = await api.post("/api/report/70b12e5fc4d4c51474b2b32706b248af89fce3d4", { data: requestData });

      // 🔹 Step 3: Decrypt response data
      if (response.data?.data) {
        const decryptedResponse = DataDecrypt(response.data.data);

        if (decryptedResponse.status === 200) {
          setShowServiceTrans(decryptedResponse.data || []);
        } else {
          alert(decryptedResponse.message || "Something went wrong");
        }
      } else {
        alert("Invalid response from server");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedValue("");
    setFromDate(dayjs().startOf("month"));
    setToDate(dayjs());
  };

  const filteredRows = rows
    .filter(row => {
      const term = searchTerm.toLowerCase();
      // General search across all columns
      return (
        (row.first_name && row.first_name.toLowerCase().includes(term)) ||
        (row.last_name && row.last_name.toLowerCase().includes(term)) ||
        (row.mlm_id && row.mlm_id.includes(term)) ||
        (row.mobile && row.mobile.includes(term)) ||
        (row.email && row.email.toLowerCase().includes(term))
      );
    })
    .sort((a, b) => {
      if (!selectedValue) return 0; // no sort if no column selected
      const valA = a[selectedValue] ? String(a[selectedValue]).toLowerCase() : "";
      const valB = b[selectedValue] ? String(b[selectedValue]).toLowerCase() : "";
      return valA.localeCompare(valB); // sort alphabetically
    });

  // Compact Stats Cards with hover effects
  const cards = [
    {
      label: "Active Users",
      value: masterReport.totalActiveusers ?? 0,
      color: "#4CAF50",
      icon: <PeopleIcon sx={{ fontSize: 20 }} />,
      bgColor: "#E8F5E8"
    },
    {
      label: "Inactive Users",
      value: masterReport.totalInactiveusers ?? 0,
      color: "#F44336",
      icon: <PersonOffIcon sx={{ fontSize: 20 }} />,
      bgColor: "#FFEBEE"
    },
    {
      label: "Prime Users",
      value: masterReport.totalPrimeusers ?? 0,
      color: "#FF6B35",
      icon: <VerifiedUserIcon sx={{ fontSize: 20 }} />,
      bgColor: "#FFF2ED"
    },
    {
      label: "Non-Prime Users",
      value: masterReport.totalNonprimeusers ?? 0,
      color: "#2196F3",
      icon: <PersonIcon sx={{ fontSize: 20 }} />,
      bgColor: "#E3F2FD"
    }
  ];

  const activeFilterCount = (searchTerm ? 1 : 0) + (selectedValue ? 1 : 0);

  return (
    <Layout>
      <Box sx={{ p: 1.5 }}>
        {/* Header with Title and Actions */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <Typography variant="h6" sx={{
            fontWeight: "bold",
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '18px'
          }}>
            User Details
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton
              size="small"
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                backgroundColor: showFilters ? '#2196f3' : '#f5f5f5',
                color: showFilters ? 'white' : 'inherit',
                '&:hover': {
                  backgroundColor: showFilters ? '#1976d2' : '#e0e0e0'
                }
              }}
            >
              <TuneIcon sx={{ fontSize: 18 }} />
            </IconButton>

            <IconButton
              size="small"
              onClick={handleResetFilters}
              sx={{
                backgroundColor: '#f5f5f5',
                '&:hover': { backgroundColor: '#e0e0e0' }
              }}
            >
              <RefreshIcon sx={{ fontSize: 18 }} />
            </IconButton>

            <Button
              variant="contained"
              onClick={() => setCashbackDialog(true)}
              startIcon={<AccountBalanceWalletIcon />}
              sx={{
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.8rem',
                px: 2,
                py: 0.8,
                background: 'linear-gradient(135deg, #FF6B35 0%, #FF8A65 100%)',
                textTransform: 'none',
                minWidth: 'auto'
              }}
            >
              Set Cashback
            </Button>

            <Button
              variant="contained"
              onClick={() => setOpenDialog(true)}
              startIcon={<PersonAddAltIcon />}
              sx={{
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.8rem',
                px: 2,
                py: 0.8,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                textTransform: 'none',
                minWidth: 'auto'
              }}
            >
              Add User
            </Button>
          </Box>
        </Box>

        {/* Compact Stats Cards */}
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          {cards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{
                backgroundColor: card.bgColor,
                borderLeft: `4px solid ${card.color}`,
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                height: '70px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 12px ${card.color}40`,
                  backgroundColor: card.color,
                  '& .card-label': {
                    color: '#fff !important',
                  },
                  '& .card-value': {
                    color: '#fff !important',
                  },
                  '& .card-icon': {
                    color: '#fff !important',
                  }
                }
              }}>
                <Box sx={{ flex: 1, textAlign: 'left' }}>
                  <Typography className="card-label" variant="subtitle2" sx={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#666',
                    mb: 0.5,
                    transition: 'color 0.3s ease'
                  }}>
                    {card.label}
                  </Typography>
                  <Typography className="card-value" sx={{
                    color: '#000',
                    fontSize: '18px',
                    fontWeight: 700,
                    lineHeight: 1,
                    transition: 'color 0.3s ease'
                  }}>
                    {card.value}
                  </Typography>
                </Box>
                <Box className="card-icon" sx={{
                  color: card.color,
                  transition: 'color 0.3s ease'
                }}>
                  {card.icon}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Compact Filters Section */}
        {showFilters && (
          <Card sx={{ p: 1.5, mb: 2, backgroundColor: '#f8f9fa' }}>
            <Box sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: 'wrap'
            }}>
              {/* Search Field */}
              <TextField
                placeholder="Search users..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: '#666', mr: 1, fontSize: 20 }} />,
                }}
                sx={{
                  width: "200px",
                  '& .MuiOutlinedInput-root': {
                    height: '36px',
                    fontSize: '0.8rem',
                  }
                }}
              />

              {/* Filter Field */}
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Filter By</InputLabel>
                <Select
                  value={selectedValue}
                  label="Filter By"
                  onChange={handleChange}
                  sx={{ height: '36px', fontSize: '0.8rem' }}
                >
                  <MenuItem value="">All Fields</MenuItem>
                  <MenuItem value="mlm_id">User ID</MenuItem>
                  <MenuItem value="first_name">Name</MenuItem>
                  <MenuItem value="mobile">Mobile</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="ref_mlm_id">Referral ID</MenuItem>
                  <MenuItem value="ref_first_name">Referral Name</MenuItem>
                  <MenuItem value="wallet_balance">Wallet</MenuItem>
                  <MenuItem value="cashback_balance">Cashback</MenuItem>
                  <MenuItem value="city">City</MenuItem>
                  <MenuItem value="state">State</MenuItem>
                  <MenuItem value="pincode">Pincode</MenuItem>
                </Select>
              </FormControl>

              {/* Date Range */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <DatePicker
                    value={fromDate}
                    format="DD/MM/YY"
                    onChange={handleFromDateChange}
                    slotProps={{
                      textField: {
                        size: "small",
                        placeholder: "From",
                        sx: {
                          width: 110,
                          '& .MuiInputBase-root': {
                            height: 36,
                            fontSize: '0.8rem'
                          }
                        }
                      }
                    }}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary', mx: 0.5 }}>
                    to
                  </Typography>
                  <DatePicker
                    value={toDate}
                    format="DD/MM/YY"
                    onChange={handleToDateChange}
                    slotProps={{
                      textField: {
                        size: "small",
                        placeholder: "To",
                        sx: {
                          width: 110,
                          '& .MuiInputBase-root': {
                            height: 36,
                            fontSize: '0.8rem'
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </LocalizationProvider>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <button
                  onClick={handleOKButtonClick}
                  disabled={loading}
                  style={{
                    backgroundColor: '#2196f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    height: '36px',
                    minWidth: '80px',
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
                {activeFilterCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    style={{
                      backgroundColor: '#f5f5f5',
                      color: '#666',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      height: '36px',
                      minWidth: '80px'
                    }}
                  >
                    Reset
                  </button>
                )}
              </Box>
            </Box>
          </Card>
        )}

        {/* Results Summary */}
        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="body2" sx={{ color: '#666', fontSize: '0.8rem' }}>
            Showing {filteredRows.length} of {rows.length} users
          </Typography>

          {/* Active Filter Chips */}
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {searchTerm && (
              <Chip
                label={`Search: ${searchTerm}`}
                size="small"
                onDelete={() => setSearchTerm('')}
              />
            )}
            {selectedValue && (
              <Chip
                label={`Filter: ${selectedValue.replace('_', ' ')}`}
                size="small"
                onDelete={() => setSelectedValue('')}
              />
            )}
          </Box>
        </Box>

        {/* Table Section */}
        <Transactions showServiceTrans={filteredRows} />

        {/* Dialogs */}
        <AddNewUser open={openDialog} onClose={() => setOpenDialog(false)} />
        <SetCashback
          open={cashbackDialog}
          onClose={() => setCashbackDialog(false)}
        />
      </Box>
    </Layout>
  );
}

export default withAuth(TransactionHistory);