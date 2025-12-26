import React, { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Box, TextField, Button, Typography, Paper
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";

import { DataDecrypt, DataEncrypt } from "../../utils/encryption";
import dayjs from "dayjs";
import api from "../../utils/api";

export default function EditMeetingDialog({ open, onClose, meeting, refresh }) {
    const [meeting_name, setMeetingName] = useState("");
    const [meeting_link, setMeetingLink] = useState("");
    const [description, setDescription] = useState("");
    const [meeting_date, setMeetingDate] = useState(dayjs());
    const [meeting_time, setMeetingTime] = useState(dayjs());
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (meeting) {
            setMeetingName(meeting.name);
            setMeetingLink(meeting.meeting_link);
            setDescription(meeting.description);
            setMeetingDate(dayjs(meeting.meeting_date, "YYYY-MM-DD"));
            setMeetingTime(dayjs(meeting.meeting_time, "HH:mm:ss"));
            setImage(null);
        }
    }, [meeting]);

    const handleUpdate = async () => {
        try {
            const payload = {
                meetingId: meeting.id,
                meeting_name,
                meeting_link,
                description,
                meeting_date: meeting_date.format("YYYY-MM-DD"),
                meeting_time: meeting_time.format("HH:mm:ss"),
            };

            const encryptedPayload = DataEncrypt(JSON.stringify(payload));
            const res = await api.post("/api/meeting/5cf462f2376d2a717f10a3eb66bf6294d01825p0", { data: encryptedPayload });

            if (res.data?.data) {
                const decryptedData = DataDecrypt(res.data.data);
                if (decryptedData.status === 200) {
                    alert(decryptedData.message || "Meeting updated!");
                    onClose();
                    refresh();
                } else {
                    alert(decryptedData.message || "Failed to update meeting");
                }
            }
        } catch (err) {
            console.error(err);
            alert("Failed to update meeting");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Meeting</DialogTitle>
            <DialogContent dividers>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        label="Meeting Name"
                        variant="outlined"
                        fullWidth
                        value={meeting_name}
                        onChange={(e) => setMeetingName(e.target.value)}
                    />
                    <TextField
                        label="Meeting Link"
                        variant="outlined"
                        fullWidth
                        value={meeting_link}
                        onChange={(e) => setMeetingLink(e.target.value)}
                    />
                    <TextField
                        label="Description"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    {/* File upload with styled box */}
                    <Box>
                        <Typography sx={{ mb: 1 }}>Upload Image</Typography>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 1,
                                borderRadius: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                cursor: "pointer",
                            }}
                            onClick={() => document.getElementById("meeting-file-input").click()}
                        >
                            <Typography>{image ? image.name : "Choose file..."}</Typography>
                            <Button variant="contained" size="small">Browse</Button>
                        </Paper>
                        <input
                            id="meeting-file-input"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </Box>

                    {/* Date & Time */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box display="flex" gap={2} mt={1}>
                            <DatePicker label="Date" value={meeting_date} onChange={setMeetingDate} sx={{ flex: 1 }} />
                            <TimePicker label="Time" value={meeting_time} onChange={setMeetingTime} sx={{ flex: 1 }} />
                        </Box>
                    </LocalizationProvider>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button color="error" onClick={onClose}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={handleUpdate}>Update</Button>
            </DialogActions>
        </Dialog>
    );
}
