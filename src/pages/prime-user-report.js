"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import {DataDecrypt,DataEncrypt} from "../../utils/encryption";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import PrimeUserTransactions from "@/components/UserReport/PrimeUserReport";
import {
  Grid,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Card,
  IconButton,
  Chip,
  alpha
} from "@mui/material";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import TuneIcon from "@mui/icons-material/Tune";
import PeopleIcon from "@mui/icons-material/People";
import StarIcon from "@mui/icons-material/Star";
import DiamondIcon from "@mui/icons-material/Diamond";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";

// Styled components for enhanced UI with improved hover effects
const StatCard = styled(Paper)(({ theme, bgcolor }) => ({
  background: `linear-gradient(135deg, ${bgcolor} 0%, ${alpha(bgcolor, 0.8)} 100%)`,
  color: "#fff",
  borderRadius: 16,
  padding: "24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  minHeight: 120,
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  transition: "all 0.3s ease-in-out",
  cursor: "pointer",
  '&:hover': {
    transform: "translateY(-4px)",
    boxShadow: `0 12px 40px ${alpha(bgcolor, 0.3)}`,
    background: `linear-gradient(135deg, ${alpha(bgcolor, 0.9)} 0%, ${alpha(bgcolor, 0.7)} 100%)`,
    '& .stat-icon': {
      opacity: 0.3,
      transform: "translateY(-50%) scale(1.1)",
    },
    '& .stat-value': {
      transform: "scale(1.05)",
    }
  }
}));

const StatContent = styled("div")({
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  flex: 1,
});

const StatValue = styled(Typography)({
  fontSize: "2.5rem",
  fontWeight: 700,
  lineHeight: 1,
  marginBottom: 8,
  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
  transition: "all 0.3s ease-in-out",
});

const StatLabel = styled(Typography)({
  fontSize: "0.875rem",
  fontWeight: 600,
  opacity: 0.9,
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  transition: "all 0.3s ease-in-out",
});

const StatIcon = styled("div")({
  position: "absolute",
  right: 20,
  top: "50%",
  transform: "translateY(-50%)",
  opacity: 0.2,
  fontSize: 80,
  zIndex: 1,
  transition: "all 0.3s ease-in-out",
});

const FilterSection = styled(Card)(({ theme }) => ({
  background: "linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)",
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  padding: "20px",
  marginBottom: 24,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  transition: "all 0.3s ease-in-out",
  '&:hover': {
    boxShadow: "0 6px 25px rgba(0,0,0,0.12)",
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  }
}));

// Hover effect wala card for alternative design
const HoverCard = styled(Card)(({ theme, bgcolor, hovercolor }) => ({
  backgroundColor: bgcolor,
  borderLeft: `4px solid ${hovercolor || bgcolor}`,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  height: '80px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: `0 8px 25px ${alpha(hovercolor || bgcolor, 0.3)}`,
    backgroundColor: hovercolor || bgcolor,
    '& .card-label': {
      color: '#fff !important',
    },
    '& .card-value': {
      color: '#fff !important',
      transform: 'scale(1.1)',
    },
    '& .card-icon': {
      color: '#fff !important',
      transform: 'scale(1.2)',
    }
  }
}));

