"use client";
import React, { useState } from "react";
import {
    Grid,
    Typography,
    TextField,
    Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import api from "../../../utils/api";
import { DataEncrypt, DataDecrypt } from "../../../utils/encryption";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const UploadButton = styled(Button)(({ theme }) => ({
    borderRadius: 2,
    border: "2px dashed #90caf9",
    color: "#1565c0",
    padding: "24px 16px",
    fontWeight: 600,
    fontSize: 15,
    background: "#f8fbff",
    textTransform: "none",
    width: "100%",
    "&:hover": { background: "#e3f2fd" },
}));

export default function AddNewOfferForm({ onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        header: "",
        description: "",
        image: null,
        start_date: null,
        end_date: null,
    });

    const [errors, setErrors] = useState({
        header: "",
        description: "",
        image: "",
        start_date: "",
        end_date: "",
    });

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            setFormData({ ...formData, image: files[0] });
            setErrors({ ...errors, image: "" });
        } else {
            setFormData({ ...formData, [name]: value });
            setErrors({ ...errors, [name]: "" });
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { header: "", description: "", image: "", start_date: "", end_date: "" };

        if (!formData.header.trim()) {
            newErrors.header = "Header is required.";
            isValid = false;
        }
        if (!formData.description.trim()) {
            newErrors.description = "Description is required.";
            isValid = false;
        }
        if (!formData.image) {
            newErrors.image = "Please upload an offer image.";
            isValid = false;
        }
        if (!formData.start_date) {
            newErrors.start_date = "Start date is required.";
            isValid = false;
        }
        if (!formData.end_date) {
            newErrors.end_date = "End date is required.";
            isValid = false;
        }
        if (
            formData.start_date &&
            formData.end_date &&
            formData.end_date.isBefore(formData.start_date)
        ) {
            newErrors.end_date = "End date cannot be before start date.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const formPayload = new FormData();
            const encrypted = DataEncrypt(
                JSON.stringify({
                    header: formData.header,
                    description: formData.description,
                    start_date: formData.start_date.format("YYYY-MM-DD"),
                    end_date: formData.end_date.format("YYYY-MM-DD"),
                })
            );

            formPayload.append("data", encrypted);
            formPayload.append("image", formData.image);

            const res = await api.post("/api/admin/4e5dddd7986b40e5018b04a71c7df2e04893f789", formPayload, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const decrypted = DataDecrypt(res.data.data);

            if (decrypted.status === 200) {
                alert("✅ Offer added successfully!");
                onClose();
                onSuccess?.();
            } else {
                alert(`❌ ${decrypted.message || "Something went wrong"}`);
            }
        } catch (error) {
            console.error("❌ Add Offer Error:", error);
            alert(`⚠️ ${error.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                {/* HEADER */}
                <Grid item xs={12}>
                    <TextField
                        label="Header *"
                        name="header"
                        fullWidth
                        value={formData.header}
                        onChange={handleInputChange}
                        error={!!errors.header}
                        helperText={errors.header}
                    />
                </Grid>

                {/* DESCRIPTION */}
                <Grid item xs={12}>
                    <TextField
                        label="Description *"
                        name="description"
                        fullWidth
                        multiline
                        rows={4}
                        value={formData.description}
                        onChange={handleInputChange}
                        error={!!errors.description}
                        helperText={errors.description}
                    />
                </Grid>

                {/* DATE PICKERS */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <DatePicker
                                    label="Start Date *"
                                    value={formData.start_date}
                                    onChange={(newValue) =>
                                        setFormData({ ...formData, start_date: newValue })
                                    }
                                    format="DD-MM-YYYY"
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: !!errors.start_date,
                                            helperText: errors.start_date,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <DatePicker
                                    label="End Date *"
                                    value={formData.end_date}
                                    onChange={(newValue) =>
                                        setFormData({ ...formData, end_date: newValue })
                                    }
                                    format="DD-MM-YYYY"
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: !!errors.end_date,
                                            helperText: errors.end_date,
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </LocalizationProvider>

                {/* IMAGE UPLOAD */}
                <Grid item xs={12}>
                    <Typography sx={{ mb: 1, fontWeight: 500 }} component="label">
                        Offer Image *
                    </Typography>
                    <UploadButton component="label">
                        {formData.image ? formData.image.name : "Click to Upload Offer Image"}
                        <input
                            type="file"
                            name="image"
                            hidden
                            accept="image/*"
                            onChange={handleInputChange}
                        />
                    </UploadButton>
                    {errors.image && (
                        <Typography variant="body2" color="error">
                            {errors.image}
                        </Typography>
                    )}
                </Grid>

                {/* BUTTONS */}
                <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
                    <Button variant="outlined" color="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" type="submit">
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}
