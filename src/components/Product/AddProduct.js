import { Box, Button,Divider,TextField,InputLabel,Select,MenuItem, Container, Grid, Paper, Table, TableBody, StyledTableCell, TableContainer, TableHead, TablePagination, TableRow, Typography,Link } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import Cookies from "js-cookie";
import { ArrowBack } from "@mui/icons-material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import dayjs from 'dayjs';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
    Unstable_NumberInput as BaseNumberInput,
    numberInputClasses,
  } from '@mui/base/Unstable_NumberInput';

import FormControl from '@mui/material/FormControl';
import { useRouter } from 'next/router';
 
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



const AddBannersTransactions = () => {
    const router = useRouter();
    const uid = Cookies.get('uid');
    const { action, product_id } = router.query;
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
  

        const [title, setTitle] = useState('');
        const [unit_price, setUnitPrice] = useState('');
        const [description, setDescription] = useState('');
        const [purchase_price, setPurchasePrice] = useState([]);
        const [images, setImages] = useState([]);

        const handleImageChange = (e) => {
            const files = e.target.files;
            
            const validFiles = Array.from(files).filter(file =>
                file.type.startsWith('image/')
            );
            
            const filteredFiles = validFiles.filter(
                (newFile) => !images.some((image) => image.name === newFile.name)
            );

            setImages((prevImages) => [...prevImages, ...filteredFiles]);
        };

        const handleRemoveImage = async (index, item_id) => {
            if (item_id) {
                await deteleData(item_id);
            }
            
            const updatedImages = [...images];
            updatedImages.splice(index, 1); 
            setImages(updatedImages); 
        };


        // Benefit
      const [benefits, setbenefit] = useState([]);
      const [editingBenefitIndex, setEditingBenefitIndex] = useState(null);
      const [newbenefitRow, setNewbenefitRow] = useState({ benefit: '' });
    
      const newbenefithandleChange = (e) => {
        const { name, value } = e.target;
        setNewbenefitRow((prev) => ({ ...prev, [name]: value }));
      };
    
      const addNewbenefitRow = () => {
        const updatedRows = [...benefits, { id: benefits.length + 1, ...newbenefitRow }];
        setbenefit(updatedRows);
        setNewbenefitRow({ benefit: '' });
      };

      const handleEditBenefit = (index) => {
        setEditingBenefitIndex(index);
        setNewbenefitRow({ ...benefits[index] });
      };
    
      const handleUpdateBenefit = () => {
        const updatedRows = [...benefits];
        updatedRows[editingBenefitIndex] = { ...newbenefitRow };
        setbenefit(updatedRows);
        setEditingBenefitIndex(null);
        setNewbenefitRow({ benefit: '' });
      };
    
      const handleDeleteBenefit = (index) => {
        const updatedRows = [...benefits];
        updatedRows.splice(index, 1);
        setbenefit(updatedRows);
      };
    

        useEffect(() => {
            if(action == 'update')
            {
              const reqAllData = {
                "product_id": product_id
              };

              const getAlldata = async () => {
                try {
                  const response = await api.post("/api/product/get-product-by-id", reqAllData);
                  
                  if (response.status === 200) {
                      const data = response.data.data;
    
                      setTitle(data.name);
                      setUnitPrice(parseInt(data.unit_price));
                      setPurchasePrice(parseInt(data.purchase_price));
                      setDescription(data.details);
                      
                      const updatedRows = [];
                      const updatedimage = [];

                        
                        
                        if(data.images)
                        {
                          let i=0;
                          for(const ndetail of data.images)
                          {
                            i++;
    
                            updatedimage.push({'id': i,'details_id':ndetail.id,'image': ndetail.image, 'old': 1});
                          }
                          
                        }
                        
                        setImages(updatedimage);
                        if(data.benefits)
                        {
                            let i=0;
                            for(const ndetail of data.benefits)
                            {
                                i++;
                                updatedRows.push({'id': i,'benefit': ndetail});
                            }

                        }
    
                        
                        setbenefit(updatedRows);
                      
                  }
                } catch (error) {
                  console.error("Error fetching Details:", error.message);
                }
              };
    
              getAlldata();
            }
            
          }, [action, product_id]);
          
        const handleSubmit = async () => {

          const benefitData = {};
          let i = 0;
          for (const item of benefits) {
            i++;
            benefitData[i] = item.benefit;
          }

          const formData ={
            'images': images,
            'name':title,
            'unit_price': unit_price,
            'purchase_price': purchase_price,
            'details': description,
            'created_by': uid,
            'benefits': JSON.stringify(benefitData)
          }

            try {
                let apiUrl = '/api/product/add-new-product';
                if(action == 'update')
                {   
                    formData.product_id = product_id;
                    apiUrl ='/api/product/update-product'
                }
                const response = await api.post(apiUrl, formData,{

                    headers:{'content-type': 'multipart/form-data'}
                
                
                });
            
            if (response) {
                if(response.status == 200)
                {
                  alert(response.data.message);
                  window.history.back();
                    
                }else{
                    alert(response.data.message);
                }
                
            } else {
                console.error('Failed to upload file');
            }

            } catch (error) {
            console.error('Error uploading file:', error);
            }
        
        };
        const deteleData = async (item_id) =>
        {
            if(item_id)
            {
            const formData ={
                'item_detail_id': item_id,
                'action': 'update'
            }
            try {
    
            let response = response = await api.post('/api/product/delete-product-image', formData);
            
            if (response) {
                alert('Deleted successfully');
            } else {
                alert(response.data.error);
                console.error('Failed to delete');
            }
    
            } catch (error) {
            console.error('Error uploading file:', error);
            }
    
            }
    
        }
      
    
    return (

        <main className="p-6 space-y-6">
          
            <Grid
                container
                spacing={4}
                sx={{ padding: 2 }}
            >
            
            <Grid item={true} xs={12}   >
                <TableContainer component={Paper} >

                    <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '30%', verticalAlign: 'top'}} >
                        <Typography variant="h5"  sx={{ padding: 2 }}>Add New Product</Typography>
                    </Box>

                    <Grid spacing={2} xs={6}  sx={{ padding: 4 }} container>

                    <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '100%', verticalAlign: 'top'}} >
                        
                        <TextField required fullWidth label="Product Name" variant="outlined" display={'inline-block'}
                        value={title} onChange={(e) => setTitle(e.target.value)}  />
                    </Box>
                    
                    <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '100%', verticalAlign: 'top'}} >

                        <NumberInput  required size="normal"
                            fullWidth label="Unit Price" 
                            variant="outlined" display={'inline-block'}
                            value={unit_price} 
                            placeholder="Unit Price"
                            mr={3}
                            onChange={(event, val) => setUnitPrice(val)}
                            /> 
                    </Box>

                    <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '100%', verticalAlign: 'top'}} >

                        <NumberInput required size="normal"
                        fullWidth label="Purchase Price" 
                        variant="outlined" display={'inline-block'}
                        value={purchase_price} 
                        placeholder="Purchase Price"
                        
                        onChange={(event, val) => setPurchasePrice(val)} />

                    </Box>

                    <Box justifyContent={'space-between'} alignItems={'left'} mt={1} mb={1} style={{width: '100%', verticalAlign: 'top'}} >

                        <TextareaAutosize  fullWidth
                                label="Description" 
                                minRows={3}
                                size="normal"
                                variant="outlined"
                                placeholder="Description" 
                                style={{height: '150px', width:'100%', border: '1px solid #ced4da', padding: '15px', borderRadius: '4px', boxSizing: 'border-box'}}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                        /> 
                    </Box>
                    <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '100%', verticalAlign: 'top'}} >
                        
                        <TableContainer component={Paper}>
                            <Typography variant="p"  sx={{ padding: 2 }}>Benefits</Typography>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell width="80%"><TextField fullWidth
                                            name="benefit"
                                            label="Benefit"
                                            variant="outlined"
                                            onChange={newbenefithandleChange}
                                            /></TableCell>
                                        <TableCell width="20%"><Button variant="contained" size="small" onClick={addNewbenefitRow} style={{ marginTop: '8px' }}>Add Row</Button></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <Table>
                                <TableHead>
                                <TableRow>
                                    <TableCell width="15%">Sl No.</TableCell>
                                    <TableCell width="55%">Benefit</TableCell>
                                    <TableCell width="30%">Action</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {benefits.map((row, index) => (
                                    <TableRow key={index}>
                                      <TableCell>{row.id}</TableCell>
                                      <TableCell>{index === editingBenefitIndex ? <TextField fullWidth name="benefit" variant="outlined" value={newbenefitRow.benefit} onChange={(e) => setNewbenefitRow({ ...newbenefitRow, benefit: e.target.value })} /> : row.benefit}</TableCell>
                                      <TableCell>
                                          {index === editingBenefitIndex ? (
                                            <>
                                              <Button variant="contained" onClick={handleUpdateBenefit} size="small" color="warning" style={{ marginRight: '8px' }}>Update</Button>
                                              <Button variant="contained" onClick={setEditingBenefitIndex} size="small" color="error" style={{ marginRight: '8px' }}>Cancel</Button>
                                            </>
                                          ) : (
                                            <>
                                              <Button variant="contained" onClick={() => handleEditBenefit(index)} size="small" color="warning" style={{ marginRight: '8px' }}>Edit</Button>
                                              <Button variant="contained" onClick={() => handleDeleteBenefit(index)} size="small" color="error" style={{ marginRight: '8px' }}>Delete</Button>
                                            </>
                                          )}
                                      </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                            </TableContainer>
                
                            
                    </Box>
                    <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'left'} mt={1} mb={1} style={{width: '100%', verticalAlign: 'top', padding: '10px'}} >
                        <div>
                        <Typography variant="p"  sx={{ padding: 2 }}>Product Images</Typography>

                        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                        Upload file
                        <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: 'none' }} />
                        </Button>

                        <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                            <TableRow>
                                <TableCell>Sl No.</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {images.map((image, index) => (
                                <TableRow key={image.name || index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    {image.old == 1 ? (
                                    <Link href={process.env.NEXT_PUBLIC_API_BASE_URL + '/'+image.image} target="_blank" display="inline" ml={2}>
                                        <img src={process.env.NEXT_PUBLIC_API_BASE_URL + '/'+image.image} alt="Product Image" width="300" height="200" />
                                    </Link>
                                    ) : (
                                    <img src={URL.createObjectURL(image)} alt={`Image ${index}`} width={300} height={200} />
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Button
                                    variant="contained"
                                    size="small"
                                    color="error"
                                    onClick={() => handleRemoveImage(index, image.details_id ? image.details_id : null)}
                                    >
                                    Remove
                                    </Button>
                                </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        </TableContainer>
                        </div> 
                    </Box> 
                    </Grid>

                    <Grid item>
                        <Box display="flex" justifyContent="flex-start" mr={2}  mt={1} ml={2} mb={1} >
                            <Button variant="contained" color="success" size="medium" onClick={handleSubmit}>
                                Submit
                            </Button>
                        </Box>
                        
                                    
                    </Grid>
                    
                </TableContainer>
            </Grid>
            
        </Grid>
              
    </main>
    )
}
export default AddBannersTransactions;