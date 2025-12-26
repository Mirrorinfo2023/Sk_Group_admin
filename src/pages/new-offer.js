"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import OffersTransactions from "@/components/Offers/NewOffers";
import {
    Grid,
    Button,
    Typography,
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { styled } from "@mui/material/styles";
import { DataEncrypt, DataDecrypt } from "../../utils/encryption";
import AddNewOfferForm from "@/components/Offers/AddNewOffers";

const FilterRow = styled(Box)(({ theme }) => ({
    background: "#f5faff",
    borderRadius: 12,
    boxShadow: "0 2px 12px 0 rgba(0,0,0,0.06)",
    padding: "16px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
    flexWrap: "wrap", // ✅ wrap items on small screens
    justifyContent: "space-between",

    [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        alignItems: "stretch",
        gap: 12,
        padding: "12px",
    },
}));

function OfferReport() {
    const dispatch = useDispatch();
    const [mounted, setMounted] = useState(false);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [offerData, setOfferData] = useState([]);
    const [openAddDialog, setOpenAddDialog] = useState(false);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm")); // ✅ Dialog responsive check

    useEffect(() => {
        const today = dayjs();
        const startOfMonth = today.startOf("month");
        setFromDate(startOfMonth);
        setToDate(today);
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && fromDate && toDate) generateReport();
    }, [fromDate, toDate]);

    const generateReport = async () => {
        if (!fromDate || !toDate) return;

        // const adjustedToDate = toDate.add(1, "day");
        const reqData = {
            from_date: fromDate.toISOString().split("T")[0],
            to_date: toDate.toISOString().split("T")[0],
        };

        try {
            const encrypted = DataEncrypt(JSON.stringify(reqData));
            const response = await api.post("/api/admin/4e555557986b40e5018b04a71c7df2e04893f789", { data: encrypted });
            const decrypted = DataDecrypt(response.data.data);

            if (decrypted.status === 200) {
                setOfferData(decrypted.data.offers || []);
            } else {
                dispatch(callAlert({ message: decrypted.message, type: "FAILED" }));
            }
        } catch (error) {
            console.error("❌ Error fetching offer report:", error);
            dispatch(callAlert({ message: error.message, type: "FAILED" }));
        }
    };

    if (!mounted) return null;

    return (
        <Layout>
            {/* ✅ Top Filter Section */}
            <Grid container spacing={3} sx={{ padding: { xs: 1, sm: 2 } }}>
                <Grid item xs={12}>
                    <FilterRow>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                color: "#3a3e43ff",
                                px: 1,
                                textAlign: { xs: "center", sm: "left" },
                            }}
                        >
                            Offers Management
                        </Typography>

                        <Box
                            display="flex"
                            alignItems="center"
                            gap={2}
                            flexWrap="wrap"
                            justifyContent={{ xs: "center", sm: "flex-end" }}
                            width={{ xs: "100%", sm: "auto" }}
                        >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="From Date"
                                    value={fromDate}
                                    onChange={(newValue) => setFromDate(newValue)}
                                    format="DD-MM-YYYY"
                                    sx={{
                                        minWidth: { xs: "100%", sm: 140 },
                                        background: "#fff",
                                        borderRadius: 1,
                                    }}
                                />
                                <DatePicker
                                    label="To Date"
                                    value={toDate}
                                    onChange={(newValue) => setToDate(newValue)}
                                    format="DD-MM-YYYY"
                                    sx={{
                                        minWidth: { xs: "100%", sm: 140 },
                                        background: "#fff",
                                        borderRadius: 1,
                                    }}
                                />
                            </LocalizationProvider>

                            <Button
                                variant="contained"
                                onClick={() => setOpenAddDialog(true)}
                                sx={{
                                    borderRadius: 2,
                                    fontWeight: 700,
                                    fontSize: { xs: 14, sm: 16 },
                                    px: { xs: 2, sm: 3 },
                                    py: { xs: 0.8, sm: 1 },
                                    background: "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
                                    boxShadow: "0 2px 8px 0 rgba(33, 203, 243, 0.15)",
                                    textTransform: "none",
                                    width: { xs: "100%", sm: "auto" },
                                }}
                            >
                                Add New Offer
                            </Button>
                        </Box>
                    </FilterRow>
                </Grid>
            </Grid>

            {/* ✅ Offer Table Section */}
            <Grid container spacing={3} sx={{ paddingX: { xs: 1, sm: 2 }, paddingBottom: 4 }}>
                <Grid item xs={12}>
                    <OffersTransactions showOfferTrans={offerData || []} />
                </Grid>
            </Grid>

            {/* ✅ Responsive Dialog */}
            <Dialog
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                fullWidth
                maxWidth="md"
                fullScreen={fullScreen} // ✅ takes full screen on mobile
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                        py: { xs: 1, sm: 2 },
                    }}
                >
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                            textAlign: "center",
                            flexGrow: 1,
                            fontSize: { xs: 16, sm: 18 },
                        }}
                    >
                        Add New Offer
                    </Typography>

                    <IconButton
                        onClick={() => setOpenAddDialog(false)}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    <AddNewOfferForm
                        onClose={() => setOpenAddDialog(false)}
                        onSuccess={generateReport}
                    />
                </DialogContent>
            </Dialog>
        </Layout>
    );
}

export default withAuth(OfferReport);
