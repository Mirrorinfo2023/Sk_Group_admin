"use client";
import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Layout from "@/components/Dashboard/layout";
import {
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Divider,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  tableCellClasses,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  InputAdornment,
  Alert,
  CircularProgress,
  Card,
} from "@mui/material";
import { DataEncrypt, DataDecrypt } from '../../utils/encryption';
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from '@mui/icons-material/Refresh';
import TuneIcon from '@mui/icons-material/Tune';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MessageIcon from '@mui/icons-material/Message';
import TemplateIcon from '@mui/icons-material/Description';
import axios from "axios";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

// Template type options
const templateTypeOptions = [
  "login", "register", "kyc", "referral", "recharge_success", "recharge_failed",
  "addmoney_request_pending", "addmoney_request_approved", "addmoney_request_reject",
  "insurance_request", "send_money_user", "send_money_sender", "kyc_approved",
  "kyc_request", "kyc_reject", "addmoney", "addmoney_fail", "redeem_request",
  "redeem_reject", "redeem_approve", "feedback", "admin_incomecredit", "id_autoblock",
  "prime_purchase", "welcome", "password_reset", "order_confirmation", "payment_success",
  "payment_failure", "account_verification", "promotional", "otp", "slab1", "slab2", "slab3",
];

// Template variables mapping
const templateVariablesByType = {
  register: ["first_name", "last_name", "mobile"],
  login: ["first_name", "last_name", "address", "mobile"],
  referral: ["referal_fname", "referal_lname", "user_fname", "user_lname", "mobile", "mlm_user_id"],
  password_reset: ["first_name", "last_name", "mobile"],
  recharge_success: ["first_name", "last_name", "mobile", "cbamount", "main_amount", "consumer_mobile", "transactionID"],
  recharge_failed: ["first_name", "last_name", "mobile", "main_amount", "consumer_mobile"],
  addmoney_request_pending: ["first_name", "last_name", "mobile", "amount"],
  addmoney_request_approved: ["first_name", "last_name", "mobile", "amount"],
  addmoney_request_reject: ["first_name", "last_name", "mobile", "amount", "rejection_reason"],
  insurance_request: ["first_name", "last_name", "mobile"],
  send_money_user: ["touserFirstName", "touserLastName", "to_mobile", "fromuserFirstName", "fromuserLastName", "amount"],
  send_money_sender: ["touserFirstName", "touserLastName", "to_mobile", "fromuserFirstName", "fromuserLastName", "amount"],
  kyc_approved: ["first_name", "last_name", "mobile"],
  kyc_request: ["first_name", "last_name", "mobile"],
  kyc_reject: ["first_name", "last_name", "mobile", "rejection_reason"],
  addmoney: ["first_name", "last_name", "mobile", "amount"],
  addmoney_fail: ["first_name", "last_name", "mobile", "amount"],
  redeem_request: ["first_name", "last_name", "mobile", "amount"],
  redeem_reject: ["first_name", "last_name", "mobile", "amount", "reason"],
  redeem_approve: ["first_name", "last_name", "mobile", "amount"],
  feedback: ["first_name", "last_name"],
  admin_incomecredit: ["first_name", "last_name", "amount", "wallet_type"],
  id_autoblock: ["first_name", "last_name"],
  prime_purchase: ["name", "plan_name"],
  default: [
    "first_name", "last_name", "config.APP_NAME", "created_on", "referal_fname",
    "referal_lname", "user_fname", "user_lname", "mobile", "mlm_user_id",
    "config.SUPPORT_TEAM", "cbamount", "main_amount", "consumer_mobile", "amount",
    "touserFirstName", "touserLastName", "fromuserFirstName", "fromuserLastName",
    "rejection_reason", "reason", "wallet_type", "name", "address", "otp",
  ],
};

const fillTemplate = (template, values) => {
  if (!template) return "";
  return template.replace(/\$\{(.*?)\}/g, (_, key) => {
    const trimmedKey = key.trim();
    return values[trimmedKey] ?? `\${${trimmedKey}}`;
  });
};

