"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import KycTransactions from "@/components/KycReport/KycReport";
import {
  Grid,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  IconButton,
  Chip,
  Paper,
  CircularProgress
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import TuneIcon from "@mui/icons-material/Tune";
import PeopleIcon from "@mui/icons-material/People";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CancelIcon from "@mui/icons-material/Cancel";
import UploadIcon from "@mui/icons-material/Upload";
import UploadKyc from "./UploadKyc";
import { DataDecrypt, DataEncrypt } from "../../utils/encryption";

function KycReport() {
  const dispatch = useDispatch();
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [masterReport, setMasterReport] = useState({});
  const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
  const [toDate, setToDate] = useState(dayjs());
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchKycReport = async () => {
    setLoading(true);
    try {
      // 🔹 Prepare data
      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };

      //console.log("📤 Request Data:", reqData);

      // 🔹 Encrypt before sending
      const encryptedPayload = DataEncrypt(JSON.stringify(reqData));

      // 🔹 Send encrypted data
      const response = await api.post("/api/users/421abbe46f1f142bd142def0e11ad9f7433adad6", {
        data: encryptedPayload
      });

      //console.log("🔐 Raw API Response:", response.data);

      // 🔹 Handle encrypted response
      if (response.data?.data) {
        try {
          // Decrypt the response data
          const decryptedData = DataDecrypt(response.data.data);
          //console.log("🔓 Decrypted Data:", decryptedData);

          // Parse the decrypted JSON string
          const parsedData = (decryptedData);
          //console.log("📊 Parsed Data:", parsedData);

          if (parsedData.status === 200) {
            setShowServiceTrans(parsedData.data || []);
            setMasterReport(parsedData.report || {});

            dispatch(
              callAlert({
                message: "KYC report loaded successfully",
                type: "SUCCESS",
              })
            );
          } else {
            dispatch(
              callAlert({
                message: parsedData.message || "Failed to fetch KYC report",
                type: "FAILED",
              })
            );
          }
        } catch (decryptError) {
          console.error("❌ Decryption error:", decryptError);
          dispatch(
            callAlert({
              message: "Failed to decrypt response data",
              type: "FAILED",
            })
          );
        }
      } else if (response.data?.status === 200) {
        // 🔹 If response is already decrypted (fallback)
        //console.log("📥 Direct Response (No Encryption):", response.data);
        setShowServiceTrans(response.data.data || []);
        setMasterReport(response.data.report || {});
      } else {
        console.error("❌ Invalid response structure:", response.data);
        dispatch(
          callAlert({
            message: response.data?.message || "Invalid response from server",
            type: "FAILED",
          })
        );
      }
    } catch (error) {
      console.error("❌ API Error:", error);
      dispatch(
        callAlert({
          message: error?.response?.data?.error || error?.message || "Network error occurred",
          type: "FAILED",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycReport();
  }, [fromDate, toDate, dispatch]);

  const handleChange = (event) => setSelectedValue(event.target.value);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedValue("");
    setFromDate(dayjs().startOf("month"));
    setToDate(dayjs());
  };

  const handleRefreshData = async () => {
    await fetchKycReport();
  };

  const filteredRows = showServiceTrans.filter((row) => {
    if (!row) return false;

    const matchesSearch =
      (row.name && row.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.mlm_id && row.mlm_id.toString().includes(searchTerm)) ||
      (row.mobile && row.mobile.includes(searchTerm)) ||
      (row.pan_number && row.pan_number.includes(searchTerm)) ||
      (row.ifsc_code && row.ifsc_code.includes(searchTerm)) ||
      (row.nominee_name && row.nominee_name.includes(searchTerm)) ||
      (row.nominee_relation && row.nominee_relation.includes(searchTerm)) ||
      (row.account_number && row.account_number.includes(searchTerm));

    if (selectedValue !== "") {
      return row.status === parseInt(selectedValue) && matchesSearch;
    }
    return matchesSearch;
  });

  // Compact Stats Cards with hover effects
  const cards = [
    {
      label: "Total KYC",
      value: masterReport.totalKyc ?? 0,
      color: "#FF6B35",
      icon: <PeopleIcon sx={{ fontSize: 20 }} />,
      bgColor: "#FFF2ED"
    },
    {
      label: "Pending",
      value: masterReport.totalPendingKyc ?? 0,
      color: "#FF9800",
      icon: <PersonOffIcon sx={{ fontSize: 20 }} />,
      bgColor: "#FFF3E0"
    },
    {
      label: "Approved",
      value: masterReport.totalApprovedKyc ?? 0,
      color: "#4CAF50",
      icon: <VerifiedUserIcon sx={{ fontSize: 20 }} />,
      bgColor: "#E8F5E8"
    },
    {
      label: "Rejected",
      value: masterReport.totalRejectedKyc ?? 0,
      color: "#F44336",
      icon: <CancelIcon sx={{ fontSize: 20 }} />,
      bgColor: "#FFEBEE"
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
            KYC Report
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
              onClick={handleRefreshData}
              disabled={loading}
              sx={{
                backgroundColor: '#f5f5f5',
                '&:hover': { backgroundColor: '#e0e0e0' },
                '&:disabled': { opacity: 0.5 }
              }}
            >
              <RefreshIcon sx={{ fontSize: 18 }} />
            </IconButton>

            <Button
              variant="contained"
              onClick={() => setOpenDialog(true)}
              startIcon={<UploadIcon />}
              disabled={loading}
              sx={{
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.8rem',
                px: 2,
                py: 0.8,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                textTransform: 'none',
                minWidth: 'auto',
                '&:disabled': { opacity: 0.5 }
              }}
            >
              Upload KYC
            </Button>
          </Box>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 3 }}>
            <CircularProgress size={24} sx={{ mr: 2 }} />
            <Typography variant="body2" color="textSecondary">
              Loading KYC data...
            </Typography>
          </Box>
        )}

        {/* Compact Stats Cards */}
        {!loading && (
          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            {cards.map((card, index) => (
              <Grid item xs={12} sm={6} md={3} key={`card-${index}`}>
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
        )}

        {/* Compact Filters Section */}
        {!loading && showFilters && (
          <Paper sx={{ p: 1.5, mb: 2, backgroundColor: '#f8f9fa' }}>
            <Box sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: 'wrap'
            }}>
              {/* Search Field */}
              <TextField
                placeholder="Search KYC details..."
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

              {/* Status Filter */}
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedValue}
                  label="Status"
                  onChange={handleChange}
                  sx={{ height: '36px', fontSize: '0.8rem' }}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="0">Pending</MenuItem>
                  <MenuItem value="1">Approved</MenuItem>
                  <MenuItem value="2">Rejected</MenuItem>
                </Select>
              </FormControl>

              {/* Date Range */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <DatePicker
                    value={fromDate}
                    format="DD/MM/YY"
                    onChange={setFromDate}
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
                    onChange={setToDate}
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
                {activeFilterCount > 0 && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleResetFilters}
                    sx={{
                      backgroundColor: '#f5f5f5',
                      color: '#666',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      height: '36px',
                      minWidth: '80px',
                      textTransform: 'none'
                    }}
                  >
                    Reset
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        )}

        {/* Results Summary */}
        {!loading && (
          <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="body2" sx={{ color: '#666', fontSize: '0.8rem' }}>
              Showing {filteredRows.length} of {showServiceTrans.length} KYC records
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
                  label={`Status: ${selectedValue === "0" ? "Pending" :
                      selectedValue === "1" ? "Approved" : "Rejected"
                    }`}
                  size="small"
                  color={
                    selectedValue === "0" ? "warning" :
                      selectedValue === "1" ? "success" : "error"
                  }
                  onDelete={() => setSelectedValue('')}
                />
              )}
            </Box>
          </Box>
        )}

        {/* Table Section */}
        {!loading && <KycTransactions showServiceTrans={filteredRows} />}

        {/* Upload KYC Dialog */}
        <UploadKyc open={openDialog} onClose={() => setOpenDialog(false)} />
      </Box>
    </Layout>
  );
}

export default withAuth(KycReport);