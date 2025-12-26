"use client"
import React, {  useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import BannersTransactions from "@/components/Product/product";
import { Grid,Button, TableContainer, Paper, Typography, Box, TextField } from "@mui/material";
import dayjs from 'dayjs';
import SearchIcon from '@mui/icons-material/Search';



const getDate = (timeZone) => {
    const dateString = timeZone;
    const dateObject = new Date(dateString);

    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");
    const hours = String(dateObject.getHours()).padStart(2, "0");
    const minutes = String(dateObject.getMinutes()).padStart(2, "0");

    // Determine if it's AM or PM
    const amOrPm = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    const formattedHours = hours % 12 === 0 ? "12" : String(hours % 12);

    const formattedDateTime = `${day}-${month}-${year} ${formattedHours}:${minutes} ${amOrPm}`;

    return formattedDateTime;
};



function BannersReport(props) {

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (text) => {
        setSearchTerm(text);
    };
    const [showServiceTrans, setShowServiceTrans] = useState({});
    const dispatch = useDispatch();

    let rows;

    if (showServiceTrans && showServiceTrans.length > 0) {
        rows = [
            ...showServiceTrans
        ];
    } else {
        rows = [];
    }

    const currentDate = new Date();
    const [fromDate, setFromDate] = React.useState(dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)));
    const [toDate, setToDate] = React.useState(dayjs(getDate.date));


    useEffect(() => {
        const getTnx = async () => {
            const reqData = {
                from_date: fromDate.toISOString().split('T')[0],
                to_date: toDate.toISOString().split('T')[0],
            }

            try {

                const response = await api.post("/api/product/get-product-list", reqData);

                if (response.status === 200) {
                    setShowServiceTrans(response.data.data)
                }

            } catch (error) {

                if (error?.response?.data?.error) {
                    dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }))
                } else {
                    dispatch(callAlert({ message: error.message, type: 'FAILED' }))
                }

            }
        }

        if (fromDate || toDate) {
            getTnx();
        }

    }, [fromDate, toDate, dispatch]);

    const handleFromDateChange = (date) => {
        setFromDate(date);
      };
    
      const handleToDateChange = (date) => {
        setToDate(date);
      };

      const [selectedValue, setSelectedValue] = useState('');

        const handleChange = (event) => {
            setSelectedValue(event.target.value);
        };

       const filteredRows = rows.filter(row => {
            return (
                (row.name && row.name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        });
    return (
        
        <Layout>
            <Grid
                container
                spacing={4}
                sx={{ padding: 2 }}
            >
            
            <Grid item={true} xs={12}   >
                <TableContainer component={Paper} >
                    {/* First Row: Title */}
                    <Box sx={{ display: 'flex', alignItems: 'center', p: { xs: 2, sm: 2 }, borderBottom: '1px solid #eee' }}>
                        <Typography variant="h5" sx={{ flex: 1, fontWeight: 600 }}>
                            Product List
                        </Typography>
                    </Box>
                    {/* Second Row: Search and Add New Button */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'stretch', sm: 'center' },
                            justifyContent: 'space-between',
                            gap: 2,
                            p: { xs: 2, sm: 2 },
                        }}
                    >
                        <TextField
                            id="standard-basic"
                            placeholder="Search"
                            variant="standard"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon />,
                            }}
                            sx={{ flex: 1, minWidth: 180, maxWidth: 400 }}
                        />
                        <Button
                            variant="contained"
                            href={`/add-new-product/`}
                            sx={{
                                background: 'linear-gradient(90deg, #2196F3 0%, #21CBF3 100%)',
                                borderRadius: '12px',
                                color: '#fff',
                                fontWeight: 'bold',
                                boxShadow: 'none',
                                textTransform: 'none',
                                fontSize: '1rem',
                                padding: '8px 24px',
                                minWidth: 120,
                                mt: { xs: 2, sm: 0 },
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #2196F3 0%, #21CBF3 100%)',
                                },
                            }}
                        >
                            Add New
                        </Button>
                    </Box>
                </TableContainer>
            </Grid>
            
            </Grid>
                <BannersTransactions showServiceTrans={filteredRows} />
        </Layout>

    );
}
export default withAuth(BannersReport);

