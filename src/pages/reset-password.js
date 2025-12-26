import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from 'react-redux';
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import { Grid, Paper, Box, TextField, Button, Typography, TableContainer } from "@mui/material";
import Cookies from "js-cookie";
import ReCAPTCHA from "react-google-recaptcha";

function TransactionHistory(props) {
    const [mobile_no, setMobileNo] = useState('');
    const [old_password, setOldPassword] = useState('');
    const [new_password, setNewPassword] = useState('');
    const [captchaToken, setCaptchaToken] = useState(null);
    const [errors, setErrors] = useState({});
    const recaptchaRef = useRef();
    const dispatch = useDispatch();
    const uid = Cookies.get('uid');
    const mobile = Cookies.get('mobile');

    useEffect(() => {
        if (mobile) setMobileNo(mobile);
    }, [mobile]);

    const validateFields = () => {
        const newErrors = {};
        if (!old_password.trim()) newErrors.old_password = "Old password is required.";
        if (!new_password.trim()) newErrors.new_password = "New password is required.";
        if (!captchaToken) newErrors.captcha = "Please verify that you are not a robot.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateFields()) return;

        const formData = {
            userid: uid,
            oldpassword: old_password,
            password: new_password,
            captchaToken
        };

        try {
            const response = await api.post("/api/users/1c3bb4525d626c9fabed22789ba34ec12e097222", formData);

            if (response.status === 200) {
                alert('Password reset successfully');
                Cookies.remove('uid');
                Cookies.remove('role');
                recaptchaRef.current.reset();
                setCaptchaToken(null);
            } else {
                dispatch(callAlert({ message: response.data.error, type: 'FAILED' }));
            }
        } catch (error) {
            console.error('Error updating password:', error);
            dispatch(callAlert({ message: error.message || 'Something went wrong', type: 'FAILED' }));
        }
    };

    return (
        <Layout>
            <Grid container spacing={4} sx={{ padding: 2 }}>
                <Grid item xs={12}>
                    <Typography variant="h5" sx={{ padding: 2 }}>Reset Password</Typography>
                </Grid>

                <Grid item xs={12}>
                    <TableContainer component={Paper} sx={{ p: 2 }}>
                        <Grid container spacing={2}>
                            {/* Mobile No - full width */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Mobile No"
                                    variant="outlined"
                                    fullWidth
                                    value={mobile_no}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>

                            {/* Old Password */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Old Password"
                                    variant="outlined"
                                    type='password'
                                    fullWidth
                                    value={old_password}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    error={!!errors.old_password}
                                    helperText={errors.old_password}
                                />
                            </Grid>

                            {/* New Password */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="New Password"
                                    variant="outlined"
                                    type='password'
                                    fullWidth
                                    value={new_password}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    error={!!errors.new_password}
                                    helperText={errors.new_password}
                                />
                            </Grid>

                            {/* Google reCAPTCHA */}
                            <Grid item xs={12} sm={6}>
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
                            </Grid>

                            {/* Submit button */}
                            <Grid item xs={12}>
                                <Box display="flex" justifyContent="flex-end">
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="medium"
                                        onClick={handleSubmit}
                                    >
                                        Change Password
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </TableContainer>
                </Grid>
            </Grid>
        </Layout>
    );
}

export default withAuth(TransactionHistory);
