"use client";
import React, { useEffect, useState, useCallback } from "react";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import Layout from "@/components/Dashboard/layout";
import FeedbackTransactions from "../components/Feedback/FeedbackReport";
import {
  Grid,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Card,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Search,
  Refresh,
  Tune,
  Feedback,
  CheckCircle,
  HourglassEmpty,
  Pending,
} from "@mui/icons-material";
import { DataDecrypt, DataEncrypt } from "../../utils/encryption";

function FeedbackReport() {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [masterReport, setMasterReport] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentDate = new Date();
  const [fromDate, setFromDate] = useState(
    dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  );
  const [toDate, setToDate] = useState(dayjs());

  // ================= FETCH FEEDBACK =================
  const fetchFeedbackData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const reqData = {
        from_date: fromDate.format("YYYY-MM-DD"),
        to_date: toDate.format("YYYY-MM-DD"),
      };

      const encryptedPayload = DataEncrypt(JSON.stringify(reqData));

      const response = await api.post(
        "/api/feedback/267156fd48d2ae207275d1c29cc7c92d1e22f38d",
        { data: encryptedPayload }
      );

      console.log("🔐 Raw API Response:", response.data);

      let parsedData = null;

      // 🔐 Encrypted response
      if (response.status === 200 && response.data?.data) {
        const decrypted = DataDecrypt(response.data.data);
        console.log("🔓 Decrypted Data:", decrypted);

        if (typeof decrypted === "string") {
          parsedData = JSON.parse(decrypted);
        } else if (typeof decrypted === "object") {
          parsedData = decrypted;
        } else {
          throw new Error("Invalid decrypted response format");
        }
      }
      // 🔓 Plain response fallback
      else if (response.data?.status === 200) {
        parsedData = response.data;
      }

      if (parsedData?.status === 200) {
        setShowServiceTrans(parsedData.data ?? []);
        setMasterReport(parsedData.report ?? {});
      } else {
        setError(parsedData?.message || "Failed to fetch feedback report");
      }
    } catch (err) {
      console.error("❌ API ERROR:", err);
      setError(
        err?.response?.data?.error ||
        err?.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    fetchFeedbackData();
  }, [fetchFeedbackData]);

  // Function to handle status update with note
  const handleStatusUpdate = async (id, status, note) => {
    try {
      const response = await api.post("/api/feedback/update-feedback", {
        id,
        status,
        note
      });

      if (response.data.status === 200) {
        alert("Status updated successfully!");
        fetchFeedbackData(); // Refresh the data
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status. Please try again.");
    }
  };

  // ================= FILTER DATA =================
  const filteredRows = showServiceTrans.filter((row) => {
    if (!row) return false;

    const matchesStatus =
      selectedValue !== "" ? row.status === Number(selectedValue) : true;

    if (!matchesStatus) return false;
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();
    return (
      (row.first_name && row.first_name.toLowerCase().includes(term)) ||
      (row.last_name && row.last_name.toLowerCase().includes(term)) ||
      (row.mlm_id && row.mlm_id.toString().includes(searchTerm)) ||
      (row.usermobile && row.usermobile.includes(searchTerm)) ||
      (row.category_name &&
        row.category_name.toLowerCase().includes(term)) ||
      (row.reason_name && row.reason_name.toLowerCase().includes(term)) ||
      (row.mobile && row.mobile.includes(searchTerm))
    );
  });

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedValue("");
    setFromDate(
      dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
    );
    setToDate(dayjs());
    setShowFilters(false);
  };

  // ================= STATS =================
  const statsCards = [
    {
      label: "Total Feedback",
      value: masterReport.totalFeedbackCount ?? 0,
      icon: <Feedback />,
      color: "#FF6B35",
    },
    {
      label: "Resolved",
      value: masterReport.totalResolveFeedback ?? 0,
      icon: <CheckCircle />,
      color: "#4CAF50",
    },
    {
      label: "Hold",
      value: masterReport.totalHoldFeedback ?? 0,
      icon: <HourglassEmpty />,
      color: "#FF9800",
    },
    {
      label: "Pending",
      value: masterReport.totalPendingFeedback ?? 0,
      icon: <Pending />,
      color: "#F44336",
    },
  ];

  // ================= UI =================
  return (
    <Layout>
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" fontWeight={700} mb={2}>
          Feedback Report
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={fetchFeedbackData}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {loading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}

        {!loading && !error && (
          <Grid container spacing={2} mb={3}>
            {statsCards.map((card, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card sx={{ p: 2 }}>
                  <Typography variant="subtitle2">{card.label}</Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {card.value}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && !error && (
          <FeedbackTransactions
            showServiceTrans={filteredRows}
            onStatusUpdate={handleStatusUpdate}
            refreshData={fetchFeedbackData}
          />
        )}
      </Box>
    </Layout>
  );
}

export default withAuth(FeedbackReport);