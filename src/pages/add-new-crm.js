"use client";
import {
    Box,
    Button,
    TextField,
    Grid,
    Paper,
    TableContainer,
    Typography,
    CircularProgress,
    Alert,
    Card,
} from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import { DataDecrypt, DataEncrypt } from "../../utils/encryption";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import Layout from "@/components/Dashboard/layout";
import withAuth from "../../utils/withAuth";

// Styled components
const GradientButton = styled(Button)(({ theme }) => ({
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
    border: 0,
    borderRadius: 8,
    color: 'white',
    height: 48,
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
    '&:hover': {
        boxShadow: '0 4px 8px 2px rgba(33, 203, 243, .4)',
    },
}));

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: 16,
    padding: theme.spacing(3),
    background: 'linear-gradient(145deg, #f5f7fa 0%, #ffffff 100%)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
}));

const HeaderBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing(3),
    borderBottom: `2px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(4),
}));

function AddCrmLink() {
    const [crmName, setCrmName] = useState("");
    const [link, setLink] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();
    const [captchaToken, setCaptchaToken] = useState(null);

    const validateURL = (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = async () => {
        setError("");
        setSuccess("");

        // check captcha
        // if (!captchaToken) {
        //     setError("Please verify that you are not a robot.");
        //     return;
        // }

        if (!crmName.trim()) {
            setError("Please enter CRM name");
            return;
        }

        if (!link.trim()) {
            setError("Please enter link");
            return;
        }

        if (!validateURL(link)) {
            setError("Please enter a valid URL (include http:// or https://)");
            return;
        }

        try {
            setLoading(true);

            const requestData = {
                crm_name: crmName.trim(),
                link: link.trim(),
                created_by: 1,
                captchaToken, // send captcha to backend for verification
            };

            const encryptedData = DataEncrypt(JSON.stringify(requestData));

            const response = await api.post(
                "/api/admin/4e22b047567b40e5018b04a71c7df2678993f789",
                { data: encryptedData }
            );

            const decrypted = DataDecrypt(response.data.data);

            if (decrypted.status === 200) {
                setSuccess("CRM link added successfully!");
                setCrmName("");
                setLink("");
                setCaptchaToken(null); // reset captcha
                setTimeout(() => {
                    router.push("/crm");
                }, 1000);
            } else {
                setError(decrypted.message || "Failed to add CRM link");
            }
        } catch (err) {
            console.error("Error adding CRM link:", err);
            setError(err?.response?.data?.message || err.message || "Network error");
        } finally {
            setLoading(false);
        }
    };




    const handleBack = () => {
        router.back();
    };

    return (
        <Layout>
            <Box sx={{ p: 3 }}>
                {/* Header */}
                <HeaderBox>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {/* <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              variant="outlined"
              sx={{ textTransform: 'none' }}
            >
              Back
            </Button> */}
                        <Typography variant="h4" sx={{
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Add New CRM Link
                        </Typography>
                    </Box>
                </HeaderBox>

                {/* Form Card */}
                <StyledCard>
                    <Grid container spacing={3}>
                        {/* Error/Success Messages */}
                        {error && (
                            <Grid item xs={12}>
                                <Alert severity="error" sx={{ borderRadius: 2 }}>
                                    {error}
                                </Alert>
                            </Grid>
                        )}

                        {success && (
                            <Grid item xs={12}>
                                <Alert
                                    severity="success"
                                    sx={{ borderRadius: 2 }}
                                    icon={<CheckCircleIcon fontSize="inherit" />}
                                >
                                    {success}
                                </Alert>
                            </Grid>
                        )}

                        {/* Form Fields */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="CRM Name"
                                value={crmName}
                                onChange={(e) => setCrmName(e.target.value)}
                                variant="outlined"
                                // placeholder="e.g., Salesforce CRM"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
                            // helperText="Enter the name of the CRM system"
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Link"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                variant="outlined"
                                placeholder="https://example.com"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
                                helperText="Enter the full URL including http:// or https://"
                            />
                        </Grid>
                        {/* Google reCAPTCHA
                        <Grid item xs={12}>
                            <ReCAPTCHA
                                sitekey="6LdHTbwrAAAAAGawIo2escUPr198m8cP3o_ZzZK1" // replace with your site key
                                onChange={(token) => setCaptchaToken(token)}
                            />
                        </Grid> */}

                        {/* Submit & Cancel Buttons */}
                        <Grid item xs={12} container spacing={2}>
                            <Grid item xs={6}>
                                <GradientButton
                                    fullWidth
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    sx={{ height: 36 }}
                                >
                                    {loading ? "Submit..." : "Submit"}
                                </GradientButton>
                            </Grid>

                            <Grid item xs={6}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={handleBack}
                                    sx={{ textTransform: 'none', borderRadius: 2 }}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>


                    </Grid>
                </StyledCard>
            </Box>
        </Layout>
    );
}

export default withAuth(AddCrmLink);