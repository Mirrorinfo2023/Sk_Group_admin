"use client";
import React, { useState, useEffect } from "react";
import Layout from "@/components/Dashboard/layout";
import {
  Grid,
  Card,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  ContentCopy,
  Edit,
  Delete,
  VideoCall,
  Add,
  Refresh,
  Tune,
  Link,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import api from "../../utils/api";
import { DataDecrypt, DataEncrypt } from "../../utils/encryption";
import CreateMeetingDialog from "./CreateMeetingDialog";
import EditMeetingDialog from "./EditMeetingDialog";

export default function ZohoMeetingPage() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
  const [toDate, setToDate] = useState(dayjs().endOf("month"));
  const [openCreate, setOpenCreate] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const res = await api.post("/api/meeting/6a6b430a42c06b39a979950519f8d6732aeba6ea", {
        from_date: fromDate.format("YYYY-MM-DD"),
        to_date: toDate.format("YYYY-MM-DD"),
      });

      if (res.data?.data) {
        // Decrypt response
        const decryptedData = DataDecrypt(res.data.data);
        // decryptedData will be { status, message, data, report }
        if (decryptedData.status === 200) {
          setMeetings(decryptedData.data || []);
        } else {
          console.error("Error fetching meetings:", decryptedData.message);
        }
      }
    } catch (err) {
      console.error("Error fetching meetings:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchMeetings();
  }, []);

  const copyLink = (link) => {
    navigator.clipboard.writeText(link);
    // You can replace this with a toast notification
    console.log("Meeting link copied!");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this meeting?")) return;

    try {
      // Encrypt payload
      const encryptedPayload = DataEncrypt(JSON.stringify({ meetingId: id }));

      const res = await api.post("/api/meeting/dlf462f2376d2a717f10a3eb66bf6294d01825p0", { data: encryptedPayload });

      if (res.data?.data) {
        // Decrypt response
        const decryptedData = DataDecrypt(res.data.data);

        if (decryptedData.status === 200) {
          alert(decryptedData.message);
          fetchMeetings(); // refresh meetings
        } else {
          alert(decryptedData.message || "Failed to delete meeting");
        }
      }
    } catch (err) {
      console.error("Error deleting meeting:", err);
      alert("Something went wrong while deleting the meeting.");
    }
  };


  const handleResetFilters = () => {
    setFromDate(dayjs().startOf("month"));
    setToDate(dayjs().endOf("month"));
  };

  const hasActiveFilters = fromDate?.startOf('month')?.valueOf() !== dayjs().startOf('month').valueOf() ||
    toDate?.endOf('month')?.valueOf() !== dayjs().endOf('month').valueOf();

  // Calculate meeting statistics
  const totalMeetings = meetings.length;
  const upcomingMeetings = meetings.filter(meeting =>
    dayjs(`${meeting.meeting_date} ${meeting.meeting_time}`).isAfter(dayjs())
  ).length;

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
            Meeting Reports
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
              onClick={handleResetFilters}
              sx={{
                bgcolor: 'grey.100',
                color: 'grey.700',
                '&:hover': { bgcolor: 'grey.200' }
              }}
            >
              <Refresh fontSize="small" />
            </IconButton>

            <Button
              variant="contained"
              onClick={fetchMeetings}
              startIcon={<Refresh />}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                px: 2,
                py: 1,
              }}
            >
              Refresh
            </Button>

            <Button
              variant="contained"
              onClick={() => setOpenCreate(true)}
              startIcon={<Add />}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                px: 2,
                py: 1,
                background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
              }}
            >
              Create Meeting
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{
              p: 2,
              backgroundColor: '#E3F2FD',
              borderLeft: '4px solid #2196F3',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <Box>
                <Typography variant="subtitle2" sx={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#666',
                  mb: 0.5,
                  textTransform: 'uppercase'
                }}>
                  Total Meetings
                </Typography>
                <Typography sx={{
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: '#000',
                }}>
                  {totalMeetings}
                </Typography>
              </Box>
              <VideoCall sx={{ color: '#2196F3', fontSize: 32 }} />
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{
              p: 2,
              backgroundColor: '#FFF3E0',
              borderLeft: '4px solid #FF9800',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <Box>
                <Typography variant="subtitle2" sx={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#666',
                  mb: 0.5,
                  textTransform: 'uppercase'
                }}>
                  Upcoming
                </Typography>
                <Typography sx={{
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: '#000',
                }}>
                  {upcomingMeetings}
                </Typography>
              </Box>
              <Add sx={{ color: '#FF9800', fontSize: 32 }} />
            </Card>
          </Grid>
        </Grid>

        {/* Filters Section */}
        {showFilters && (
          <Card sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
            <Box sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: 'wrap'
            }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <DatePicker
                    value={fromDate}
                    onChange={setFromDate}
                    format="DD/MM/YY"
                    slotProps={{
                      textField: {
                        size: "small",
                        label: "From Date",
                        sx: { width: 140 }
                      }
                    }}
                  />
                  <Typography variant="body2" sx={{ color: 'grey.600', mx: 1 }}>
                    to
                  </Typography>
                  <DatePicker
                    value={toDate}
                    onChange={setToDate}
                    format="DD/MM/YY"
                    slotProps={{
                      textField: {
                        size: "small",
                        label: "To Date",
                        sx: { width: 140 }
                      }
                    }}
                  />
                </Box>
              </LocalizationProvider>

              <Button
                variant="contained"
                onClick={fetchMeetings}
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 2,
                  height: 40
                }}
              >
                Apply Filters
              </Button>

              {hasActiveFilters && (
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
                  Reset
                </Box>
              )}
            </Box>
          </Card>
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
            Showing {meetings.length} meetings
            {hasActiveFilters && ` (filtered by date range)`}
          </Typography>

          {upcomingMeetings > 0 && (
            <Chip
              icon={<VideoCall />}
              label={`${upcomingMeetings} upcoming meetings`}
              color="primary"
              variant="outlined"
              size="small"
            />
          )}
        </Box>

        {/* Meetings Table */}
        <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: 'grey.50' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Meeting Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Time</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Meeting Link</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={24} />
                      <Typography variant="body2" sx={{ mt: 1, color: 'grey.600' }}>
                        Loading meetings...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : meetings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="grey.600">
                        No meetings found for the selected date range.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  meetings.map((meeting) => (
                    <TableRow key={meeting.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{meeting.name}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: 'grey.600', maxWidth: 200 }}>
                          {meeting.description || 'No description'}
                        </Typography>
                      </TableCell>
                      <TableCell>{meeting.meeting_date}</TableCell>
                      <TableCell>{meeting.meeting_time}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Link sx={{ color: 'primary.main', fontSize: 18 }} />
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'primary.main',
                              cursor: 'pointer',
                              '&:hover': { textDecoration: 'underline' }
                            }}
                            onClick={() => copyLink(meeting.meeting_link)}
                          >
                            Copy Link
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={0.5}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => setEditingMeeting(meeting)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(meeting.id)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Create & Edit Dialogs */}
        <CreateMeetingDialog
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          refresh={fetchMeetings}
        />
        {editingMeeting && (
          <EditMeetingDialog
            open={!!editingMeeting}
            onClose={() => setEditingMeeting(null)}
            meeting={editingMeeting}
            refresh={fetchMeetings}
          />
        )}
      </Box>
    </Layout>
  );
}