function MessageSetting() {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newSlab, setNewSlab] = useState("");
  const [openSlabDialog, setOpenSlabDialog] = useState(false);
  const [intervalDays, setIntervalDays] = useState(7);
  const [availableVariables, setAvailableVariables] = useState(templateVariablesByType.default);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState("");

  const [currentMessage, setCurrentMessage] = useState({
    id: "",
    title: "",
    type: "",
    templateType: "",
    body: "",
  });

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Calculate message statistics
  const messageStats = {
    totalMessages: messages.length,
    emailMessages: messages.filter(msg => msg.type === 'email').length,
    whatsappMessages: messages.filter(msg => msg.type === 'whatsapp').length,
    activeTemplates: [...new Set(messages.map(msg => msg.templateType))].length
  };

  // Stats Cards
  const cards = [
    {
      label: "Total Messages",
      value: messageStats.totalMessages ?? 0,
      color: "#2196F3",
      icon: <MessageIcon sx={{ fontSize: 20 }} />,
      bgColor: "#E3F2FD"
    },
    {
      label: "Email Templates",
      value: messageStats.emailMessages ?? 0,
      color: "#4CAF50",
      icon: <EmailIcon sx={{ fontSize: 20 }} />,
      bgColor: "#E8F5E8"
    },
    {
      label: "WhatsApp Templates",
      value: messageStats.whatsappMessages ?? 0,
      color: "#25D366",
      icon: <WhatsAppIcon sx={{ fontSize: 20 }} />,
      bgColor: "#E8F5E8"
    },
    {
      label: "Template Types",
      value: messageStats.activeTemplates ?? 0,
      color: "#FF9800",
      icon: <TemplateIcon sx={{ fontSize: 20 }} />,
      bgColor: "#FFF3E0"
    }
  ];

  const handleAddSlab = async () => {
    if (newSlab.trim() === "") {
      setError("Slab name is required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const slabPayload = {
        name: newSlab.trim(),
        interval_days: intervalDays,
      };

      const encryptedData = DataEncrypt(JSON.stringify(slabPayload));

      const response = await fetch(`${API_BASE}api/slab/add-slab`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: encryptedData })
      });

      const responseData = await response.json();
      //console.log("responseData ", responseData)
      if (response.ok) {
        const decryptedResponse = DataDecrypt(responseData.message);
        templateTypeOptions.push(newSlab.trim());
        setNewSlab("");
        setIntervalDays(7);
        setOpenSlabDialog(false);
        setSuccess(decryptedResponse.message || "Slab type added successfully");
      } else {
        const decryptedError = DataDecrypt(responseData.message);
        setError(decryptedError.message || "Failed to add slab type");
      }
    } catch (error) {
      console.error("Network error:", error);
      setError("Network error: Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages
  const fetchMessages = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${API_BASE}api/marketing/909c9e6b17fd0bab24254d057a09a88e8db32bcc`);
      //console.log("Raw Response:", response.data);

      if (response.data.success) {
        const encryptedList = response.data.data;

        const decryptedList = encryptedList.map(item => {
          try {
            // 1️⃣ decrypt the base64 encrypted string
            const decryptedStr = DataDecrypt(item.data);
            //console.log("decryptedStr" ,decryptedStr)
            // 2️⃣ ensure decrypted string is valid JSON → convert to object
            const parsed = (decryptedStr);
            //console.log("parsed" ,parsed)
            return parsed;
          } catch (err) {
            console.error("Decrypt error:", err);
            return null;
          }
        }).filter(Boolean); // remove null values

        //console.log("FINAL DECRYPTED LIST:", decryptedList);

        setMessages(decryptedList);
        setFilteredData(decryptedList);

      } else {
        setError("Failed to fetch messages");
      }

    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchMessages();
  }, []);

  // Search functionality
  const handleSearch = (text) => {
    setSearchTerm(text);
    if (messages && messages.length > 0) {
      const filtered = messages.filter(item =>
        item.title?.toLowerCase().includes(text.toLowerCase()) ||
        item.body?.toLowerCase().includes(text.toLowerCase()) ||
        item.type?.toLowerCase().includes(text.toLowerCase()) ||
        item.templateType?.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const handleApplyFilters = () => {
    let filtered = messages;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.body?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.templateType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    setFilteredData(filtered);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedType("");
    setFilteredData(messages);
    setShowFilters(false);
  };

  const handleViewOpen = (message) => {
    setSelectedMessage(message);
    setOpenViewDialog(true);
  };

  const handleViewClose = () => setOpenViewDialog(false);

  const handleEditOpen = (message) => {
    setCurrentMessage(message);
    setAvailableVariables(
      templateVariablesByType[message.templateType] || templateVariablesByType.default
    );
    setOpenEditDialog(true);
  };

  const handleEditClose = () => setOpenEditDialog(false);

  const handleAddOpen = () => {
    setCurrentMessage({
      id: "",
      title: "",
      type: "",
      templateType: "",
      body: "",
    });
    setAvailableVariables(templateVariablesByType.default);
    setOpenAddDialog(true);
  };

  const handleAddClose = () => setOpenAddDialog(false);

  const handleTemplateTypeChange = (templateType) => {
    setCurrentMessage({ ...currentMessage, templateType });
    setAvailableVariables(
      templateVariablesByType[templateType] || templateVariablesByType.default
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {

      // 1️⃣ Prepare encrypted request body
      const encryptedReq = DataEncrypt(
        JSON.stringify({
          title: currentMessage.title,
          body: currentMessage.body,
          type: currentMessage.type,
          templateType: currentMessage.templateType,
          created_by: 1
        })
      );

      const response = await fetch(`${API_BASE}api/marketing/999c9e6b17fd0bab24254d057a09a88e8db32bcc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: encryptedReq })
      });

      const raw = await response.json();
      // console.log("Encrypted Insert Response:", raw);

      if (!raw.success) {
        setError("Failed to create message");
        return;
      }

      // 2️⃣ Decrypt backend response
      const decryptedStr = DataDecrypt(raw.data);
      const decrypted =decryptedStr;

      // console.log("Decrypted Insert Response:", decrypted);

      setSuccess(decrypted.message);
      fetchMessages();
      handleAddClose();

    } catch (error) {
      setError("Network error: Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };


  const handleUpdate = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const encryptedMessage = DataEncrypt(JSON.stringify(currentMessage));

      const response = await fetch(`${API_BASE}api/marketing/001c9e6b17fd0bab24254d057a09a88e8db32bcc/${currentMessage.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: encryptedMessage }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setSuccess('Message updated successfully');
        handleEditClose();
        fetchMessages();
      } else {
        setError(responseData.message || 'Failed to update message');
      }
    } catch (error) {
      setError('Network error: Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    setLoading(true);
    try {
      const encryptedId = DataEncrypt(JSON.stringify({ id }));

      const response = await fetch(`${API_BASE}api/marketing/111c9e6b17fd0bab24254d057a09a88e8db32bcc/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: encryptedId }),
      });

      const responseData = await response.json();

      let decryptedMessage = '';
      if (responseData.message) {
        try {
          const decrypted = DataDecrypt(responseData.message);
          decryptedMessage = typeof decrypted === 'object' && decrypted.message ? decrypted.message : decrypted;
        } catch (err) {
          decryptedMessage = responseData.message;
        }

        setSuccess(decryptedMessage);
        setMessages(messages.filter((msg) => msg.id !== id));
        fetchMessages();
      } else {
        const decryptedError = responseData.message ? DataDecrypt(responseData.message) : '';
        setError(decryptedError || 'Failed to delete message');
      }
    } catch (error) {
      setError('Network error: Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const insertTemplateVariable = (variable) => {
    setCurrentMessage({
      ...currentMessage,
      body: currentMessage.body + `\${${variable}}`
    });
  };

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
            Message Settings
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
              onClick={handleAddOpen}
              startIcon={<AddIcon />}
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
              Add Message
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
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
                  '& .card-label': { color: '#fff !important' },
                  '& .card-value': { color: '#fff !important' },
                  '& .card-icon': { color: '#fff !important' }
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

        {/* Filters Section */}
        {showFilters && (
          <Paper sx={{ p: 1.5, mb: 2, backgroundColor: '#f8f9fa' }}>
            <Box sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: 'wrap'
            }}>
              {/* Search Field */}
              <TextField
                placeholder="Search messages..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
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

              {/* Type Filter */}
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={selectedType}
                  label="Type"
                  onChange={(e) => setSelectedType(e.target.value)}
                  sx={{ height: '36px', fontSize: '0.8rem' }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="whatsapp">WhatsApp</MenuItem>
                </Select>
              </FormControl>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <button
                  onClick={handleApplyFilters}
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
                    minWidth: '80px'
                  }}
                >
                  Apply
                </button>
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
              </Box>
            </Box>
          </Paper>
        )}

        {/* Main Content */}
        <Grid container spacing={2}>
          {error && (
            <Grid item xs={12}>
              <Alert severity="error" onClose={() => setError("")}>
                {error}
              </Alert>
            </Grid>
          )}
          {success && (
            <Grid item xs={12}>
              <Alert severity="success" onClose={() => setSuccess("")}>
                {success}
              </Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <TableContainer component={Paper} elevation={3}>
              {loading ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : (
                <Table sx={{ minWidth: 700 }}>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>SR No.</StyledTableCell>
                      <StyledTableCell>Title</StyledTableCell>
                      <StyledTableCell>Type</StyledTableCell>
                      <StyledTableCell>Template Type</StyledTableCell>
                      <StyledTableCell>Content Preview</StyledTableCell>
                      <StyledTableCell>Date & Time</StyledTableCell>
                      <StyledTableCell>Actions</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <StyledTableRow>
                        <StyledTableCell colSpan={7} align="center">
                          {messages.length === 0 ? "No messages found" : "No matching messages found"}
                        </StyledTableCell>
                      </StyledTableRow>
                    ) : (
                      filteredData.map((message, index) => (
                        <StyledTableRow key={message.id}>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>{message.title}</StyledTableCell>
                          <StyledTableCell>{message.type}</StyledTableCell>
                          <StyledTableCell>{message.templateType}</StyledTableCell>
                          <StyledTableCell>
                            {message.body && message.body.length > 50
                              ? `${message.body.substring(0, 50)}...`
                              : message.body || "—"}
                          </StyledTableCell>
                          <StyledTableCell>
                            {message.created_on ? new Date(message.created_on).toLocaleString() : "—"}
                          </StyledTableCell>
                          <StyledTableCell>
                            <IconButton onClick={() => handleViewOpen(message)} color="primary" title="View">
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton onClick={() => handleEditOpen(message)} color="secondary" title="Edit">
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(message.id)} color="error" title="Delete">
                              <DeleteIcon />
                            </IconButton>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </Grid>
        </Grid>

        {/* View Dialog */}
        <Dialog open={openViewDialog} onClose={handleViewClose} maxWidth="md" fullWidth>
          <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
            Message Details
            <IconButton onClick={handleViewClose} sx={{ position: "absolute", right: 8, top: 8, color: "white" }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ pt: 3 }}>
            {selectedMessage && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  <strong>Title:</strong> {selectedMessage.title}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <strong>Type:</strong> {selectedMessage.type}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <strong>Template Type:</strong> {selectedMessage.templateType}
                </Typography>

                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Content:</strong>
                </Typography>
                <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1, whiteSpace: 'pre-wrap' }}>
                  {fillTemplate(selectedMessage.body, {
                    first_name: "user_name",
                    last_name: "Last_Name",
                    otp: "******",
                    config: { APP_NAME: "MyApp", SUPPORT_TEAM: "Support Team" },
                    created_on: new Date().toLocaleString(),
                    mobile: "1234567890",
                  })}
                </Box>

                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Raw Content with Template Variables:</strong>
                </Typography>
                <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1, fontFamily: 'monospace' }}>
                  {selectedMessage.body}
                </Box>

                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Available Variables for this Template Type:</strong>
                </Typography>
                <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1, fontFamily: 'monospace' }}>
                  {availableVariables.map((variable, index) => (
                    <Typography key={index} variant="body2">
                      {`\${${variable}}`}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleViewClose}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Add Slab Dialog */}
        <Dialog open={openSlabDialog} onClose={() => !loading && setOpenSlabDialog(false)}>
          <DialogTitle>Add New Slab Type</DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              autoFocus
              margin="dense"
              label="Slab Name"
              fullWidth
              value={newSlab}
              onChange={(e) => setNewSlab(e.target.value)}
              sx={{ mb: 2 }}
              disabled={loading}
            />
            <TextField
              margin="dense"
              label="Interval Days"
              type="number"
              fullWidth
              value={intervalDays}
              onChange={(e) => setIntervalDays(parseInt(e.target.value) || 7)}
              inputProps={{ min: 1 }}
              disabled={loading}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenSlabDialog(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleAddSlab}
              variant="contained"
              color="primary"
              disabled={loading || !newSlab.trim()}
            >
              {loading ? <CircularProgress size={24} /> : "Add"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add/Edit Dialog */}
        <Dialog
          open={openEditDialog || openAddDialog}
          onClose={() => {
            if (currentMessage && currentMessage.id) handleEditClose();
            else handleAddClose();
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
            {currentMessage.id ? "Edit Message" : "Add New Message"}
            <IconButton
              onClick={() => {
                if (currentMessage && currentMessage.id) handleEditClose();
                else handleAddClose();
              }}
              sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={currentMessage.title || ""}
                  onChange={(e) => setCurrentMessage({ ...currentMessage, title: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="type-select">Type</InputLabel>
                  <Select
                    labelId="type-select"
                    label="Type"
                    value={currentMessage.type || ""}
                    onChange={(e) => setCurrentMessage({ ...currentMessage, type: e.target.value })}
                  >
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="whatsapp">WhatsApp</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <FormControl fullWidth>
                    <InputLabel id="template-type-select">Template Type</InputLabel>
                    <Select
                      labelId="template-type-select"
                      label="Template Type"
                      value={currentMessage.templateType || ""}
                      onChange={(e) => handleTemplateTypeChange(e.target.value)}
                    >
                      {templateTypeOptions.map((type, idx) => (
                        <MenuItem key={idx} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <IconButton color="primary" onClick={() => setOpenSlabDialog(true)}>
                    <AddIcon />
                  </IconButton>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  label="Content"
                  value={currentMessage.body || ""}
                  onChange={(e) => setCurrentMessage({ ...currentMessage, body: e.target.value })}
                  helperText="Use ${variable_name} for template variables"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Insert Template Variable</InputLabel>
                  <Select
                    value=""
                    label="Insert Template Variable"
                    onChange={(e) => insertTemplateVariable(e.target.value)}
                  >
                    {availableVariables.map((keyword) => (
                      <MenuItem key={keyword} value={keyword}>
                        {`\${${keyword}}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            {currentMessage.id && (
              <Button
                color="error"
                onClick={() => { handleDelete(currentMessage.id); }}
                disabled={loading}
              >
                Delete
              </Button>
            )}
            <Button
              onClick={() => {
                if (currentMessage && currentMessage.id) handleEditClose();
                else handleAddClose();
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={currentMessage.id ? handleUpdate : handleSubmit}
              disabled={loading || !currentMessage.title || !currentMessage.type || !currentMessage.templateType || !currentMessage.body}
            >
              {loading ? <CircularProgress size={24} /> : (currentMessage.id ? "Update" : "Save")}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}

export default MessageSetting;