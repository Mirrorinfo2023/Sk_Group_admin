"use client";
import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stepper,
    Step,
    StepLabel,
    TextField,
    MenuItem,
    Typography,
    Box,
    Paper,
    InputAdornment,
} from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";

// Icons
import BadgeIcon from "@mui/icons-material/Badge";
import HomeIcon from "@mui/icons-material/Home";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NumbersIcon from "@mui/icons-material/Numbers";
import DescriptionIcon from "@mui/icons-material/Description";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import api from "../../utils/api";
import { DataEncrypt, DataDecrypt } from "../../utils/encryption"; // your file
import ContactPageIcon from '@mui/icons-material/ContactPage';
const steps = ["Aadhaar", "PAN", "Bank", "Status"];
import axios from "axios";

function UploadKyc({ open, onClose }) {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        user_id: "111166",
        // Aadhaar
        aadhaarNo: "",
        address: "",
        aadhaarFront: null,
        aadhaarBack: null,
        // PAN
        panNo: "",
        nominee: "",
        nomineeRelation: "",
        panPhoto: null,
        // Bank
        accNo: "",
        bankName: "",
        holderName: "",
        ifsc: "",
        bankDoc: null,
        // Status
        status: "Pending",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState(null);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    // --- Validation per step (same as before, shortened for brevity) ---
    const validateStep = () => {
        let tempErrors = {};
        if (activeStep === 0) {
            if (!formData.aadhaarNo) tempErrors.aadhaarNo = "Aadhaar number required";
            else if (!/^\d{12}$/.test(formData.aadhaarNo))
                tempErrors.aadhaarNo = "Enter valid 12-digit Aadhaar";
            if (!formData.address) tempErrors.address = "Address required";
            if (!formData.aadhaarFront) tempErrors.aadhaarFront = "Upload Aadhaar front";
            if (!formData.aadhaarBack) tempErrors.aadhaarBack = "Upload Aadhaar back";
        } else if (activeStep === 1) {
            if (!formData.panNo) tempErrors.panNo = "PAN number required";
            else if (!/[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(formData.panNo))
                tempErrors.panNo = "Invalid PAN format";
            if (!formData.nominee) tempErrors.nominee = "Nominee required";
            if (!formData.nomineeRelation) tempErrors.nomineeRelation = "Relation required";
            if (!formData.panPhoto) tempErrors.panPhoto = "Upload PAN photo";
        } else if (activeStep === 2) {
            if (!formData.accNo) tempErrors.accNo = "Account number required";
            if (!formData.bankName) tempErrors.bankName = "Bank name required";
            if (!formData.holderName) tempErrors.holderName = "Holder name required";
            if (!formData.ifsc) tempErrors.ifsc = "IFSC required";
            if (!formData.bankDoc) tempErrors.bankDoc = "Upload bank document";
            if (!formData.recaptchaToken) tempErrors.recaptchaToken = "Please complete the reCAPTCHA verification";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleNext = () => validateStep() && setActiveStep((p) => p + 1);
    const handleBack = () => setActiveStep((p) => p - 1);

    // const token = localStorage.getItem("token"); // or sessionStorage

    const handleSubmit = async () => {
        setLoading(true);
        // if (!recaptchaToken) {
        //     alert("Please complete the reCAPTCHA verification before submitting.");
        //     return;
        // }
        try {
            const data = new FormData();

            // ✅ Append plain text fields exactly as backend expects
            data.append("user_id", formData.user_id);
            data.append("pan_number", formData.panNo);
            data.append("aadhar_number", formData.aadhaarNo);
            data.append("account_number", formData.accNo);
            data.append("account_holder", formData.holderName);
            data.append("bank_name", formData.bankName);
            data.append("ifsc_code", formData.ifsc);
            data.append("nominee_name", formData.nominee);
            data.append("nominee_relation", formData.nomineeRelation);
            data.append("full_address", formData.address);

            // ✅ Append files
            if (formData.panPhoto) data.append("panImage", formData.panPhoto);
            if (formData.aadhaarFront) data.append("aadharImage", formData.aadhaarFront);
            if (formData.aadhaarBack) data.append("aadharBackImage", formData.aadhaarBack);
            if (formData.bankDoc) data.append("chequeBookImage", formData.bankDoc);

            const res = await api.post(
                "/api/users/550ecdddb5b8b023dda91594810884c12456d0a3",
                data,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            console.log("KYC Upload Response:", res.data);
            alert("KYC uploaded successfully");

            // ✅ Reset form and stepper after success
            setFormData({

                aadhaarNo: "",
                address: "",
                aadhaarFront: null,
                aadhaarBack: null,
                panNo: "",
                nominee: "",
                nomineeRelation: "",
                panPhoto: null,
                accNo: "",
                bankName: "",
                holderName: "",
                ifsc: "",
                bankDoc: null,
                status: "Pending",
            });
            setActiveStep(0);
            setErrors({});

            onClose(); // close the dialog
        } catch (err) {
            console.error("KYC Submit Error:", err.response?.data || err.message);
            alert("Error submitting KYC");
        }
        setLoading(false);
    };


    const fieldStyle = {

        borderRadius: 2,
        background: "#fafafa",
        "& .MuiInputBase-input": {
            fontSize: "16px",   // slightly bigger font
            padding: "8px 12px", // smaller height
        },
        "& .MuiOutlinedInput-root": {
            minHeight: "40px",  // smaller overall field height
        },
    };
    .01
    // Step Content
    const renderStepContent = () => {
        const fieldBox = { display: "flex", flexDirection: "column", gap: 2, p: 5, };
        switch (activeStep) {
            case 0: // Aadhaar
                return (
                    <Paper sx={fieldBox} elevation={3}>
                        <TextField
                            label="Aadhaar Number"
                            name="aadhaarNo"
                            value={formData.aadhaarNo}
                            onChange={handleChange}
                            error={!!errors.aadhaarNo}
                            helperText={errors.aadhaarNo}
                            sx={fieldStyle}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <ContactPageIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />


                        <TextField
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            error={!!errors.address}
                            helperText={errors.address}
                            sx={fieldStyle}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <HomeIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<PhotoCameraIcon />}
                        >
                            {formData.aadhaarFront ? formData.aadhaarFront.name : "Upload Aadhaar Front Photo"}
                            <input
                                type="file"
                                name="aadhaarFront"
                                hidden
                                onChange={handleChange}
                            />
                        </Button>
                        {errors.aadhaarFront && <Typography color="error">{errors.aadhaarFront}</Typography>}

                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<PhotoCameraIcon />}
                            sx={{ mt: 2 }}
                        >
                            {formData.aadhaarBack ? formData.aadhaarBack.name : "Upload Aadhaar Back Photo"}
                            <input
                                type="file"
                                name="aadhaarBack"
                                hidden
                                onChange={handleChange}
                            />
                        </Button>
                        {errors.aadhaarBack && <Typography color="error">{errors.aadhaarBack}</Typography>}

                    </Paper>
                );
            case 1: // PAN
                return (
                    <Paper sx={fieldBox} elevation={3}>
                        <TextField
                            label="PAN Number"
                            name="panNo"
                            value={formData.panNo}
                            onChange={handleChange}
                            error={!!errors.panNo}
                            helperText={errors.panNo}
                            sx={fieldStyle}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CreditCardIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="Nominee Name"
                            name="nominee"
                            value={formData.nominee}
                            onChange={handleChange}
                            error={!!errors.nominee}
                            helperText={errors.nominee}
                            sx={fieldStyle}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="Nominee Relation"
                            name="nomineeRelation"
                            select
                            value={formData.nomineeRelation}
                            onChange={handleChange}
                            error={!!errors.nomineeRelation}
                            helperText={errors.nomineeRelation}
                            sx={fieldStyle}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PeopleIcon />
                                    </InputAdornment>
                                ),
                            }}
                        >
                            <MenuItem value="Father">Father</MenuItem>
                            <MenuItem value="Mother">Mother</MenuItem>
                            <MenuItem value="Spouse">Spouse</MenuItem>
                            <MenuItem value="Sibling">Sibling</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </TextField>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<PhotoCameraIcon />}
                        >
                            {formData.panPhoto ? formData.panPhoto.name : "Upload PAN Photo"}
                            <input type="file" name="panPhoto" hidden onChange={handleChange} />
                        </Button>
                        {errors.panPhoto && <Typography color="error">{errors.panPhoto}</Typography>}
                    </Paper>
                );
            case 2: // Bank
                return (
                    <Paper sx={fieldBox} elevation={3}>
                        <TextField
                            label="Account Number"
                            name="accNo"
                            value={formData.accNo}
                            onChange={handleChange}
                            error={!!errors.accNo}
                            helperText={errors.accNo}
                            sx={fieldStyle}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <NumbersIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="Bank Name"
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleChange}
                            error={!!errors.bankName}
                            helperText={errors.bankName}
                            sx={fieldStyle}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountBalanceIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="Account Holder Name"
                            name="holderName"
                            value={formData.holderName}
                            onChange={handleChange}
                            error={!!errors.holderName}
                            helperText={errors.holderName}
                            sx={fieldStyle}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircleIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="IFSC Code"
                            name="ifsc"
                            value={formData.ifsc}
                            onChange={handleChange}
                            error={!!errors.ifsc}
                            helperText={errors.ifsc}
                            sx={fieldStyle}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <DescriptionIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Bank Document Button */}
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<PhotoCameraIcon />}
                        >
                            {formData.bankDoc ? formData.bankDoc.name : "Upload Bank Document"}
                            <input type="file" name="bankDoc" hidden onChange={handleChange} />
                        </Button>
                        {errors.bankDoc && <Typography color="error">{errors.bankDoc}</Typography>}

                        <Box sx={{ my: 2 }}>
                            <ReCAPTCHA
                                sitekey="6LdHTbwrAAAAAGawIo2escUPr198m8cP3o_ZzZK1" // or put your site key directly
                                onChange={(token) => setRecaptchaToken(token)}
                            />
                            {errors.recaptchaToken && <Typography color="error">{errors.recaptchaToken}</Typography>}
                        </Box>

                    </Paper>
                );
            case 3: // Status
                return (
                    <Paper
                        elevation={6}
                        sx={{
                            p: 4,
                            m: 2,
                            borderRadius: 4,
                            textAlign: "center",
                            background: "#e3f2fd", // light blue background
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        }}
                    >
                        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                            Current Status
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                            {formData.status}
                        </Typography>
                        <Typography variant="body1">
                            Your KYC is pending review. You will be notified once verified.
                        </Typography>
                    </Paper>
                );

            default:
                return null;
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"       // increase max width
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 4,  // bigger rounded corners
                },
            }}
        >
            <DialogTitle
                sx={{
                    fontWeight: 700,
                    fontSize: "20px",
                    textAlign: "center",
                    background: "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
                    color: "#fff",
                    py: 2,
                }}
            >
                Upload KYC Details
            </DialogTitle>

            <DialogContent dividers>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Box sx={{ m: 3 }}>{renderStepContent()}</Box>
            </DialogContent>
            <DialogActions sx={{ display: "flex", justifyContent: "space-between" }}>
                {activeStep > 0 ? (
                    <Button onClick={handleBack} color="secondary">
                        Back
                    </Button>
                ) : (
                    <Box />
                )}

                {activeStep < steps.length - 1 ? (
                    <Button onClick={handleNext} variant="contained" color="primary">
                        Next
                    </Button>
                ) : (
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="success"
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </Button>
                )}
            </DialogActions>

        </Dialog>
    );
}

export default UploadKyc;