function PrimeUserReport() {
  const dispatch = useDispatch();

  const [transactions, setTransactions] = useState([]);
  const [report, setReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [dateRangeFilter, setDateRangeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [cardStyle, setCardStyle] = useState("hover"); // 'gradient' or 'hover'

  const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
  const [toDate, setToDate] = useState(dayjs());

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // 1️⃣ Create payload
        const payload = {
          from_date: fromDate.format("YYYY-MM-DD"),
          to_date: toDate.format("YYYY-MM-DD"),
        };

        // 2️⃣ Encrypt request
        const reqData = {
          data: DataEncrypt(JSON.stringify(payload)),
        };

        // 3️⃣ API Call
        const response = await api.post("/api/refferal-report/943322354e0da498f5c5792bf3f1be0e5d993d1f", reqData);

        if (response.status === 200) {
          // 4️⃣ Decrypt backend response
          const decryptedString = DataDecrypt(response.data.data);
          const decrypted = decryptedString;

          setTransactions(decrypted.data || []);
          setReport(decrypted.report || null);
        }

      } catch (error) {
        dispatch(
          callAlert({
            message:
              error?.response?.data?.error || error.message || "Something went wrong",
            type: "FAILED",
          })
        );
      }
    };

    fetchTransactions();
  }, [fromDate, toDate, dispatch]);

  // Handlers
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handlePlanChange = (e) => setSelectedPlan(e.target.value);
  const handleDateRangeChange = (e) => setDateRangeFilter(e.target.value);
  const handleFromDateChange = (date) => setFromDate(date);
  const handleToDateChange = (date) => setToDate(date);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedPlan("");
    setDateRangeFilter("all");
    setFromDate(dayjs().startOf("month"));
    setToDate(dayjs());
  };

  const toggleCardStyle = () => {
    setCardStyle(cardStyle === "gradient" ? "hover" : "gradient");
  };

  // Function to parse date from prime_date field
  const parsePrimeDate = (primeDate) => {
    if (!primeDate) return null;

    // Try different date formats that might come from backend
    try {
      // Format: "DD-MM-YYYY HH:mm:ss"
      if (primeDate.includes('-')) {
        const parts = primeDate.split(' ')[0].split('-');
        if (parts.length === 3) {
          const day = parts[0];
          const month = parts[1];
          const year = parts[2];
          return dayjs(`${year}-${month}-${day}`);
        }
      }

      // Format: "YYYY-MM-DD HH:mm:ss"
      if (primeDate.includes('-')) {
        return dayjs(primeDate.split(' ')[0]);
      }

      // If it's already a timestamp or other format, let dayjs handle it
      return dayjs(primeDate);
    } catch (error) {
      console.error('Error parsing date:', primeDate, error);
      return null;
    }
  };

  // Function to get day of month from prime_date
  const getDayFromPrimeDate = (primeDate) => {
    const date = parsePrimeDate(primeDate);
    if (!date || !date.isValid()) return null;
    return date.date(); // Returns day of month (1-31)
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((row) => {
    const matchesSearch =
      row.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.mlm_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.mobile?.includes(searchTerm) ||
      row.referal_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.refer_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.refer_mobile?.includes(searchTerm) ||
      row.plan?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedPlan && row.plan?.toLowerCase() !== selectedPlan.toLowerCase()) return false;

    // Apply date range filter based on prime_date field
    if (dateRangeFilter !== "all" && row.prime_date) {
      const day = getDayFromPrimeDate(row.prime_date);

      if (day === null) return false; // Skip if date parsing failed

      if (dateRangeFilter === "s1") {
        return (day >= 26 && day <= 31) || (day >= 1 && day <= 5);
      } else if (dateRangeFilter === "s2") {
        return day >= 6 && day <= 15;
      } else if (dateRangeFilter === "s3") {
        return day >= 16 && day <= 25;
      }
    }

    return true;
  });

  // Gradient Style Stats Cards
  const gradientStatCards = [
    {
      label: "Total Users",
      value: report?.total_count ?? 0,
      bgcolor: "#2196F3",
      icon: <PeopleIcon sx={{ fontSize: 80 }} />,
    },
    {
      label: "Prime Users",
      value: report?.total_prime ?? 0,
      bgcolor: "#FF6B35",
      icon: <StarIcon sx={{ fontSize: 80 }} />,
    },
    {
      label: "Prime B Users",
      value: report?.total_primeB ?? 0,
      bgcolor: "#9C27B0",
      icon: <DiamondIcon sx={{ fontSize: 80 }} />,
    },
    {
      label: "Hybrid Users",
      value: report?.total_hybrid ?? 0,
      bgcolor: "#4CAF50",
      icon: <AutoAwesomeIcon sx={{ fontSize: 80 }} />,
    },
    {
      label: "Booster Users",
      value: report?.total_booster ?? 0,
      bgcolor: "#FF9800",
      icon: <RocketLaunchIcon sx={{ fontSize: 80 }} />,
    }
  ];

  // Hover Style Stats Cards
  const hoverStatCards = [
    {
      label: "Total Users",
      value: report?.total_count ?? 0,
      color: "#2196F3",
      bgColor: "#E3F2FD",
      hoverColor: "#2196F3",
      icon: <PeopleIcon sx={{ fontSize: 24 }} />,
    },
    {
      label: "Prime Users",
      value: report?.total_prime ?? 0,
      color: "#FF6B35",
      bgColor: "#FFF2ED",
      hoverColor: "#FF6B35",
      icon: <StarIcon sx={{ fontSize: 24 }} />,
    },
    {
      label: "Prime B Users",
      value: report?.total_primeB ?? 0,
      color: "#9C27B0",
      bgColor: "#F3E5F5",
      hoverColor: "#9C27B0",
      icon: <DiamondIcon sx={{ fontSize: 24 }} />,
    },
    {
      label: "Hybrid Users",
      value: report?.total_hybrid ?? 0,
      color: "#4CAF50",
      bgColor: "#E8F5E8",
      hoverColor: "#4CAF50",
      icon: <AutoAwesomeIcon sx={{ fontSize: 24 }} />,
    },
    {
      label: "Booster Users",
      value: report?.total_booster ?? 0,
      color: "#FF9800",
      bgColor: "#FFF3E0",
      hoverColor: "#FF9800",
      icon: <RocketLaunchIcon sx={{ fontSize: 24 }} />,
    }
  ];

  const activeFilterCount = (searchTerm ? 1 : 0) + (selectedPlan ? 1 : 0) + (dateRangeFilter !== "all" ? 1 : 0);

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        {/* Header Section */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4
        }}>
          <Box>
            <Typography variant="h4" sx={{
              fontWeight: "bold",
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}>
              Prime User Analytics
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {/* Card Style Toggle */}
            <IconButton
              onClick={toggleCardStyle}
              sx={{
                backgroundColor: cardStyle === 'gradient' ? 'primary.main' : 'grey.100',
                color: cardStyle === 'gradient' ? 'white' : 'text.primary',
                '&:hover': {
                  backgroundColor: cardStyle === 'gradient' ? 'primary.dark' : 'grey.200'
                }
              }}
            >
              <AutoAwesomeIcon />
            </IconButton>

            <IconButton
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                backgroundColor: showFilters ? 'primary.main' : 'grey.100',
                color: showFilters ? 'white' : 'text.primary',
                '&:hover': {
                  backgroundColor: showFilters ? 'primary.dark' : 'grey.200'
                }
              }}
            >
              <TuneIcon />
            </IconButton>

            <IconButton
              onClick={handleResetFilters}
              sx={{
                backgroundColor: 'grey.100',
                '&:hover': { backgroundColor: 'grey.200' }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Enhanced Stats Cards - Two Different Styles */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {cardStyle === "gradient" ? (
            // Gradient Cards with Hover Effects
            gradientStatCards.map((card, index) => (
              <Grid item xs={12} sm={6} md={2.4} key={index}>
                <StatCard bgcolor={card.bgcolor}>
                  <StatContent>
                    <StatValue className="stat-value">{card.value}</StatValue>
                    <StatLabel>{card.label}</StatLabel>
                  </StatContent>
                  <StatIcon className="stat-icon">
                    {card.icon}
                  </StatIcon>
                </StatCard>
              </Grid>
            ))
          ) : (
            // Hover Color Change Cards
            hoverStatCards.map((card, index) => (
              <Grid item xs={12} sm={6} md={2.4} key={index}>
                <HoverCard
                  bgcolor={card.bgColor}
                  hovercolor={card.hoverColor}
                >
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
                      fontSize: '20px',
                      fontWeight: 700,
                      lineHeight: 1,
                      transition: 'all 0.3s ease'
                    }}>
                      {card.value}
                    </Typography>
                  </Box>
                  <Box className="card-icon" sx={{
                    color: card.color,
                    transition: 'all 0.3s ease'
                  }}>
                    {card.icon}
                  </Box>
                </HoverCard>
              </Grid>
            ))
          )}
        </Grid>

        {/* Enhanced Filters Section */}
        {showFilters && (
          <FilterSection>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <LeaderboardIcon color="primary" />
              <Typography variant="h6" fontWeight="600">
                Filter Options
              </Typography>
              {activeFilterCount > 0 && (
                <Chip
                  label={`${activeFilterCount} active filters`}
                  color="primary"
                  size="small"
                />
              )}
            </Box>

            <Grid container spacing={2} alignItems="center">
              {/* Search */}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  placeholder="Search users, MLM ID, mobile..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                  }}
                  size="small"
                />
              </Grid>

              {/* Plan Filter */}
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Plan Type</InputLabel>
                  <Select value={selectedPlan} label="Plan Type" onChange={handlePlanChange}>
                    <MenuItem value="">All Plans</MenuItem>
                    <MenuItem value="Hybrid Prime">Hybrid Prime</MenuItem>
                    <MenuItem value="Booster Prime">Booster Prime</MenuItem>
                    <MenuItem value="Prime">Prime</MenuItem>
                    <MenuItem value="Prime B">Prime B</MenuItem>
                    <MenuItem value="Repurchase">Repurchase</MenuItem>
                    <MenuItem value="Royality">Royality</MenuItem>
                    <MenuItem value="Redeem">Redeem</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Date Range Filter */}
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Date Range</InputLabel>
                  <Select value={dateRangeFilter} label="Date Range" onChange={handleDateRangeChange}>
                    <MenuItem value="all">All Dates</MenuItem>
                    <MenuItem value="s1">S1 (26-5)</MenuItem>
                    <MenuItem value="s2">S2 (6-15)</MenuItem>
                    <MenuItem value="s3">S3 (16-25)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Date Pickers */}
              <Grid item xs={12} md={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <DatePicker
                      label="From Date"
                      value={fromDate}
                      onChange={handleFromDateChange}
                      slotProps={{ textField: { size: "small", fullWidth: true } }}
                    />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      to
                    </Typography>
                    <DatePicker
                      label="To Date"
                      value={toDate}
                      onChange={handleToDateChange}
                      slotProps={{ textField: { size: "small", fullWidth: true } }}
                    />
                  </Box>
                </LocalizationProvider>
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12} md={2}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <button
                    onClick={handleResetFilters}
                    style={{
                      flex: 1,
                      backgroundColor: '#f5f5f5',
                      color: '#666',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      height: '40px',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#e0e0e0';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#f5f5f5';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    Clear
                  </button>
                </Box>
              </Grid>
            </Grid>

            {/* Active Filter Chips */}
            {(searchTerm || selectedPlan || dateRangeFilter !== 'all') && (
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {searchTerm && (
                  <Chip
                    label={`Search: ${searchTerm}`}
                    onDelete={() => setSearchTerm('')}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {selectedPlan && (
                  <Chip
                    label={`Plan: ${selectedPlan}`}
                    onDelete={() => setSelectedPlan('')}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {dateRangeFilter !== 'all' && (
                  <Chip
                    label={`Period: ${dateRangeFilter.toUpperCase()}`}
                    onDelete={() => setDateRangeFilter('all')}
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Box>
            )}

            {/* Date Range Filter Info */}
            <Box sx={{ mt: 2, p: 1.5, backgroundColor: alpha('#2196F3', 0.05), borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                <strong>Date Range Filter Info:</strong> S1 (26th to 5th) | S2 (6th to 15th) | S3 (16th to 25th) of each month
              </Typography>
            </Box>
          </FilterSection>
        )}

        {/* Results Summary */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          p: 2,
          backgroundColor: 'grey.50',
          borderRadius: 2
        }}>
          <Typography variant="subtitle1" fontWeight="600">
            Transaction Results
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Showing <strong>{filteredTransactions.length}</strong> of <strong>{transactions.length}</strong> users
          </Typography>
        </Box>

        {/* Debug Info (optional - remove in production) */}
        {process.env.NODE_ENV === 'development' && filteredTransactions.length > 0 && (
          <Box sx={{ mb: 2, p: 1, backgroundColor: '#fff3cd', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              <strong>Debug:</strong> First transaction prime_date: {filteredTransactions[0]?.prime_date} |
              Parsed day: {getDayFromPrimeDate(filteredTransactions[0]?.prime_date)}
            </Typography>
          </Box>
        )}

        {/* Table Section */}
        <Card sx={{
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          <PrimeUserTransactions showServiceTrans={filteredTransactions} />
        </Card>
      </Box>
    </Layout>
  );
}

export default withAuth(PrimeUserReport);