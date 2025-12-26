import {
    Box,
    Button,
    TextField,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Paper,
    TableContainer,
    Typography,
    FormControl,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ReCAPTCHA from "react-google-recaptcha";
import { DataEncrypt, DataDecrypt } from "../../../utils/encryption";
import { useRouter } from "next/navigation";
const StyledTextarea = styled(TextareaAutosize)(({ theme }) => ({
    width: "100%",
    minHeight: "56px",
    padding: "12px",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    fontSize: "16px",
    fontFamily: "inherit",
    "&:focus": {
        outline: "none",
        borderColor: theme.palette.primary.main,
        boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.1)",
    },
}));

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 10,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 10,
});

const AddNotificationTransactions = () => {
    const [title, setTitle] = useState("");
    const [transactionType, setTransactionType] = useState("");
    const [appType, setAppType] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [appCategories, setAppCategories] = useState([]);
    const [message, setMessage] = useState("");
    const [recaptchaToken, setRecaptchaToken] = useState("");
    const router = useRouter();
    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await api.get("/api/notification/get-notification-category");
                if (response.status === 200) {
                    setCategories(response.data.data.NotificationCategory);
                    setAppCategories(response.data.data.notificationApp);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        getCategories();
    }, []);

    const handleChange = (event) => setTransactionType(event.target.value);
    const handleChange1 = (event) => setAppType(event.target.value);
    const handleFileChange = (event) => setSelectedFile(event.target.files[0]);
    const handleCancel = () => window.history.back();

    const handleRecaptchaChange = (token) => {
        setRecaptchaToken(token);
    };

    const handleSubmit = async () => {
        if (!title || !transactionType || !appType || !message) {
            alert("Please fill in all required fields.");
            return;
        }

        if (!recaptchaToken) {
            alert("Please complete the reCAPTCHA verification.");
            return;
        }

        try {
            // 🔐 Encrypt text fields
            const encryptedPayload = DataEncrypt(
                JSON.stringify({
                    title,
                    body: message,
                    type_id: transactionType,
                    app_id: appType,
                    recaptcha_token: recaptchaToken
                })
            );

            const formData = new FormData();
            formData.append("data", encryptedPayload);
            if (selectedFile) formData.append("image", selectedFile);

            const response = await api.post("/api/notification/a10541257fe7fa6bd3f2e0422b287a0304cab4b4", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // console.log("RAW RESPONSE:", response.data);

            // 🔐 Decrypt backend response
            const decryptedString = DataDecrypt(response.data.data);
            const decrypted = (decryptedString);

            if (decrypted.status === 200) {
                alert("Notification saved successfully");
                router.push("/fcm-notification");
            } else {
                alert(decrypted.message);
            }
        } catch (error) {
            console.error("Error uploading notification:", error);
            alert("Error saving notification. Please try again.");
        }
    };

    return (
        <main className="p-6 space-y-6">
            <Grid container spacing={4} sx={{ padding: 2 }}>
                <Grid item xs={12}>
                    <TableContainer
                        component={Paper}
                        elevation={3}
                        sx={{ borderRadius: "8px", overflow: "hidden" }}
                    >
                        <Box sx={{ padding: "24px", backgroundColor: "#f8f9fa", borderBottom: "1px solid #e9ecef" }}>
                            <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                                Add New Notification
                            </Typography>
                        </Box>

                        <Box sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                                {/* Title */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Title"
                                        variant="outlined"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        sx={{ "& .MuiOutlinedInput-root": { height: "56px" } }}
                                    />
                                </Grid>

                                {/* Notification Type */}
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="notification-type-label">Notification Type</InputLabel>
                                        <Select
                                            labelId="notification-type-label"
                                            id="notification-type"
                                            value={transactionType}
                                            label="Notification Type"
                                            onChange={handleChange}
                                            sx={{ height: "56px" }}
                                        >
                                            <MenuItem value="">Please Select</MenuItem>
                                            {categories.map((category) => (
                                                <MenuItem key={category.id} value={category.id}>
                                                    {category.notification_type}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* App Type */}
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="app-type-label">App Type</InputLabel>
                                        <Select
                                            labelId="app-type-label"
                                            id="app-type"
                                            value={appType}
                                            label="App Type"
                                            onChange={handleChange1}
                                            sx={{ height: "56px" }}
                                        >
                                            <MenuItem value="">Please Select</MenuItem>
                                            {appCategories.map((app) => (
                                                <MenuItem key={app.id} value={app.id}>
                                                    {app.app_name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                {/* Upload Image */}
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Button
                                            component="label"
                                            variant="contained"
                                            startIcon={<CloudUploadIcon />}
                                            sx={{ backgroundColor: "#f5f5f5", color: "text.primary" }}
                                        >
                                            Upload Image
                                            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                                        </Button>
                                        {selectedFile && (
                                            <Typography variant="body2" sx={{ color: "#666" }}>
                                                Selected: {selectedFile.name}
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>
                                {/* Message */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" sx={{ mb: 1, color: "#666" }}>
                                        Message
                                    </Typography>
                                    <StyledTextarea
                                        placeholder="Enter your notification message here..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </Grid>

                                {/* Google reCAPTCHA */}
                                <Grid item xs={12}>
                                    <ReCAPTCHA
                                        sitekey="6LdHTbwrAAAAAGawIo2escUPr198m8cP3o_ZzZK1"
                                        onChange={handleRecaptchaChange}
                                    />
                                </Grid>

                                {/* Submit & Cancel */}
                                <Grid item xs={12}>
                                    <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            size="large"
                                            onClick={handleSubmit}
                                            sx={{
                                                px: 4,
                                                py: 1,
                                                borderRadius: "6px",
                                                textTransform: "none",
                                                fontWeight: 600,
                                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                                "&:hover": { boxShadow: "0 4px 8px rgba(0,0,0,0.15)" },
                                            }}
                                        >
                                            Submit
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="large"
                                            onClick={handleCancel}
                                            sx={{ ml: 2, px: 4, py: 1, borderRadius: "6px", textTransform: "none", fontWeight: 600 }}
                                        >
                                            Cancel
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </TableContainer>
                </Grid>
            </Grid>
        </main>
    );
};

export default AddNotificationTransactions;
