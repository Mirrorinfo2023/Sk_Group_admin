"use client"
import { Box, Button,Divider,TextField,InputLabel,Select,MenuItem, Container, Grid, Paper, Table, TableBody, StyledTableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, FormControl } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Cookies from "js-cookie";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import { useRouter } from 'next/router';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { read, utils } from 'xlsx';
const { sheet_to_json } = utils;
import api from "../../utils/api";


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 10,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 10,
  });

function AddLeads(props) {

    const router = useRouter();
    const  attr  = router.query;
    const dispatch = useDispatch();
    const uid = Cookies.get('uid');

    const [narration, setNarration] = useState('');
    const [amount, setAmount] = useState('');
    const [updata, setUpdata] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedValue, setSelectedValue] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };


    
    const handleSubmit = async() => {
    if (selectedFile) {
        const reader = new FileReader();
    
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const excelData = sheet_to_json(sheet, { header: 1 });

            const headers = excelData[0];
            const jsonData = excelData.slice(1).map(row => {
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header] = row[index];
                });
                return obj;
            });

            setUpdata(jsonData);

        };
    
        reader.readAsArrayBuffer(selectedFile);

        
    }else{
        alert('Please Upload excel file with proper format');
    }

        try {

            const formData = {
                'walletType':selectedValue,
                'narration': narration,
                'amount':amount,
                'uploadedData':updata,
                'action': attr.action,
                'sender_id': uid
            }
            if(updata)
            {
                const response = await api.post('/api/wallet/bulk-credit-debit-income', formData);
            
                if (response.status==200) {
                    window.history.back();
                    alert(attr.action+'ed successfully');
                } else {
                    console.error('Failed to ' + attr.action);
                    alert(response.data.error);
                }
            }else{
                alert('Are you sure to submit income');
            }
        } catch (error) {
            alert('Are you sure to submit income');
        }
    
    };


    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleCancel = async () => {
        window.history.back();
      };
    
    return (


        <Layout>
            <main className="p-6 space-y-6">
          
          <Grid
              container
              spacing={4}
              sx={{ padding: 2 }}
          >
          
          <Grid item={true} xs={12}   >
              <TableContainer component={Paper} >



                  <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '30%', verticalAlign: 'top'}} >
                      <Typography variant="h5"  sx={{ padding: 2 }}>Bulk income {attr.action}</Typography>
                  </Box>


                  <Grid spacing={2}   sx={{ padding: 2 }} container>
                        <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >

                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Wallet Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedValue}
                                    label="Wallet"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="">Please Select</MenuItem>
                                    <MenuItem value="income">Income Wallet</MenuItem>
                                    <MenuItem value="Royality">Royality</MenuItem>
                                    <MenuItem value="Reward">Reward</MenuItem>
                                    <MenuItem value="SIP">SIP</MenuItem>
                                    <MenuItem value="MF">MF</MenuItem>
                                    <MenuItem value="Laptop">Laptop</MenuItem>
                                    <MenuItem value="Bike">Bike</MenuItem>
                                    <MenuItem value="Car">Car</MenuItem>
                                    <MenuItem value="House">House</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                      <Box  justifyContent={'space-between'} alignItems={'right'} mt={3} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >

                          <TextField required size="normal"
                          fullWidth label="Narration" 
                          variant="outlined" display={'inline-block'}
                          value={narration} 
                          onChange={(e) => setNarration(e.target.value)}  />

                      </Box>

                      
                      <Box  justifyContent={'space-between'} alignItems={'right'} mt={3} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >

                          <TextField required size="normal"
                          fullWidth label="Amount" 
                          variant="outlined" display={'inline-block'}
                          value={amount} 
                          onChange={(e) => setAmount(e.target.value)}  />

                      </Box>

                      <Box display="inline-block" justifyContent="space-between" alignItems="right" mt={3} ml={2} mb={2} sx={{ width: '70%', verticalAlign: 'top' }}>
                        <Typography variant="p"  sx={{ padding: '0 5px 0 0' }}>Upload CSV file</Typography>
                              <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                              Upload file
                              <VisuallyHiddenInput type="file" onChange={(event) => handleFileChange(event)} />
                              </Button>
                              {selectedFile && (
                              <Typography variant="body2" sx={{ marginTop: 1 }}>
                                  {selectedFile.name}
                              </Typography>
                              )}
                      </Box>

                  </Grid>
         
                  <Grid item>
                          <Box display="flex" justifyContent="flex-start" mr={2}  mt={1} ml={2} mb={1} >
                              <Button variant="contained" color="primary" style={{ marginRight: '8px' }} size="medium" onClick={handleSubmit}>
                              Submit
                              </Button>
                              <Button variant="outlined"  onClick={handleCancel} >Cancel</Button>
                          </Box>
                  </Grid>
     
                  
               </TableContainer>
          </Grid>
          
      </Grid>
            
  </main>
        </Layout>


    );
}
export default withAuth(AddLeads);

