import { Box, Button,Divider,TextField,InputLabel,Select,MenuItem, Container, Grid, Paper, Table, TableBody, StyledTableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, Stepper, Step, StepLabel, Link } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import Cookies from "js-cookie";
import { ArrowBack, ColorLensOutlined } from "@mui/icons-material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
    Unstable_NumberInput as BaseNumberInput,
    numberInputClasses,
  } from '@mui/base/Unstable_NumberInput';
import { DataEncrypt, DataDecrypt } from '../../../utils/encryption';

import FormControl from '@mui/material/FormControl';
import Image from 'next/image';
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



const AddLeadCategoryTransactions = () => {

    const router = useRouter();
    const { action, lead_id, category_id } = router.query;
    const steps = ['Label', 'Details', 'Marketing', 'FAQ', 'Videos'];

    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
      setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
      setActiveStep((prevStep) => prevStep - 1);
    };

    
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
    const [selectedFile, setSelectedFile] = useState(null);
    const [bannerFile, setBannerFile] = useState(null);
    const [description, setDescription] = useState('');
    const [specification, setSpecification] = useState('');
    const [leadCategory, setLeadCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [sequence, setSequense] = useState('');
    const [total_earning, settotal_earning] = useState('');
    const [distribution_amount, setdistribution_amount] = useState('');
    const [download_app_link, setdownload_app_link] = useState('');
    const [opnel_now_link, setopnel_now_link] = useState('');
    const [referral_link, setreferral_link] = useState('');
    const [video_link, setvideo_link] = useState('');
    const [buynow_link, setbuynow_link] = useState('');

    
    

    

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      setSelectedFile(file);
    };

    const bannerFileChange = (event) => {
      const file = event.target.files[0];
      setBannerFile(file);
    };
    
    const handleCancel = async () => {
      window.history.back();
    };
    
     const handleChange = (event) => {
        setLeadCategory(event.target.value);
      };

      const [images, setImages] = useState([]);
      const [imageLabels, setImageLabels] = useState([]);
    
      const handleImageChange = (e) => {
        const files = e.target.files;
    
        // Convert FileList to an array and update state
        setImages((prevImages) => [...prevImages, ...Array.from(files)]);
      };
    
      const handleLabelChange = (index, label) => {
        const updatedLabels = [...imageLabels];
        updatedLabels[index] = label;
        setImageLabels(updatedLabels);
      };
    
      const handleRemoveImage = (index) => {
        const updatedImages = [...images];
        const updatedLabels = [...imageLabels];
    
        updatedImages.splice(index, 1);
        updatedLabels.splice(index, 1);
    
        setImages(updatedImages);
        setImageLabels(updatedLabels);
      };
    
      const handleUpload = () => {
        // Implement image upload logic (e.g., send images and labels to the server)
        console.log('Uploading images with labels:', { images, imageLabels });
      };

  
    useEffect(() => {
        const all_parameters = {
            "category_name1": null
        }
        const encryptedData = DataEncrypt(JSON.stringify(all_parameters));
        const reqData = {
          encReq: encryptedData
        };
        const getCategories = async () => {
          try {
            const response = await api.post("/api/leads/get-category", reqData);
            if (response.status === 200) {
              const decryptedObject = DataDecrypt(response.data);
              setCategories(decryptedObject.data);
           
            }
          } catch (error) {
            console.error("Error fetching categories:", error);
          }
        };
        
        if(action == 'update')
        {
          const reqAllData = {
            "category_id": category_id,
            "lead_header_id": lead_id
          };
          const allData = DataEncrypt(JSON.stringify(reqAllData));
          const reqencData = {
            encReq: allData
          };
          const getAlldata = async () => {
            try {
              const response = await api.post("/api/leads/get-leads-details", reqencData);
              
              if (response.status === 200) {
                  const dataObject = DataDecrypt(response.data);
                  const main_data = dataObject.main_data;
                  const data = dataObject.data;

                  setTitle(main_data.lead_name);
                  setSelectedFile(main_data.img);
                  setBannerFile(main_data.banner_img);
                  setDescription(main_data.description);
                  setSpecification(main_data.specification);
                  setLeadCategory(main_data.category_id);
                  setSequense(main_data.sequence);
                  settotal_earning(main_data.total_earning);
                  setdistribution_amount(main_data.distribution_amount);
                  setdownload_app_link(main_data.download_app_link);
                  setopnel_now_link(main_data.open_now_link);
                  setreferral_link(main_data.referral_link);
                  setvideo_link(main_data.video_link);
                  setbuynow_link(main_data.link);
                  

                  const updatedRows = [];
                  const updatedfaq = [];
                  const updatedimage = [];
                  const updateVideo = [];
                  for(const detail of data)
                  {
                    
                    if(detail.lead_detail_group == 'Details')
                    {
                      let i=0;
                      for(const ndetail of detail.leads)
                      {
                        i++;
                        updatedRows.push({'id': i,'name': ndetail.lead_value, 'description': ndetail.description.join('')});
                      }
                      
                    }

                    if(detail.lead_detail_group == 'Marketing')
                    {
                      let i=0;
                      for(const ndetail of detail.leads)
                      {
                        i++;

                        updatedimage.push({'id': i,'image': ndetail.image, 'imageLabels': ndetail.lead_value, 'old': 1});
                      }
                      
                    }

                    if(detail.lead_detail_group == 'faqs')
                    {
                      let i=0;
                      for(const ndetail of detail.leads)
                      {
                        i++;
                        updatedfaq.push({'id': i,'question': ndetail.question, 'answer': ndetail.description.join('')});
                      }
                      
                    }

                    if(detail.lead_detail_group == 'Video')
                    {
                      let i=0;
                      for(const ndetail of detail.leads)
                      {
                        i++;
                        updateVideo.push({'label': ndetail.lead_value, 'link': ndetail.video, 'video_image': null });
                      }
                      
                    }
                  }
                  setRows(updatedRows);
                  setfaqs(updatedfaq);
                  setVideos(updateVideo);
                  setImages(updatedimage);
                const decryptedObject = DataDecrypt(response.data);
                setCategories(decryptedObject.data);
             
              }
            } catch (error) {
              console.error("Error fetching Details:", error.message);
            }
          };

          getAlldata();
        }
        

    
        getCategories();
      }, [action, lead_id, category_id]);
  
      //Details
      const [rows, setRows] = useState([]);
      const [editingRowIndex, setEditingRowIndex] = useState(null);
      const [newRow, setNewRow] = useState({ name: '', description: '' });
    
      const newhandleChange = (e) => {
        const { name, value } = e.target;
        setNewRow((prev) => ({ ...prev, [name]: value }));
      };
    
      const addNewRow = () => {
        const updatedRows = [...rows, { id: rows.length + 1, ...newRow }];
        setRows(updatedRows);
        setNewRow({ name: '', description: '' });
      };

      const handleEditRow = (index) => {
        setEditingRowIndex(index);
        setNewRow({ ...rows[index] });
      };
    
      const handleUpdateRow = () => {
        const updatedRows = [...rows];
        updatedRows[editingRowIndex] = { ...newRow };
        setRows(updatedRows);
        setEditingRowIndex(null);
        setNewRow({ name: '', description: '' });
      };
    
      const handleDeleteRow = (index) => {
        const updatedRows = [...rows];
        updatedRows.splice(index, 1);
        setRows(updatedRows);
      };

      // Faq
      const [faqs, setfaqs] = useState([]);
      const [editingFaqIndex, setEditingFaqIndex] = useState(null);
      const [newfaqsRow, setNewfaqsRow] = useState({ question: '', answer: '' });
    
      const newfaqhandleChange = (e) => {
        const { name, value } = e.target;
        setNewfaqsRow((prev) => ({ ...prev, [name]: value }));
      };
    
      const addNewfaqRow = () => {
        const updatedRows = [...faqs, { id: faqs.length + 1, ...newfaqsRow }];
        setfaqs(updatedRows);
        setNewfaqsRow({ question: '', answer: '' });
      };

      const handleEditFaq = (index) => {
        setEditingFaqIndex(index);
        setNewfaqsRow({ ...faqs[index] });
      };
    
      const handleUpdateFaq = () => {
        const updatedRows = [...faqs];
        updatedRows[editingFaqIndex] = { ...newfaqsRow };
        setfaqs(updatedRows);
        setEditingFaqIndex(null);
        setNewfaqsRow({ question: '', answer: '' });
      };
    
      const handleDeleteFaq = (index) => {
        const updatedRows = [...faqs];
        updatedRows.splice(index, 1);
        setfaqs(updatedRows);
      };


      // Video
      const [videos, setVideos] = useState([]);
      const [newVideo, setNewVideo] = useState({ label: '', link: '', video_image: null });
      const [editingIndex, setEditingIndex] = useState(null);
      const [validationError, setValidationError] = useState('');

      const newVideoHandleChange = (event) => {
        const { name, value } = event.target;
        setNewVideo((prevVideo) => ({ ...prevVideo, [name]: value }));
      };

      const handlevideoImageChange = (event) => {
        const imageFile = event.target.files[0];
        setNewVideo((prevVideo) => ({ ...prevVideo, video_image: imageFile }));
      };

      const validateFields = () => {
        if (!newVideo.label || !newVideo.link || !newVideo.video_image) {
          setValidationError('All fields are mandatory');
          return false;
        }
        setValidationError('');
        return true;
      };

      const addNewVideoRow = () => {
        if (validateFields()) {
          setVideos((prevVideos) => [...prevVideos, newVideo]);
          setNewVideo({ label: '', link: '', video_image: null });
        }
      };

      const editVideoRow = (index) => {
        console.log(videos[index]);
        setNewVideo({ label: '', link: '', video_image: null }); // Set the fields to the values of the selected video
        setEditingIndex(index);
      };

      const updateVideoRow = () => {
        if (validateFields()) {
          const updatedVideos = [...videos];
          updatedVideos[editingIndex] = newVideo;
          setVideos(updatedVideos);
          setNewVideo({ label: '', link: '', video_image: null });
          setEditingIndex(null);
        }
      };

      const deleteVideoRow = (index) => {
        const updatedVideos = [...videos];
        updatedVideos.splice(index, 1);
        setVideos(updatedVideos);
      };


      const handleLinkClick = (img) => {
      
        window.open(img, '_blank', 'noopener,noreferrer');
      };

        console.log(bannerFile);
      


      const handleSubmit = async () => {

        let videoImage = [];
        for(const item of videos)
        {
          videoImage.push(item.video_image);
        }
        
        const formData ={
          'image': selectedFile,
          'banner_image': bannerFile,
          'lead_name':title.replace(/'/g, "\\'"),
          'description':description.replace(/'/g, "\\'"),
          'specification':specification.replace(/'/g, "\\'"),
          'category_id':leadCategory?leadCategory:1,
          'sequense':null,
          'total_earning': total_earning,
          'distribution_amount': distribution_amount,
          'download_app_link': download_app_link,
          'open_now_link': opnel_now_link,
          'referral_link': referral_link,
          'video_link': video_link,
          'link': buynow_link,
          'row_data': JSON.stringify({ tableData: rows }),
          'marketing_image': images,
          'bulk_image_level': imageLabels,
          'faq_data': JSON.stringify({ tableData: faqs }),
          'video_data': JSON.stringify(videos),
          'video_image': videoImage,
        }
       
      try {

       //console.log(formData);
        let response = [];

        if(action=='update'){
            formData.lead_id = lead_id;
            response = await api.post('/api/leads/update-leads', formData,{
              headers:{'content-type': 'multipart/form-data'}
            });
        }else{
            response = await api.post('/api/leads/add-leads', formData,{
              headers:{'content-type': 'multipart/form-data'}
            });
        }
        
      
        if (response) {
          window.history.back();
          alert('Leads Saved  successfully');
        } else {
          alert(response.data.error);
          console.error('Failed to save');
        }

      } catch (error) {
        console.error('Error uploading file:', error);
      }
      
    };

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
                        <Typography variant="h5"  sx={{ padding: 2 }}>{action =='update' ? ( <>Update Primary products</>): (<>Add New Primary products</>)}</Typography>
                    </Box>

                    <Stepper activeStep={activeStep} alternativeLabel>
                      {steps.map((label) => (
                        <Step key={label}>
                          <StepLabel>{label}</StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                    {activeStep === 0 && (
                      <Grid spacing={2}   sx={{ padding: 3 }} container>

                        <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={3} mb={1} style={{width: '49%', verticalAlign: 'top', padding: '0 10px'}} >

                        <TextField required size="normal"
                        fullWidth label="Product Name" 
                        variant="outlined" display={'inline-block'}
                        value={title} 
                        mr={3}
                        onChange={(e) => setTitle(e.target.value)}  />

                        </Box>

                        <Box justifyContent={'space-between'} alignItems={'right'} mt={3} ml={1} mb={0} style={{width: '49%', verticalAlign: 'top'}} >

                        <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                <Select
                                    labelId="transaction-type-label"
                                    id="transaction-type"
                                    variant="outlined"
                                    value={leadCategory}
                                    label="Lead Type"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="">Please Select</MenuItem>
                                    
                                        {categories.map((category) => (

                                            
                                    <MenuItem key={category.id} value={category.id}>
                                    {category.category_name}
                                    </MenuItem>
                                    ))}

                                </Select>
                        </FormControl>

                        </Box>

                        <Box justifyContent={'space-between'} alignItems={'right'} mt={3} ml={2} mb={0} style={{width: '97%', verticalAlign: 'top'}} >

                        <TextareaAutosize  fullWidth
                                label="Short Description" 
                                minRows={3}
                                size="normal"
                                variant="outlined"
                                placeholder="Short Description" 
                                style={{height: '90px', width:'100%', border: '1px solid #ced4da', borderRadius: '4px', padding: '10px' }}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                        /> 
                        </Box>

                        <br/>        <br/>
                        <Box justifyContent={'space-between'} alignItems={'right'} mt={3} ml={2} mb={0} style={{width: '50%', verticalAlign: 'top'}} >

                        <NumberInput  required size="normal"
                            fullWidth label="Amount" 
                            variant="outlined" display={'inline-block'}
                            value={specification} 
                            placeholder="Amount"
                            mr={3}
                            onChange={(e) => setSpecification(e.target.value)} /> 
                        </Box>

                        <Box justifyContent="space-between" display="inline" alignItems="right" mt={3} ml={2} mb={2} sx={{ width: '100%',      verticalAlign: 'top' }}>
                                <Typography variant="p"  sx={{ padding: 2 }} display="inline">Poster Image</Typography>
                                <Button component="label" variant="contained"  display="inline" startIcon={<CloudUploadIcon />}>
                                Upload file
                                <VisuallyHiddenInput type="file" onChange={(event) => handleFileChange(event)}  />
                                </Button>
                                {selectedFile && (
                                <Typography variant="body2" sx={{ marginTop: 1 }} display="inline" >
                                    {selectedFile.name}
                                </Typography>
                                )}
                                {selectedFile !== null ? (<Link href="#" onClick={() => handleLinkClick(selectedFile)} display="inline" ml={2}>
                                  <Image
                                                src={selectedFile}
                                                alt="Poster Image"
                                                width={300}
                                                height={200}
                                            />
                                        </Link>
                                        ) : (
                                            ''
                                        )}
                        </Box>

                        <Box justifyContent="space-between" alignItems="right" mt={3} ml={2} mb={2} sx={{ width: '100%', verticalAlign: 'top' }}>
                                <Typography variant="p"  sx={{ padding: 2 }} display="inline">Banner Image</Typography>
                                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} display="inline">
                                Upload file
                                <VisuallyHiddenInput type="file" onChange={(event) => bannerFileChange(event)} />
                                </Button>
                                {bannerFile && (
                                <Typography variant="body2" sx={{ marginTop: 1 }} display="inline">
                                    {bannerFile.name}
                                </Typography>
                                )}

                                {bannerFile !== null ? (<Link href="#" onClick={() => handleLinkClick(bannerFile)} display="inline" ml={2}>
                                  <Image
                                                src={bannerFile}
                                                alt="Banner Image"
                                                width={300}
                                                height={200}
                                            />
                                        </Link>
                                        ) : (
                                            ''
                                        )}
                        </Box>

                        <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={3} mb={1} style={{width: '48%', verticalAlign: 'top', padding: '0 10px'}} >

                            <NumberInput required size="normal"
                            fullWidth label="TotalEarning" 
                            variant="outlined" display={'inline-block'}
                            value={total_earning} 
                            placeholder="Total Earning"
                            
                            onChange={(event, val) => settotal_earning(val)} />

                        </Box>

                        <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={3} mb={1} style={{width: '48%', verticalAlign: 'top', padding: '0 10px'}} >

                            <NumberInput required size="normal"
                                fullWidth label="DistributionAmount" 
                                variant="outlined" display={'inline-block'}
                                value={distribution_amount} 
                                placeholder="Distribution Amount"
                                
                                onChange={(event, val) => setdistribution_amount(val)} />

                        </Box>

                        <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={3} mb={1} style={{width: '48%', verticalAlign: 'top', padding: '0 10px'}} >

                            <TextField required size="normal"
                                fullWidth label="Download App Link" 
                                variant="outlined" display={'inline-block'}
                                value={download_app_link} 
                                placeholder="Download App Link"
                                onChange = {(e) => setdownload_app_link(e.target.value)} />

                        </Box>

                        <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={3} mb={1} style={{width: '48%', verticalAlign: 'top', padding: '0 10px'}} >

                            <TextField required size="normal"
                                fullWidth label="Open Now Link" 
                                variant="outlined" display={'inline-block'}
                                value={opnel_now_link} 
                                placeholder="Open Now Link"
                                onChange = {(e) => setopnel_now_link(e.target.value)} />

                        </Box>

                        <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={3} mb={1} style={{width: '48%', verticalAlign: 'top', padding: '0 10px'}} >

                            <TextField required size="normal"
                                fullWidth label="Video Link" 
                                variant="outlined" display={'inline-block'}
                                value={video_link} 
                                placeholder="Video Link"
                                onChange = {(e) => setvideo_link(e.target.value)} />

                        </Box>

                        <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={3} mb={1} style={{width: '48%', verticalAlign: 'top', padding: '0 10px'}} >

                            <TextField required size="normal"
                                fullWidth label="Referral Link" 
                                variant="outlined" display={'inline-block'}
                                value={referral_link} 
                                placeholder="Referral Link"
                                onChange = {(e) => setreferral_link(e.target.value)} />

                        </Box>


                        <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={3} mb={1} style={{width: '48%', verticalAlign: 'top', padding: '0 10px'}} >

                            <TextField required size="normal"
                                fullWidth label="Buy Now /Payment Link" 
                                variant="outlined" display={'inline-block'}
                                value={buynow_link} 
                                placeholder="Buy Now /Payment Link"
                                onChange = {(e) => setbuynow_link(e.target.value)} />

                        </Box>

                        </Grid>
                    )}


                    {activeStep === 1 && (
                      <Grid spacing={2}   sx={{ padding: 3 }} container>
                        <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '100%', verticalAlign: 'top'}} >
                            <Typography variant="h6"  sx={{ padding: 2 }}>Details</Typography>
                        </Box>
                
                        <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={3} mb={1} style={{width: '100%', verticalAlign: 'top', padding: '0 10px'}} >
                            <div style={{ marginTop: '16px' }}>  
                            <TextField fullWidth
                            name="name"
                            label="Name"
                            variant="outlined"
                            onChange={newhandleChange}
                            />
                            </div>
                            <div style={{ marginTop: '16px' }}>
                            <TextareaAutosize
                                name="description"
                                rowsmin={3}
                                placeholder="description"
                                value={newRow.description}
                                style={{height: '90px', width:'99%', border: '1px solid #ced4da', borderRadius: '4px', padding: '10px' }}
                                onChange={newhandleChange}
                            />
                            </div>

                            <Button variant="contained" onClick={addNewRow} style={{ marginTop: '8px' }}>Add Row</Button>
                            <br/>
                            <br/>
                            <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                <TableRow>
                                    <TableCell>Sl No.</TableCell>
                                    <TableCell>Header</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {rows.map((row, index) => (
                                    <TableRow key={index}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{index === editingRowIndex ? <TextField fullWidth name="name" variant="outlined" value={newRow.name} onChange={(e) => setNewRow({ ...newRow, name: e.target.value })} /> : row.name}</TableCell>
                                    <TableCell>{index === editingRowIndex ? <TextField fullWidth name="description" variant="outlined" value={newRow.description} onChange={(e) => setNewRow({ ...newRow, description: e.target.value })} /> : row.description}</TableCell>
                                    <TableCell>
                                        {index === editingRowIndex ? (
                                          <>
                                            <Button variant="contained" onClick={handleUpdateRow} color="warning" style={{ marginRight: '8px' }}>Update</Button>
                                            <Button variant="contained" onClick={setEditingRowIndex} color="error" style={{ marginRight: '8px' }}>Cancel</Button>
                                          </>
                                        ) : (
                                          <>
                                            <Button variant="contained" onClick={() => handleEditRow(index)} color="warning" style={{ marginRight: '8px' }}>Edit</Button>
                                            <Button variant="contained" onClick={() => handleDeleteRow(index)} color="error" style={{ marginRight: '8px' }}>Delete</Button>
                                          </>
                                        )}
                                    </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                            </TableContainer>
                        </Box>
                    </Grid>
                    )}


                    {activeStep === 2 && (
                      <Grid spacing={2}   sx={{ padding: 3 }} container>
                      <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '100%', verticalAlign: 'top'}} >
                          <Typography variant="h6"  sx={{ padding: 2 }}>Multiple Marketing Images</Typography>
                      </Box>
                      
                      <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={3} mb={1} style={{width: '100%', verticalAlign: 'top', padding: '0 10px'}} >
                          <div>
                        <Typography variant="p"  sx={{ padding: 2 }}>Marketing Image</Typography>
                        <input
                          component="label"
                          variant="contained"
                          startIcon={<CloudUploadIcon />}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                        />
                        
                        <TableContainer component={Paper}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Sl No.</TableCell>
                                <TableCell>Level</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Action</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {images.map((image, index) => (
                                <TableRow key={index}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>
                                  <TextField
                                    variant="outlined"
                                    fullWidth
                                    type="text"
                                    value={image?.imageLabels?.[index] || null}
                                    onChange={(e) => handleLabelChange(index, e.target.value)}
                                  />
                                   </TableCell>
                                  <TableCell>
                                    {image.old==1 ? (
                                      <Link href="#" onClick={() => handleLinkClick(image)} display="inline" ml={2}>
                                        <Image src={image} alt="Marketing Image" width={300} height={200} />
                                      </Link>
                                    ) : (
                                      <img src={URL.createObjectURL(image)} alt={`Image ${index}`} />
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Button variant="contained" size="small" color="error" onClick={() => handleRemoveImage(index)}>
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
                    )}


                    {activeStep === 3 && (
                      <Grid spacing={2}   sx={{ padding: 3 }} container>
                        <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '100%', verticalAlign: 'top'}} >
                            <Typography variant="h6"  sx={{ padding: 2 }}>FAQ</Typography>
                        </Box>
                
                        <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={3} mb={1} style={{width: '100%', verticalAlign: 'top', padding: '0 10px'}} >
                            <div style={{ marginTop: '16px' }}>  
                            <TextField fullWidth
                            name="question"
                            label="Question"
                            variant="outlined"
                            onChange={newfaqhandleChange}
                            />
                            </div>
                            <div style={{ marginTop: '16px' }}>
                            <TextareaAutosize
                                name="answer"
                                rowsmin={3}
                                placeholder="Answer"
                                style={{height: '90px', width:'99%', border: '1px solid #ced4da', borderRadius: '4px', padding: '10px' }}
                                onChange={newfaqhandleChange}
                            />
                            </div>
                
                            <Button variant="contained" onClick={addNewfaqRow} style={{ marginTop: '8px' }}>Add Row</Button>
                            <br/>
                            <br/>
                            <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                <TableRow>
                                    <TableCell>Sl No.</TableCell>
                                    <TableCell>Question</TableCell>
                                    <TableCell>Answer</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {faqs.map((row, index) => (
                                    <TableRow key={index}>
                                      <TableCell>{row.id}</TableCell>
                                      <TableCell>{index === editingFaqIndex ? <TextField fullWidth name="question" variant="outlined" value={newfaqsRow.question} onChange={(e) => setNewfaqsRow({ ...newfaqsRow, question: e.target.value })} /> : row.question}</TableCell>
                                      <TableCell>{index === editingFaqIndex ? <TextField fullWidth name="answer" variant="outlined" value={newfaqsRow.answer} onChange={(e) => setNewfaqsRow({ ...newfaqsRow, answer: e.target.value })} /> : row.answer}</TableCell>
                                      <TableCell>
                                          {index === editingFaqIndex ? (
                                            <>
                                              <Button variant="contained" onClick={handleUpdateFaq} color="warning" style={{ marginRight: '8px' }}>Update</Button>
                                              <Button variant="contained" onClick={setEditingFaqIndex} color="error" style={{ marginRight: '8px' }}>Cancel</Button>
                                            </>
                                          ) : (
                                            <>
                                              <Button variant="contained" onClick={() => handleEditFaq(index)} color="warning" style={{ marginRight: '8px' }}>Edit</Button>
                                              <Button variant="contained" onClick={() => handleDeleteFaq(index)} color="error" style={{ marginRight: '8px' }}>Delete</Button>
                                            </>
                                          )}
                                      </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                            </TableContainer>
                
                            
                        </Box>
                    </Grid>
                    )}


                    {activeStep === 4 && (
                      <Grid spacing={2}   sx={{ padding: 3 }} container>
                        <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{width: '100%', verticalAlign: 'top'}} >
                            <Typography variant="h6"  sx={{ padding: 2 }}>Videos Links</Typography>
                        </Box>
                
                        <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={3} mb={1} style={{width: '100%', verticalAlign: 'top', padding: '0 10px'}} >
                          <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                <TableRow>
                                    <TableCell>Label</TableCell>
                                    <TableCell>Link</TableCell>
                                    <TableCell>Thumbnail</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                  <TableRow>
                                      <TableCell style={{ width: '15%' }}><TextField fullWidth
                                            name="label"
                                            label="Label"
                                            variant="outlined"
                                            onChange={newVideoHandleChange}
                                          /></TableCell>
                                      <TableCell style={{ width: '40%' }}><TextField fullWidth
                                            name="link"
                                            label="Link"
                                            variant="outlined"
                                            onChange={newVideoHandleChange}
                                        /></TableCell>
                                      <TableCell style={{ width: '30%' }}><input type="file" accept="image/*" onChange={handlevideoImageChange} /></TableCell>
                                      <TableCell style={{ width: '15%' }}>
                                        {validationError && <div style={{ color: 'red', marginTop: '8px' }}>{validationError}</div>}
                                        {editingIndex !== null ? (
                                          <Button variant="contained" size="small" onClick={updateVideoRow} style={{ marginTop: '8px' }}>
                                            Update
                                          </Button>
                                        ) : (
                                          <Button variant="contained" size="small" onClick={addNewVideoRow} style={{ marginTop: '8px' }}>
                                            Add Link
                                          </Button>
                                        )}</TableCell>
                                  </TableRow>
                                </TableBody>
                                
                                
                                <TableBody>
                                {videos.map((video, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{video.label}</TableCell>
                                    <TableCell>{video.link}</TableCell>
                                    <TableCell>{video.video_image &&  URL.createObjectURL(video.video_image) && <img src={URL.createObjectURL(video.video_image)} alt={`Image ${index}`} />}
                                    </TableCell>
                                    <TableCell>
                                      {/* <Button variant="contained" color="warning" size="small" onClick={() => editVideoRow(index)} style={{ marginTop: '8px', marginRight: '2px' }} >Edit</Button> */}
                                      <Button variant="contained" color="error" size="small" onClick={() => deleteVideoRow(index)} style={{ marginTop: '8px' }} >Delete</Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                            </TableContainer>
                
                            
                        </Box>
                    </Grid>
                    )}
                    
                    
                    {activeStep === steps.length ? (
                      <>
                        <Typography>All steps completed</Typography>
                      </>
                        
                      
                    ) : (
                      <>
                        <Box display="flex" justifyContent="flex-start" mr={2}  mt={1} ml={2} mb={1} >
                          <Button variant="outlined" style={{ marginRight: '8px' }} size="medium" disabled={activeStep === 0} onClick={handleBack}>
                            Back
                          </Button>
                          {activeStep < 4 ? (
                            <Button variant="outlined" style={{ marginRight: '8px' }} size="medium" onClick={handleNext}>
                              Next
                            </Button>
                          ) : (
                            <>
                              <Button variant="contained" color="primary" style={{ marginRight: '8px' }} size="medium" onClick={handleSubmit}>
                              Submit
                              </Button>
                              <Button variant="outlined"  onClick={handleCancel} >Cancel</Button>
                            </>
                          )}
                          </Box>
                      </>
                    )}
                 </TableContainer>
            </Grid>
            <Grid item={true} xs={12}   >
             
              </Grid>
        </Grid>
              
    </main>
    )
}
export default AddLeadCategoryTransactions;