import React from 'react';
import Typography from '@mui/material/Typography';
import dynamic from 'next/dynamic';
import { Paper,Grid } from '@mui/material';
const ResponsiveChartContainer=dynamic(() => import('@mui/x-charts').then(mod => mod.ResponsiveChartContainer), { ssr: false });
const BarPlot = dynamic(() => import('@mui/x-charts').then(mod => mod.BarPlot), { ssr: false });
const LinePlot = dynamic(() => import('@mui/x-charts').then(mod => mod.LinePlot), { ssr: false });
const LineHighlightPlot = dynamic(() => import('@mui/x-charts').then(mod => mod.LineHighlightPlot), { ssr: false });
const ChartsXAxis = dynamic(() => import('@mui/x-charts').then(mod => mod.ChartsXAxis), { ssr: false });
const ChartsYAxis = dynamic(() => import('@mui/x-charts').then(mod => mod.ChartsYAxis), { ssr: false });
const ChartsTooltip = dynamic(() => import('@mui/x-charts').then(mod => mod.ChartsTooltip), { ssr: false });
const ChartsAxisHighlight = dynamic(() => import('@mui/x-charts').then(mod => mod.ChartsAxisHighlight), { ssr: false });
const axisClasses = dynamic(() => import('@mui/x-charts').then(mod => mod.axisClasses), { ssr: false });

const rechargeData = [


];

const series = [
  {
    type: 'bar',
    yAxisId: 'amount',
    label: 'Recharge Amount',
    color: 'lightblue',
    data: [],
    highlightScope: { highlight: 'item' },
  },
  {
    type: 'line',
    yAxisId: 'total',
    color: 'red',
    label: 'Total Amount',
    data: [],
    highlightScope: { highlight: 'item' },
  },
];

export default function Combining() {
  return (
                <Grid container spacing={4}  sx={{ padding: 2 }}>
                            <Grid item xs={12} md={12}>
                            <Paper
                              sx={{
                                  p: 2,
                                  display: 'flex',
                                  flexDirection: 'column',
                                  height: 400,
                              }}
                              >
                             
                                      <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                        Recharge , Bills and Total Amount
                                        </Typography>

                                        <ResponsiveChartContainer
                                          series={series}
                                          height={400}
                                          margin={{ top: 10 }}
                                          xAxis={[
                                            {
                                              id: 'date',
                                              data: [],
                                              scaleType: 'band',
                                              valueFormatter: (value) => value.toLocaleDateString(),
                                            },
                                          ]}
                                          yAxis={[
                                            {
                                              id: 'total',
                                              scaleType: 'linear',
                                              label: 'Total Amount',
                                              valueFormatter: (value) => `${value.toLocaleString()} ₹`,
                                            },
                                            {
                                              id: 'amount',
                                              scaleType: 'linear',
                                              label: 'Recharge Amount',
                                              valueFormatter: (value) => `${value.toLocaleString()} ₹`,
                                            },
                                          ]}
                                        >
                                          <ChartsAxisHighlight x="line" />
                                          <BarPlot />
                                          <LinePlot />
                                          <LineHighlightPlot />
                                          <ChartsXAxis
                                            label="Date"
                                            position="bottom"
                                            axisId="date"
                                            tickInterval={(value, index) => index % 1 === 0}
                                            tickLabelStyle={{
                                              fontSize: 10,
                                            }}
                                          />
                                          <ChartsYAxis
                                            label="Total Amount"
                                            position="left"
                                            axisId="total"
                                            tickLabelStyle={{ fontSize: 10 }}
                                            sx={{
                                              [`& .${axisClasses.label}`]: {
                                                transform: 'translateX(-5px)',
                                              },
                                            }}
                                          />
                                          <ChartsYAxis
                                            label="Recharge Amount"
                                            position="right"
                                            axisId="amount"
                                            tickLabelStyle={{ fontSize: 10 }}
                                            sx={{
                                              [`& .${axisClasses.label}`]: {
                                                transform: 'translateX(5px)',
                                              },
                                            }}
                                          />
                                          <ChartsTooltip />
                                        </ResponsiveChartContainer>                                     
                              </Paper>
                          </Grid>
                        </Grid>
  );
}
