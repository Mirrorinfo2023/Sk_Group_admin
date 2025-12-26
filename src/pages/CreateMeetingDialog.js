import React, { useState, useRef } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Box, TextField, Button, Typography, Paper
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { DataEncrypt, DataDecrypt } from "../../utils/encryption";
import dayjs from "dayjs";
import api from "../../utils/api";
import ReCAPTCHA from "react-google-recaptcha";

export default function CreateMeetingDialog({ open, onClose, refresh }) {
    const [meeting_name, setMeetingName] = useState("");
    const [meeting_link, setMeetingLink] = useState("");
    const [description, setDescription] = useState("");
    const [meeting_date, setMeetingDate] = useState(dayjs());
    const [meeting_time, setMeetingTime] = useState(dayjs());
    const [image, setImage] = useState(null);
    const [captchaToken, setCaptchaToken] = useState(null);

    const [errors, setErrors] = useState({});
    const recaptchaRef = useRef();

    const validateFields = () => {
        const newErrors = {};
        if (!meeting_name.trim()) newErrors.meeting_name = "Meeting name is required.";
        if (!meeting_link.trim()) newErrors.meeting_link = "Meeting link is required.";
        if (!description.trim()) newErrors.description = "Description is required.";
        if (!meeting_date) newErrors.meeting_date = "Meeting date is required.";
        if (!meeting_time) newErrors.meeting_time = "Meeting time is required.";
        if (!captchaToken) newErrors.captcha = "Please verify that you are not a robot.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateFields()) return;

        try {
            const meetingPayload = {
                meeting_name,
                meeting_link,
                description,
                meeting_date: meeting_date.format("YYYY-MM-DD"),
                meeting_time: meeting_time.format("HH:mm:ss"),
                captchaToken,
            };

            const encryptedData = DataEncrypt(JSON.stringify(meetingPayload));

            const formData = new FormData();
            formData.append("data", encryptedData);
            if (image) formData.append("image", image);

            const res = await api.post(
                "/api/meeting/5cf462f2376d2a717f10a3eb66bf6294d01825b9",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (res.data?.message) {
                const decryptedResponse = DataDecrypt(res.data.message);
                alert(decryptedResponse.message || "Meeting created!");
                onClose();
                refresh();
            }

            recaptchaRef.current.reset();
            setCaptchaToken(null);

        } catch (err) {
            console.error("Failed to create meeting:", err);
            alert("Failed to create meeting");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create Meeting</DialogTitle>
            <DialogContent dividers>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        label="Meeting Name"
                        variant="outlined"
                        fullWidth
                        value={meeting_name}
                        onChange={(e) => setMeetingName(e.target.value)}
                        error={!!errors.meeting_name}
                        helperText={errors.meeting_name}
                    />
                    <TextField
                        label="Meeting Link"
                        variant="outlined"
                        fullWidth
                        value={meeting_link}
                        onChange={(e) => setMeetingLink(e.target.value)}
                        error={!!errors.meeting_link}
                        helperText={errors.meeting_link}
                    />
                    <TextField
                        label="Description"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        error={!!errors.description}
                        helperText={errors.description}
                    />

                    {/* File upload */}
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
                            onClick={() => document.getElementById("create-file-input").click()}
                        >
                            <Typography>{image ? image.name : "Choose file..."}</Typography>
                            <Button variant="contained" size="small">Browse</Button>
                        </Paper>
                        <input
                            id="create-file-input"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </Box>

                    {/* Date & Time */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box display="flex" gap={2} mt={1}>
                            <DatePicker
                                label="Date"
                                value={meeting_date}
                                onChange={setMeetingDate}
                                sx={{ flex: 1 }}
                                slotProps={{ textField: { error: !!errors.meeting_date, helperText: errors.meeting_date } }}
                            />
                            <TimePicker
                                label="Time"
                                value={meeting_time}
                                onChange={setMeetingTime}
                                sx={{ flex: 1 }}
                                slotProps={{ textField: { error: !!errors.meeting_time, helperText: errors.meeting_time } }}
                            />
                        </Box>
                    </LocalizationProvider>

                    {/* Google reCAPTCHA */}
                    <Box mt={2}>
                        <ReCAPTCHA
                            sitekey="6LdHTbwrAAAAAGawIo2escUPr198m8cP3o_ZzZK1"
                            onChange={(token) => {
                                setCaptchaToken(token);
                                if (errors.captcha) setErrors(prev => ({ ...prev, captcha: null }));
                            }}
                            ref={recaptchaRef}
                        />
                        {errors.captcha && (
                            <Typography color="error" variant="body2" mt={0.5}>
                                {errors.captcha}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button color="error" onClick={onClose}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={handleSave}>Create</Button>
            </DialogActions>
        </Dialog>
    );
}
