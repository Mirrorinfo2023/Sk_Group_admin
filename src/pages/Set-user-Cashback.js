"use client";
import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    FormHelperText,
} from "@mui/material";
import api from "../../utils/api";
import { useDispatch } from "react-redux";
import { callAlert } from "../../redux/actions/alert";
import { DataEncrypt } from "../../utils/encryption";

export default function SetCashbackDialog({ open, onClose }) {
    const dispatch = useDispatch();
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedUser, setSelectedUser] = useState("");
    const [cashback, setCashback] = useState("");

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (open) {
            const fetchData = async () => {
                try {
                    const categoriesRes = await api.get("/api/operators/categories");
                    setCategories(categoriesRes.data || []);

                    const usersRes = await api.get("/api/users/list");
                    setUsers(usersRes.data || []);
                } catch (err) {
                    dispatch(callAlert({ message: err.message, type: "FAILED" }));
                }
            };
            fetchData();
        }
    }, [open, dispatch]);

    const validateFields = () => {
        const newErrors = {};
        if (!selectedCategory) newErrors.selectedCategory = "Category is required";
        if (!selectedUser) newErrors.selectedUser = "User is required";
        if (!cashback) newErrors.cashback = "Cashback % is required";
        else if (cashback < 0 || cashback > 100)
            newErrors.cashback = "Cashback must be between 0-100";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateFields()) return;

        try {
            const payload = {
                category: selectedCategory,
                user_id: selectedUser,
                cashback_percentage: cashback,
            };

            const encryptedPayload = DataEncrypt(JSON.stringify(payload));

            const response = await api.post("/api/users/saveUserCashback", { encReq: encryptedPayload });

            if (response.data.status === 200) {
                dispatch(
                    callAlert({
                        message: "Cashback set successfully!",
                        type: "SUCCESS",
                    })
                );
                onClose();
            } else {
                dispatch(
                    callAlert({
                        message: response.data.message || "Failed to set cashback",
                        type: "FAILED",
                    })
                );
            }
        } catch (err) {
            dispatch(callAlert({ message: err.message, type: "FAILED" }));
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Set Cashback</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} mt={1}>
                    <FormControl fullWidth error={!!errors.selectedCategory}>
                        <InputLabel>Operator Category</InputLabel>
                        <Select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat} value={cat}>
                                    {cat}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.selectedCategory && (
                            <FormHelperText>{errors.selectedCategory}</FormHelperText>
                        )}
                    </FormControl>

                    <FormControl fullWidth error={!!errors.selectedUser}>
                        <InputLabel>User</InputLabel>
                        <Select
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                        >
                            {users.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.first_name} {user.last_name} ({user.mlm_id})
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.selectedUser && (
                            <FormHelperText>{errors.selectedUser}</FormHelperText>
                        )}
                    </FormControl>

                    <TextField
                        type="number"
                        label="Cashback %"
                        value={cashback}
                        onChange={(e) => setCashback(e.target.value)}
                        fullWidth
                        error={!!errors.cashback}
                        helperText={errors.cashback}
                        inputProps={{ min: 0, max: 100 }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>
                    Set Cashback
                </Button>
            </DialogActions>
        </Dialog>
    );
}
