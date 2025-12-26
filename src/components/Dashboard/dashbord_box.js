// pages/Dashboard.js

import React from 'react';
import { Grid, Paper,Link, Typography, Box } from '@mui/material';
import Dashboardchart1 from "@/components/DashboardCharts/chart1";
import Dashboardchart2 from "@/components/DashboardCharts/chart2";
import Dashboardchartmain from "@/components/DashboardCharts/mainchart";

const Dashboard = ({ 
  totalRecharge, 
  successRecharge, 
  failedRecharge, 
  totalBillPayment,
  totalRechargeCount,
  successRechargeCount,
  failedRechargeCount,
  totalBillPaymentCount 
}) => {
  return (
    <Grid
      container
      spacing={4}
      sx={{ 
        padding: '24px',
        backgroundColor: '#f5f7fa',
        minHeight: '100vh'
      }}
    >
      <Grid item xs={12}>
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 4, 
            fontWeight: 600,
            color: '#1a237e',
            textAlign: 'center'
          }}
        >
          Dashboard Overview
        </Typography>
        
        <Grid container spacing={3}>
          {/* BBSP Bill Stats */}
          <Grid item xs={12} md={3} lg={3}>
            <Link href="/" style={{ textDecoration: 'none', display: 'block' }}>
              <Paper 
                elevation={3}
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 180,
                  background: 'linear-gradient(135deg, #9c27b0, #7b1fa2, #6a1b9a)',
                  color: 'white',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                  }
                }}
              >
                <Typography component="h2" variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                  Total BBSP Bill
                </Typography>
                <Typography component="p" variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                  ₹ {totalRecharge} 0.00
                </Typography>
                <Typography sx={{ opacity: 0.9, fontSize: '0.9rem' }}>
                  from {totalRechargeCount} transactions
                </Typography>
              </Paper>
            </Link>
          </Grid>

          <Grid item xs={12} md={3} lg={3}>
            <Link href="/" style={{ textDecoration: 'none', display: 'block' }}>
              <Paper 
                elevation={3}
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 180,
                  background: 'linear-gradient(135deg, #00bcd4, #0097a7, #00838f)',
                  color: 'white',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                  }
                }}
              >
                <Typography component="h2" variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                  {"Today's Success"}
                </Typography>
                <Typography component="p" variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                  ₹ {successRecharge} 0.00
                </Typography>
                <Typography sx={{ opacity: 0.9, fontSize: '0.9rem' }}>
                  from {successRechargeCount} transactions
                </Typography>
              </Paper>
            </Link>
          </Grid>

          <Grid item xs={12} md={3} lg={3}>
            <Link href="/" style={{ textDecoration: 'none', display: 'block' }}>
              <Paper 
                elevation={3}
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 180,
                  background: 'linear-gradient(135deg, #e91e63, #c2185b, #ad1457)',
                  color: 'white',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                  }
                }}
              >
                <Typography component="h2" variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                  {"Today's Failed"}
                </Typography>
                <Typography component="p" variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                  ₹ {failedRecharge}0.00
                </Typography>
                <Typography sx={{ opacity: 0.9, fontSize: '0.9rem' }}>
                  from {failedRechargeCount} transactions
                </Typography>
              </Paper>
            </Link>
          </Grid>

          <Grid item xs={12} md={3} lg={3}>
            <Link href="/" style={{ textDecoration: 'none', display: 'block' }}>
              <Paper 
                elevation={3}
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 180,
                  background: 'linear-gradient(135deg, #673ab7, #512da8, #4527a0)',
                  color: 'white',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                  }
                }}
              >
                <Typography component="h2" variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                  {"Today's Hold"}
                </Typography>
                <Typography component="p" variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                  ₹ {totalBillPayment}0.00
                </Typography>
                <Typography sx={{ opacity: 0.9, fontSize: '0.9rem' }}>
                  from {totalBillPaymentCount} transactions
                </Typography>
              </Paper>
            </Link>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, mb: 4 }}>
          <Dashboardchart1 />
        </Box>

        {/* Send Money Stats */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={3} lg={3}>
            <Link href="/" style={{ textDecoration: 'none', display: 'block' }}>
              <Paper 
                elevation={3}
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 180,
                  background: 'linear-gradient(135deg, #3f51b5, #303f9f, #283593)',
                  color: 'white',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                  }
                }}
              >
                <Typography component="h2" variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                  Total Send Money
                </Typography>
                <Typography component="p" variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                  ₹ {totalRecharge} 0.00
                </Typography>
                <Typography sx={{ opacity: 0.9, fontSize: '0.9rem' }}>
                  from {totalRechargeCount} transactions
                </Typography>
              </Paper>
            </Link>
          </Grid>

          <Grid item xs={12} md={3} lg={3}>
            <Link href="/" style={{ textDecoration: 'none', display: 'block' }}>
              <Paper sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 150,
                background: 'linear-gradient(135deg, #E0FFFF, #B0E0E6, #ADD8E6)',
              }}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom >
                  Total bbsp bill
                </Typography>
                <Typography component="p" variant="h5">
                  ₹ {totalRecharge} 0.00
                </Typography>
                <Typography color="text.secondary" sx={{ flex: 1 }}>
                  from {totalRechargeCount} transactions
                </Typography>
              </Paper>
            </Link>
          </Grid>

          <Grid item xs={12} md={3} lg={3}>
            <Link href="/" style={{ textDecoration: 'none', display: 'block' }}>
              <Paper sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 150,
                background: 'linear-gradient(135deg, #E0FFFF, #B0E0E6, #ADD8E6)',
              }}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Todays success
                </Typography>
                <Typography component="p" variant="h5">
                  ₹ {successRecharge} 0.00
                </Typography>
                <Typography color="text.secondary" sx={{ flex: 1 }}>
                  from {successRechargeCount} transactions
                </Typography>
              </Paper>
            </Link>
          </Grid>

          <Grid item xs={12} md={3} lg={3}>
            <Link href="/" style={{ textDecoration: 'none', display: 'block' }}>
              <Paper sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 150,
                background: 'linear-gradient(135deg, #E0FFFF, #B0E0E6, #ADD8E6)',
              }}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Todays failed
                </Typography>
                <Typography component="p" variant="h5">
                  ₹ {failedRecharge}0.00
                </Typography>
                <Typography color="text.secondary" sx={{ flex: 1 }}>
                  from {failedRechargeCount} transactions
                </Typography>
              </Paper>
            </Link>
          </Grid>

          <Grid item xs={12} md={3} lg={3}>
            <Link href="/" style={{ textDecoration: 'none', display: 'block' }}>
              <Paper sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 150,
                background: 'linear-gradient(135deg, #E0FFFF, #B0E0E6, #ADD8E6)',
              }}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Todays hold
                </Typography>
                <Typography component="p" variant="h5">
                  ₹ {totalBillPayment}0.00
                </Typography>
                <Typography color="text.secondary" sx={{ flex: 1 }}>
                  from {totalBillPaymentCount} transactions
                </Typography>
              </Paper>
            </Link>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, mb: 4 }}>
          <Dashboardchart2 />
        </Box>

        {/* User Stats */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={3} lg={3}>
            <Link href="/" style={{ textDecoration: 'none', display: 'block' }}>
              <Paper 
                elevation={3}
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 180,
                  background: 'linear-gradient(135deg, #009688, #00796b, #00695c)',
                  color: 'white',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                  }
                }}
              >
                <Typography component="h2" variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                  Total Users
                </Typography>
                <Typography component="p" variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                  ₹ {failedRecharge}0.00
                </Typography>
                <Typography sx={{ opacity: 0.9, fontSize: '0.9rem' }}>
                  from {failedRechargeCount} transactions
                </Typography>
              </Paper>
            </Link>
          </Grid>

          <Grid item xs={12} md={3} lg={3}>
            <Link href="/" style={{ textDecoration: 'none', display: 'block' }}>
              <Paper sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 150,
                background: 'linear-gradient(135deg, #FF9248, #FFB347, #FFD8A4)',
              }}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Total User
                </Typography>
                <Typography component="p" variant="h5">
                  ₹ {failedRecharge}0.00
                </Typography>
                <Typography color="text.secondary" sx={{ flex: 1 }}>
                  from {failedRechargeCount} transactions
                </Typography>
              </Paper>
            </Link>
          </Grid>

          <Grid item xs={12} md={3} lg={3}>
            <Link href="/" style={{ textDecoration: 'none', display: 'block' }}>
              <Paper sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 150,
                background: 'linear-gradient(135deg, #FF9248, #FFB347, #FFD8A4)',
              }}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Todays Join User
                </Typography>
                <Typography component="p" variant="h5">
                  ₹ {totalBillPayment}0.00
                </Typography>
                <Typography color="text.secondary" sx={{ flex: 1 }}>
                  from {totalBillPaymentCount} transactions
                </Typography>
              </Paper>
            </Link>
          </Grid>

          <Grid item xs={12} md={3} lg={3}>
            <Link href="/" style={{ textDecoration: 'none', display: 'block' }}>
              <Paper sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 150,
                background: 'linear-gradient(135deg, #FF9248, #FFB347, #FFD8A4)',
              }}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Total Prime User
                </Typography>
                <Typography component="p" variant="h5">
                  ₹ {totalRecharge} 0.00
                </Typography>
                <Typography color="text.secondary" sx={{ flex: 1 }}>
                  from {totalRechargeCount} transactions
                </Typography>
              </Paper>
            </Link>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, mb: 4 }}>
          <Dashboardchartmain />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Dashboard;