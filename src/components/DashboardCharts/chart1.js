import React from 'react';
import dynamic from 'next/dynamic';
import { Box, Button,Divider,TextField, Container, Grid, Paper,Link, Table, TableBody, StyledTableCell, TableContainer, TableHead, TablePagination, TableRow, Typography,Image } from "@mui/material";
const LineChart = dynamic(() => import('@mui/x-charts').then(mod => mod.LineChart), { ssr: false });
const axisClasses = dynamic(() => import('@mui/x-charts').then(mod => mod.axisClasses), { ssr: false });
const PieChart = dynamic(() => import('@mui/x-charts').then(mod => mod.PieChart), { ssr: false });
const BarChart = dynamic(() => import('@mui/x-charts').then(mod => mod.BarChart), { ssr: false });
//import { BarChart } from '@mui/x-charts';


const RechargeAndBBPSCharts = () => {
  
  const rechargeData = [
    { name: 'Success', value: 30 },
    { name: 'Failed', value: 15 },
    { name: 'Pending', value: 5 }
  ];

  const bbpsData = [
    { name: 'Success', value: 40 },
    { name: 'Failed', value: 10 }
  ];

  
  const COLORS = ['#4caf50', '#f44336'];

  return (
    <Grid container spacing={4}  sx={{ padding: 2 }}>
   
      <Grid item xs={12} md={6}>
      <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: 240,
                                }}
                                >
                                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                   BBPS Success Failed 
                                 </Typography>
                                        <div style={{ width: '100%', flexGrow: 1, overflow: 'hidden' }}>
                                        <LineChart
                                            xAxis={[{ data: [] }]}
                                            series={[
                                              {
                                                data: [],
                                              },
                                            ]}
                                           
                                          />
                                        </div>
                                </Paper>
                         </Grid>

                        
                        <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                                  
                                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                  Recharge
                                </Typography>
                                <Typography component="p" variant="h4">
                                    
                                </Typography>

                                <BarChart

                                    xAxis={[{ scaleType: 'band', data: ['Success', 'Failed', 'Pending'] }]}
                                    series={[{ data: [] }]}
                                    width={500}
                                    height={200}
                                    />


                                </Paper>
                            </Grid>
                          </Grid>
  );
};

export default RechargeAndBBPSCharts;
