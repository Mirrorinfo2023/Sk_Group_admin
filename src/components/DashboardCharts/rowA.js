import { Paper, Typography, Grid } from '@mui/material';

const RowA = () => {
  return (
    <Grid container spacing={4} sx={{ padding: 2 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 150,
           
          }}
        >
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Total bbsp bill
          </Typography>
          <Typography component="p" variant="h5">
            ₹ 0
          </Typography>
          <Typography color="text.secondary" sx={{ flex: 1 }}>
            from 0 transactions
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 150,
           
          }}
        >
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Today&apos;s Success
          </Typography>
          <Typography component="p" variant="h5">
            ₹ 0
          </Typography>
          <Typography color="text.secondary" sx={{ flex: 1 }}>
            from 0 transactions
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 150,
           
          }}
        >
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Today&apos;s Failed
          </Typography>
          <Typography component="p" variant="h5">
            ₹ 0
          </Typography>
          <Typography color="text.secondary" sx={{ flex: 1 }}>
            from 0 transactions
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 150,           
          }}
        >
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Today&apos;s Hold
          </Typography>
          <Typography component="p" variant="h5">
            ₹ 0
          </Typography>
          <Typography color="text.secondary" sx={{ flex: 1 }}>
            from 0 transactions
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default RowA;
