"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import { DataDecrypt, DataEncrypt } from "../../utils/encryption";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import RatingTransactions from "@/components/Rating/Rating";
import {
  Grid,
  Typography,
  Box,
  TextField,
  Card,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Search,
  Refresh,
  Tune,
  Leaderboard,
  Star,
  TrendingUp,
} from "@mui/icons-material";

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

function RateReport(props) {
  const dispatch = useDispatch();
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [masterReport, setMasterReport] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const currentDate = new Date();
  const [fromDate, setFromDate] = useState(
    dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  );
  const [toDate, setToDate] = useState(dayjs());

  // Fetch rating data with encryption
  useEffect(() => {
    const getRatings = async () => {
      setLoading(true);
      setError("");
      
      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };

      try {
        // 🔹 Encrypt request payload
        const encryptedPayload = DataEncrypt(JSON.stringify(reqData));

        const response = await api.post("/api/rating/b417f7430a544d2cc3ae1ad4ed67f9e6f51453aa", {
          data: encryptedPayload, // send encrypted data
        });

        if (response.data?.data) {
          // 🔹 Decrypt backend response
          const decryptedData = DataDecrypt(response.data.data);
          console.log("Decrypted Response:", decryptedData);

          setShowServiceTrans(decryptedData.data || []);
          setMasterReport(decryptedData.report || {});
        } else {
          setError("Failed to fetch rating data");
        }
      } catch (error) {
        console.error("Error fetching ratings:", error);
        const errorMessage = error?.response?.data?.error || error.message || "Network error";
        setError(errorMessage);
        dispatch(callAlert({ message: errorMessage, type: "FAILED" }));
      } finally {
        setLoading(false);
      }
    };

    if (fromDate || toDate) {
      getRatings();
    }
  }, [fromDate, toDate, dispatch]);

  // Filter data based on search term
  const filteredRows = showServiceTrans.filter((row) => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      (row.service?.toLowerCase().includes(term)) ||
      (row.fisrt_name?.toLowerCase().includes(term)) ||
      (row.last_name?.toLowerCase().includes(term)) ||
      (row.rating?.toString().includes(term))
    );
  });

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setFromDate(dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)));
    setToDate(dayjs());
  };

  // Refresh data
  const handleRefresh = () => {
    window.location.reload();
  };

  // Stats configuration
  const statsCards = [
    {
      label: "Total User Ratings",
      value: masterReport.totalCount ?? 0,
      color: "#2196F3",
      icon: <Leaderboard sx={{ fontSize: 24 }} />,
      bgColor: "#E3F2FD"
    },
    {
      label: "Average Rating",
      value: masterReport.totalAvg ? parseFloat(masterReport.totalAvg).toFixed(1) : "0.0",
      color: "#FF9800",
      icon: <Star sx={{ fontSize: 24 }} />,
      bgColor: "#FFF3E0"
    },
    {
      label: "Rating System",
      value: "5 Stars",
      color: "#4CAF50",
      icon: <TrendingUp sx={{ fontSize: 24 }} />,
      bgColor: "#E8F5E8",
      isText: true
    }
  ];

  const activeFilterCount = [searchTerm].filter(Boolean).length;
  const hasDateFilter = fromDate?.startOf('month')?.valueOf() !== dayjs().startOf('month').valueOf() || 
                       toDate?.valueOf() !== dayjs().valueOf();

  return (
    <Layout>
      <Box sx={{ p: 2 }}>
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3 
        }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Rating Report
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton 
              size="small"
              onClick={() => setShowFilters(!showFilters)}
              sx={{ 
                bgcolor: showFilters ? 'primary.main' : 'grey.100',
                color: showFilters ? 'white' : 'grey.700',
                '&:hover': { 
                  bgcolor: showFilters ? 'primary.dark' : 'grey.200' 
                }
              }}
            >
              <Tune fontSize="small" />
            </IconButton>
            
            <IconButton 
              size="small"
              onClick={handleRefresh}
              disabled={loading}
              sx={{ 
                bgcolor: 'grey.100',
                color: 'grey.700',
                '&:hover': { bgcolor: 'grey.200' },
                '&:disabled': { opacity: 0.5 }
              }}
            >
              {loading ? <CircularProgress size={20} /> : <Refresh fontSize="small" />}
            </IconButton>
          </Box>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 2 }}
            action={
              <IconButton size="small" onClick={() => setError("")}>
                <Star fontSize="small" />
              </IconButton>
            }
          >
            {error}
          </Alert>
        )}

        {/* Stats Grid */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {statsCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ 
                p: 2,
                backgroundColor: card.bgColor,
                borderLeft: `4px solid ${card.color}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 24px ${card.color}20`,
                  backgroundColor: card.color,
                  '& .stat-text': {
                    color: 'white !important',
                  },
                  '& .stat-icon': {
                    color: 'white !important',
                  }
                }
              }}>
                <Box sx={{ flex: 1 }}>
                  <Typography className="stat-text" variant="subtitle2" sx={{ 
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#666',
                    mb: 0.5,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {card.label}
                  </Typography>
                  <Typography className="stat-text" sx={{ 
                    fontSize: card.isText ? '1rem' : '1.75rem',
                    fontWeight: 700,
                    color: card.isText ? '#666' : '#000',
                    lineHeight: 1.1,
                    fontStyle: card.isText ? 'italic' : 'normal'
                  }}>
                    {card.value}
                    {!card.isText && index === 1 && (
                      <Typography component="span" sx={{ fontSize: '1rem', ml: 0.5, color: 'inherit' }}>
                        /5
                      </Typography>
                    )}
                  </Typography>
                </Box>
                <Box className="stat-icon" sx={{ color: card.color, ml: 1 }}>
                  {card.icon}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Modern Filters Section */}
        {showFilters ? (
          <Card sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 2,
              flexWrap: 'wrap'
            }}>
              <TextField
                placeholder="Search by service, name, or rating..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ color: 'grey.500', mr: 1 }} />,
                }}
                sx={{
                  minWidth: 250,
                  '& .MuiOutlinedInput-root': {
                    height: 40,
                  }
                }}
                size="small"
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <DatePicker
                    value={fromDate}
                    onChange={setFromDate}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        label: "From Date",
                        sx: { 
                          width: 140,
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: '#e3e3e3',
                            },
                            '&:hover fieldset': {
                              borderColor: '#2196F3',
                            },
                          },
                        }
                      }
                    }}
                  />
                  <Typography variant="body2" sx={{ color: 'grey.600', mx: 1 }}>
                    to
                  </Typography>
                  <DatePicker
                    value={toDate}
                    onChange={setToDate}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        label: "To Date",
                        sx: { 
                          width: 140,
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: '#e3e3e3',
                            },
                            '&:hover fieldset': {
                              borderColor: '#2196F3',
                            },
                          },
                        }
                      }
                    }}
                  />
                </Box>
              </LocalizationProvider>

              {(activeFilterCount > 0 || hasDateFilter) && (
                <Box 
                  onClick={handleResetFilters}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'grey.600',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    '&:hover': { color: 'grey.800' }
                  }}
                >
                  <Refresh fontSize="small" />
                  Clear Filters
                </Box>
              )}
            </Box>

            {/* Active Filter Chips */}
            {(searchTerm || hasDateFilter) && (
              <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {searchTerm && (
                  <Chip 
                    label={`Search: ${searchTerm}`}
                    size="small"
                    onDelete={() => setSearchTerm('')}
                  />
                )}
                {hasDateFilter && (
                  <>
                    <Chip 
                      label={`From: ${fromDate.format('DD/MM/YY')}`}
                      size="small"
                      onDelete={() => setFromDate(dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)))}
                    />
                    <Chip 
                      label={`To: ${toDate.format('DD/MM/YY')}`}
                      size="small"
                      onDelete={() => setToDate(dayjs())}
                    />
                  </>
                )}
              </Box>
            )}
          </Card>
        ) : (
          // Original Filter Row when filters are collapsed
          <Grid item xs={12}>
            <FilterRow>
              <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} style={{ width: '50%', verticalAlign: 'center' }} >
                <Typography variant="h5" sx={{ padding: 2 }}>Rating</Typography>
              </Box>
              <Box
                display={'inline-block'}
                justifyContent={'space-between'}
                alignItems={'center'}
                mt={3}
                mb={1}
                sx={{ width: '20%', verticalAlign: 'top' }}
              >
                <TextField
                  placeholder="Search"
                  variant="standard"
                  size="small"
                  style={{ width: '100%' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search />,
                  }}
                />
              </Box>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="From Date"
                  value={fromDate}
                  sx={{
                    minWidth: 140,
                    background: '#fff',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#e3e3e3',
                      },
                      '&:hover fieldset': {
                        borderColor: '#2196F3',
                      },
                    },
                  }}
                  format="DD-MM-YYYY"
                  onChange={setFromDate}
                />
                <DatePicker
                  label="To Date"
                  value={toDate}
                  sx={{
                    minWidth: 140,
                    background: '#fff',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#e3e3e3',
                      },
                      '&:hover fieldset': {
                        borderColor: '#2196F3',
                      },
                    },
                  }}
                  format="DD-MM-YYYY"
                  onChange={setToDate}
                />
              </LocalizationProvider>
            </FilterRow>
          </Grid>
        )}

        {/* Results Summary */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2,
          flexWrap: 'wrap',
          gap: 1
        }}>
          <Typography variant="body2" sx={{ color: 'grey.600' }}>
            Showing {filteredRows.length} of {showServiceTrans.length} ratings
            {hasDateFilter && ` (filtered by date range)`}
            {loading && " (Loading...)"}
          </Typography>
          
          {masterReport.totalAvg && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Star sx={{ color: '#FF9800', fontSize: 18 }} />
              <Typography variant="body2" sx={{ color: 'grey.600', fontWeight: 600 }}>
                Average: {parseFloat(masterReport.totalAvg).toFixed(1)}/5
              </Typography>
            </Box>
          )}
        </Box>

        {/* Table Section */}
        <RatingTransactions showServiceTrans={filteredRows} />
      </Box>
    </Layout>
  );
}

export default withAuth(RateReport);