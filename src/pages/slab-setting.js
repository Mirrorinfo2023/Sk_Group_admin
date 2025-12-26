"use client";
import React, { useMemo, useState, useEffect } from "react";
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
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ReCAPTCHA from "react-google-recaptcha";

// Styled table cells
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
    fontWeight: "600",
    textTransform: "uppercase",
    fontSize: "0.85rem",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
    transition: "0.2s",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const DialogWrapper = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 12,
    padding: theme.spacing(1),
  },
}));

function SlabSetting() {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openSlabDialog, setOpenSlabDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [labelOptions, setLabelOptions] = useState([]);
  const [newSlab, setNewSlab] = useState("");
  const [intervalDays, setIntervalDays] = useState(7);
  const [captchaValue, setCaptchaValue] = useState(null);

  const [currentMessage, setCurrentMessage] = useState({
    id: "",
    label_name: "",
    whatsapp_content: "",
    email_content: "",
    message_content: "",
  });

  // --- fetch slabs ---
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const testMessages = [
        {
          id: 1,
          label_name: "Welcome Message",
          whatsapp_content: "Welcome to our service {{first_name}}!",
          email_content: "Dear {{first_name}}, Welcome!",
          message_content: "Hi {{first_name}} 👋",
          date_time: new Date().toLocaleString(),
        },
        {
          id: 2,
          label_name: "OTP Message",
          whatsapp_content: "Your OTP is {{otp}}",
          email_content: "Your OTP is {{otp}}, valid for 5 mins",
          message_content: "OTP {{otp}}",
          date_time: new Date().toLocaleString(),
        },
      ];
      setMessages(testMessages);
      setLabelOptions([
        "Welcome Message",
        "OTP Message",
        "Payment Success",
        "Password Reset",
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const filteredMessages = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return messages;
    return messages.filter((m) =>
      `${m.label_name} ${m.whatsapp_content} ${m.email_content} ${m.message_content}`
        .toLowerCase()
        .includes(q)
    );
  }, [messages, searchTerm]);

  return (
    <Layout>
      <Grid container spacing={2} sx={{ p: 2 }}>
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

        {/* Table Section */}
        <Grid item xs={12}>
          <Paper elevation={4} sx={{ borderRadius: 3, overflow: "hidden" }}>
            {/* Header */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={2}
              sx={{ background: "linear-gradient(45deg, #1976d2, #1565c0)" }}
            >
              <Typography variant="h6" color="white" fontWeight={600}>
                📊 Marketing — Slab Settings
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search slabs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    backgroundColor: "white",
                    borderRadius: 2,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "white",
                    color: "primary.main",
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                  startIcon={<AddIcon />}
                  onClick={() => setOpenAddDialog(true)}
                >
                  Add New Slab
                </Button>
              </Box>
            </Box>

            {/* Table */}
            {loading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>SR No.</StyledTableCell>
                    <StyledTableCell>Slab Name</StyledTableCell>
                    <StyledTableCell>WhatsApp</StyledTableCell>
                    <StyledTableCell>Email</StyledTableCell>
                    <StyledTableCell>Calls</StyledTableCell>
                    <StyledTableCell>Date & Time</StyledTableCell>
                    <StyledTableCell align="center">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredMessages.length === 0 ? (
                    <StyledTableRow>
                      <StyledTableCell colSpan={7} align="center">
                        No slabs found.
                      </StyledTableCell>
                    </StyledTableRow>
                  ) : (
                    filteredMessages.map((message, index) => (
                      <StyledTableRow key={message.id}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>
                          <Chip
                            label={message.label_name}
                            color="primary"
                            sx={{ fontWeight: 600 }}
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          {message.whatsapp_content}
                        </StyledTableCell>
                        <StyledTableCell>{message.email_content}</StyledTableCell>
                        <StyledTableCell>
                          {message.message_content}
                        </StyledTableCell>
                        <StyledTableCell>{message.date_time}</StyledTableCell>
                        <StyledTableCell align="center">
                          <IconButton color="primary">
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton color="secondary">
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error">
                            <DeleteIcon />
                          </IconButton>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Styled Dialog Example */}
      <DialogWrapper open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "white",
            fontWeight: 600,
            borderRadius: "8px 8px 0 0",
          }}
        >
          Add New Slab
        </DialogTitle>
        <DialogContent dividers>
        
          <Divider sx={{ mb: 2 }} />
          <TextField label="Slab Name" fullWidth sx={{ mb: 2 }} />
          <TextField
            label="WhatsApp Content"
            fullWidth
            multiline
            minRows={3}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email Content"
            fullWidth
            multiline
            minRows={3}
            sx={{ mb: 2 }}
          />

          {/* ✅ Google reCAPTCHA */}
          <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
            <ReCAPTCHA
              sitekey="6LdHTbwrAAAAAGawIo2escUPr198m8cP3o_ZzZK1"
              onChange={(value) => setCaptchaValue(value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!captchaValue} // disable until verified
            onClick={() => {
              if (!captchaValue) {
                alert("Please complete CAPTCHA verification");
                return;
              }
              alert("Slab saved successfully ✅");
              setOpenAddDialog(false);
              setCaptchaValue(null);
            }}
          >
            Save
          </Button>
        </DialogActions>
      </DialogWrapper>

    </Layout>
  );
}

export default SlabSetting;
