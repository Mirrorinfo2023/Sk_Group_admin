"use client"
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import { Grid,Paper,TableContainer, FormControl, InputLabel, Select, MenuItem,Button, Table, TableBody, TableCell, TableRow,Link,Thead } from "@mui/material";
import { Typography,Divider,Box,TextField} from "@mui/material";
import { useRouter } from 'next/router';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { DataEncrypt, DataDecrypt } from '../../utils/encryption';

function TransactionHistory(props) {
  
    const [showServiceTrans, setShowServiceTrans] = useState({});
    const dispatch = useDispatch();
    const router = useRouter();
    const { form_id } = router.query;

    const [formData, setFormData] = useState([]);
    const [lead_name, setlead_name] = useState('');
    const [category_name, setcategory_name] = useState('');
    const [first_name, setfirst_name] = useState('');
    const [last_name, setlast_name] = useState('');
    const [mlm_id, setmlm_id] = useState('');
    const [mobile, setmobile] = useState('');
    const [email, setemail] = useState('');
    const [entry_date, setentry_date] = useState('');
  
    let rows;

    if (showServiceTrans && showServiceTrans.length > 0) {
        rows = [
            ...showServiceTrans
        ];
    } else {
        rows = [];
    }

    useEffect(() => {
       
        const all_parameters = {
            "form_id": form_id
        }
        

        const getTnx = async () => {

          try {
            const response = await api.post('/api/leads/get-form-data', all_parameters);
            if (response.status === 200) {
                //const decryptedObject = DataDecrypt(response.data);
                setlead_name(response.data.data.lead_name);
                setcategory_name(response.data.data.category_name);
                setfirst_name(response.data.data.first_name);
                setlast_name(response.data.data.last_name);
                setmlm_id(response.data.data.mlm_id);
                setmobile(response.data.data.mobile);
                setemail(response.data.data.email);
                setentry_date(response.data.data.entry_date);
                setFormData(response.data.data.details);
           
            }
          } catch (error) {
            if (error?.response?.data?.error) {
              dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }));
            } else {
              dispatch(callAlert({ message: error.message, type: 'FAILED' }));
            }
          }
        };
    
        if (form_id) {
          getTnx();
        }
      }, [form_id, dispatch]);
          
      const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
      };


    return (

        <Layout>
            <Grid
                container
                spacing={4}
                sx={{ padding: 2 }}
            >
            
            <Grid item={true} xs={12}   >
              <TableContainer component={Paper} >
            
                </TableContainer>
            </Grid>
            
            
                <Grid item={true} xs={12}   >
                    <TableContainer component={Paper} >
                    <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '100%', verticalAlign: 'top'}} >
                        <Typography variant="h5"  sx={{ padding: 2 }}>Lead Form Details</Typography>
                    </Box>

                    <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '100%', verticalAlign: 'top', padding: '0 10px', boxSizing: 'border-box'}} >
                        <Table aria-label="Users" sx={{ size: 2 }} mt={2} >
                            <TableBody>
                                

                                <TableRow>
                                    <TableCell>User Name</TableCell>
                                    <TableCell>:</TableCell>
                                    <TableCell>{first_name + ' ' + last_name + '('+ mlm_id +')'}</TableCell>

                                    <TableCell>Contact Details</TableCell>
                                    <TableCell>:</TableCell>
                                    <TableCell>{mobile + '/' + email}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Lead Name</TableCell>
                                    <TableCell>:</TableCell>
                                    <TableCell>{lead_name}</TableCell>

                                    <TableCell>Category</TableCell>
                                    <TableCell>:</TableCell>
                                    <TableCell>{category_name}</TableCell>
                                </TableRow>
                                <TableRow>

                                    <TableCell>Form fillup Date</TableCell>
                                    <TableCell>:</TableCell>
                                    <TableCell>{entry_date}</TableCell>
                                    
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Table aria-label="User Details"  style={{width: '100%', border: '1px solid'}} mt={2}>
                            
                                <TableRow>
                                    <TableCell style={{width:'30%', fontWeight:'bold'}}>Field Name</TableCell>
                                    <TableCell style={{width:'5%' , fontWeight:'bold'}}></TableCell>
                                    <TableCell style={{width:'65%' , fontWeight:'bold'}}>Field Value</TableCell>
                                </TableRow>
                            
                            <TableBody>
                            {formData.map((obj, index) => (

                                <TableRow key={index}>
                                    <TableCell style={{width:'30%'}}>
                                        {obj.field_header}
                                    </TableCell>
                                    <TableCell style={{width:'5%'}}>:</TableCell>
                                    <TableCell style={{width:'65%'}}>
                                        {obj.type=='image' ? (
                                            <>
                                            <Link href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${obj.field_value}`}>
                                                <a>
                                                    <Button variant="contained" size="small" color="success" style={{ fontWeight: 'bold' }}>View</Button>
                                                </a>
                                            </Link>
                                            </>
                                        ):(
                                            <>
                                                {obj.field_value}
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            
                            </TableBody>
                        </Table>
                    </Box>

                        <br /><br /><br /><br /><br />
                    </TableContainer>
                </Grid>
            </Grid>
        </Layout>


    );
}
export default withAuth(TransactionHistory);

