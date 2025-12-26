"use client"
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import { Grid,Paper,TableContainer, FormControl, InputLabel, Select, MenuItem,Button } from "@mui/material";
import { Typography,Divider,Box,TextField} from "@mui/material";
import { useRouter } from 'next/router';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { DataEncrypt, DataDecrypt } from '../../utils/encryption';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import {
    Unstable_NumberInput as BaseNumberInput,
    numberInputClasses,
  } from '@mui/base/Unstable_NumberInput';
 
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

function TransactionHistory(props) {

    const NumberInput = React.forwardRef(function CustomNumberInput(props, ref) {
        return (
          <BaseNumberInput
            slots={{
              root: StyledInputRoot,
              input: StyledInputElement,
              incrementButton: StyledButton,
              decrementButton: StyledButton,
            }}
            slotProps={{
              incrementButton: {
                children: '▴',
              },
              decrementButton: {
                children: '▾',
              },
            }}
            {...props}
            ref={ref}
          />
        );
      });

      const blue = {
        100: '#DAECFF',
        200: '#80BFFF',
        400: '#3399FF',
        500: '#007FFF',
        600: '#0072E5',
      };
      
      const grey = {
        50: '#F3F6F9',
        100: '#E5EAF2',
        200: '#DAE2ED',
        300: '#C7D0DD',
        400: '#B0B8C4',
        500: '#9DA8B7',
        600: '#6B7A90',
        700: '#434D5B',
        800: '#303740',
        900: '#1C2025',
      };
      
const StyledInputRoot = styled('div')(
    ({ theme }) => `
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 400;
    border-radius: 8px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
    display: grid;
    grid-template-columns: 1fr 19px;
    grid-template-rows: 1fr 1fr;
    overflow: hidden;
    column-gap: 8px;
    padding: 4px;
  
    &.${numberInputClasses.focused} {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    }
  
    &:hover {
      border-color: ${blue[400]};
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `,
  );
  
  const StyledInputElement = styled('input')(
    ({ theme }) => `
    font-size: 0.875rem;
    font-family: inherit;
    font-weight: 400;
    line-height: 1.5;
    grid-column: 1/2;
    grid-row: 1/3;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: inherit;
    border: none;
    border-radius: inherit;
    padding: 8px 12px;
    outline: 0;
  `,
  );
  
  const StyledButton = styled('button')(
    ({ theme }) => `
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    appearance: none;
    padding: 0;
    width: 19px;
    height: 19px;
    font-family: system-ui, sans-serif;
    font-size: 0.875rem;
    line-height: 1;
    box-sizing: border-box;
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 0;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 120ms;
  
    &:hover {
      background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
      border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
      cursor: pointer;
    }
  
    &.${numberInputClasses.incrementButton} {
      grid-column: 2/3;
      grid-row: 1/2;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      border: 1px solid;
      border-bottom: 0;
      &:hover {
        cursor: pointer;
        background: ${blue[400]};
        color: ${grey[50]};
      }
  
    border-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
    color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
    }
  
    &.${numberInputClasses.decrementButton} {
      grid-column: 2/3;
      grid-row: 2/3;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      border: 1px solid;
      &:hover {
        cursor: pointer;
        background: ${blue[400]};
        color: ${grey[50]};
      }
  
    border-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
    color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
    }
    & .arrow {
      transform: translateY(-1px);
    }
  `,
  );
    

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
  
  
    const [showServiceTrans, setShowServiceTrans] = useState({});
    let rows;

    if (showServiceTrans && showServiceTrans.length > 0) {
        rows = [
            ...showServiceTrans
        ];
    } else {
        rows = [];
    }
    const dispatch = useDispatch();
    const router = useRouter();
    const { id } = router.query;

    const [ebook_name, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState([]);
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [discount, setDiscount] = useState('');
    // const [refund, setRefund] = useState('');
    // const [refund_day_limit, setRefundDayLimit] = useState('');
    const [transactionType, setTransactionType] = useState('');
   const [selectedFile, setSelectedFile] = useState(null);
   const [selectedPdf, setSelectedPdf] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };
    const handleFileChangePdf = (event) => {
        const file = event.target.files[0];
        setSelectedPdf(file);
    };

    const handleChange = (event) => {
        setTransactionType(event.target.value);
    };


    useEffect(() => {
      const getCategories = async () => {
        try {
          const response = await api.get("/api/ebookCategories/get-category");
          if (response.status === 200) {
            const decryptedObject = DataDecrypt(response.data);
            setCategories(decryptedObject.data);
          }
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
  
      getCategories();
  }, []);
   

    useEffect(() => {
       
        const all_parameters = {
            "ebook_id": id
        };
        // const encryptedData = DataEncrypt(JSON.stringify(all_parameters));

        const getTnx = async () => {
        //   const reqData = {
        //     encReq: encryptedData
        //   };
          try {
            const response1 = await api.post('/api/ebook/get-ebook-data', all_parameters);
            if (response1.data.status === 200) {
                setTitle(response1.data.data.ebook_name);
                setAuthor(response1.data.data.author);
                setDescription(response1.data.data.description);
                setPrice(response1.data.data.price);
                setQuantity(response1.data.data.quantity);
                setDiscount(response1.data.data.discount);
                // setRefund(response1.data.data.refund);
                // setRefundDayLimit(response1.data.data.refund_day_limit);
                setDescription(response1.data.data.description);
                setTransactionType(response1.data.data.category);
            }
          } catch (error) {
            if (error?.response?.data?.error) {
              dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }));
            } else {
              dispatch(callAlert({ message: error.message, type: 'FAILED' }));
            }
          }
        };
    
        if (id) {
          getTnx();
        }
      }, [id, dispatch]);

  

    
    const handleSubmit = async () => {
      
            const formData ={
                'id':id,
                'ebook_name':ebook_name,
                'author':author,
                'description':description,
                'price':price,
                'quantity':quantity,
                'discount':discount,
                'refund':refund,
                'refund_day_limit':refund_day_limit,
                'category':12,
                'image':selectedFile ,
                'ebook_pdf':selectedFile            
            }

        try {
          
        
            const response = await api.post('/api/ebook/update-ebook', formData,{
                headers:{'content-type': 'multipart/form-data'}
            });
        
            if (response.status==200) {
                window.history.back();
                alert('Updated successfully');
            } else{
                alert("Failed to update");
            }

        } catch (error) {
            console.error('Error updating :', error);
        }
        
        };
       
    
        const statushandleChange = (event) => {
            setstatus(event.target.value);
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

                        <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '40%', verticalAlign: 'top'}} >
                            <Typography variant="h5"  sx={{ padding: 2 }}>Ebook [Update] </Typography>
                        </Box>

                        <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                            <TextField required  fullWidth label="Ebook Name" variant="outlined" display={'inline-block'}
                            value={ebook_name} onChange={(e) => setTitle(e.target.value)}  />
                        </Box>

                        <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                            <TextField required  fullWidth label="Author" variant="outlined" display={'inline-block'}
                            value={author} onChange={(e) => setAuthor(e.target.value)}  />
                        </Box>

                        <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                            <NumberInput required  fullWidth label="Price" variant="outlined" display={'inline-block'}
                            value={price} onChange={(e) => setPrice(e.target.value)}  placeholder="Enter Price" />
                        </Box>

                        <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                            <NumberInput required  fullWidth label="Quantity" variant="outlined" display={'inline-block'}
                            value={quantity} onChange={(e) => setQuantity(e.target.value)}  placeholder="Enter Quantity" />
                        </Box>

                        <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >
                            <NumberInput required  fullWidth label="Discount" variant="outlined" display={'inline-block'}
                            value={discount} onChange={(e) => setDiscount(e.target.value)}  placeholder="Enter Discount" />
                        </Box>

                    
                             
                    <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '50%', verticalAlign: 'top', padding: '0 10px'}} >

                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Ebook Category</InputLabel>
                                    <Select
                                    labelId="ebook-category-label"
                                    id="transaction-type"
                                    value={transactionType}
                                    label="Ebook Category"
                                    onChange={handleChange}
                                >
                                <MenuItem value="">Please Select</MenuItem>
                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.category}
                                    </MenuItem>
                                    ))}
                            
                            </Select>
                        </FormControl>

                        </Box>

                        <Box justifyContent="space-between" alignItems="center" mt={1} ml={2} mb={1} sx={{ width: '50%', verticalAlign: 'top' }}>
                            <Typography variant="h6"  sx={{ fontSize: '20px' , }}>Upload Pdf </Typography>
                            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                            Upload Pdf
                            <VisuallyHiddenInput type="file" onChange={(event) => handleFileChangePdf(event)} />
                            </Button>
                            {selectedPdf && (
                            <Typography variant="body2" sx={{ marginTop: 1 }}>
                                {selectedPdf.name}
                            </Typography>
                            )}
                        </Box>

                        <Box justifyContent="space-between" alignItems="center" mt={1} ml={2} mb={1} sx={{ width: '50%', verticalAlign: 'top' }}>
                            <Typography variant="h6"  sx={{ fontSize: '20px' , }}>Upload Image </Typography>
                            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                            Upload Image
                            <VisuallyHiddenInput type="file" onChange={(event) => handleFileChange(event)} />
                            </Button>
                            {selectedFile && (
                            <Typography variant="body2" sx={{ marginTop: 1 }}>
                                {selectedFile.name}
                            </Typography>
                            )}
                        </Box>


                        
                        <Box justifyContent={'space-between'} alignItems={'right'} mt={3} ml={2} mb={0} style={{width: '100%', verticalAlign: 'top'}} >
                            <TextareaAutosize  fullWidth
                                    label="Description" 
                                    minRows={3}
                                    size="normal"
                                    variant="outlined"
                                    placeholder="Description" 
                                    style={{height: '90px', width:'968px', border: '1px solid #ced4da', borderRadius: '4px', padding: '10px' }}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                            /> 
                        </Box>



                        <Grid item>
                            <Box display="flex" justifyContent="flex-first" mr={2}  mt={1} ml={2} mb={1} >
                            <Button variant="contained" color="success" size="medium" onClick={handleSubmit}>
                                Update
                            </Button>
                            </Box>   
                        </Grid>
                        <br /><br />
                    </TableContainer>
                </Grid>
            </Grid>
        </Layout>


    );
}
export default withAuth(TransactionHistory);

