"use client"
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Packageshow from "@/components/package/package";
import { Grid,Paper,TableContainer, Button } from "@mui/material";
import { Typography,Divider,Box,TextField} from "@mui/material";

import AddPackage from '@/components/package/add-packages'; 


const drawWidth = 220;
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

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',

    bgcolor: 'background.paper',
    borderRadius: 2,
    // border: '2px solid #000',
    boxShadow: 24, overflow: 'auto'
};

const innerStyle = {
    overflow: 'auto',
    width: 400,
    height: 400,
};


function TransactionHistory(props) {
  
    const [showServiceTrans, setShowServiceTrans] = useState({});
    const [openForm, setOpenForm] = useState(false); // New state for form visibility
    const dispatch = useDispatch();
    const uid = Cookies.get('uid');

    let rows;

    if (showServiceTrans && showServiceTrans.length > 0) {
        rows = [
            ...showServiceTrans
        ];
    } else {
        rows = [];
    }

    useEffect(() => {
        const getTnx = async () => {
          const reqData = {
          };

          // const originalString = 'Hello, World!';
          // const encryptedData = DataEncrypt(JSON.stringify(originalString));
          // console.log(encryptedData);
          // const decryptedObject = DataDecrypt(encryptedData);
          // console.log(decryptedObject);
          try {
            const response = await api.post('/api/package/e073159b050cf66c48230c3ff349c791aa617449', reqData);
            if (response.status === 200) {
              setShowServiceTrans(response.data.data);
            }
          } catch (error) {
            if (error?.response?.data?.error) {
              dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }));
            } else {
              dispatch(callAlert({ message: error.message, type: 'FAILED' }));
            }
          }
        };
    
        if (uid) {
          getTnx();
        }
      }, [uid, dispatch]);

      const handleOpenForm = () => setOpenForm(true);
      const handleCloseForm = () => setOpenForm(false);

    return (

        <Layout>
            <Grid
                container
                spacing={4}
                sx={{ padding: 2 }}
            >
            
            <Grid item={true} xs={12}   >
              <TableContainer component={Paper} >
                <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '40%', verticalAlign: 'top'}} >
                    <Typography variant="h5"  sx={{ padding: 2 }}>BBPS Recharge Panel [List]</Typography>
                </Box>
                </TableContainer>
            </Grid>
            
            </Grid>
            <Grid item>
               <Box display="flex" justifyContent="flex-start" mr={2} mt={1} ml={2} mb={1}>
                  <Button variant="contained" color="success" href={`/add-package/`} size="medium" onClick={handleOpenForm}>
                      Add new package
                  </Button>
              </Box> 
                {/* <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'center'} mt={2}  mb={1}  sx={{ verticalAlign: 'top' }}>
                            <Button variant="contained"  style={{ marginRight: '5px' }} href={`/add-package/`}>Add New Graphics
                            </Button>
                           
                        </Box> */}
          </Grid>
            
            <Packageshow showServiceTrans={showServiceTrans} />
            {/* <AddPackage open={openForm} onClose={handleCloseForm}/> */}
        </Layout>


    );
}
export default withAuth(TransactionHistory);

