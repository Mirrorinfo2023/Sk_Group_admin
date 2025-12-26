import { Box, Button, Divider, TextField, InputLabel, Select, MenuItem, Container, Grid, Paper, Table, TableBody, StyledTableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import Cookies from "js-cookie";
import { ArrowBack } from "@mui/icons-material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import dayjs from 'dayjs';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FormControl from '@mui/material/FormControl';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { format } from 'date-fns';
import { DataEncrypt, DataDecrypt } from "../../../utils/encryption"; // adjust path as needed



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



const AddMeetingTransactions = () => {


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
  const [meeting_link, setMeetingLink] = useState('');

  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');
  // const [meeting_datetime, setMeetingDatetime] = useState('');
  const [meetingDate, setmeetingDate] = React.useState(dayjs(getDate.date));
  const [meetingTime, setMeetingTime] = React.useState(dayjs(getDate.date));

  const handleFromDateChange = (date) => {
    setmeetingDate(date);
  };

  const handleSetTime = (time) => {

    setMeetingTime(time);
  };


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    const date = new Date(meetingTime);
    const options = { hour12: true, hour: '2-digit', minute: '2-digit' };
    const formattedTime = date.toLocaleTimeString('en-US', options);

    // Prepare plain object
    const formObject = {
      meeting_name: title,
      meeting_link: meeting_link,
      description: description,
      meeting_date: meetingDate,
      meeting_time: formattedTime,
    };

    // Encrypt the data
    const encryptedData = DataEncrypt(JSON.stringify(formObject));

    // FormData to support file upload
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('data', encryptedData);

    try {
      const response = await api.post('/api/meeting/add-meeting', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.status === 201) {
        // Decrypt response if backend returns encrypted message
        const decryptedResponse = DataDecrypt(response.data.message);

        alert(decryptedResponse.message);
        window.history.back();
      }
    } catch (error) {
      console.error('Error uploading meeting:', error);
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

            <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{ width: '30%', verticalAlign: 'top' }} >
              <Typography variant="h5" sx={{ padding: 2 }}>Add New Meeting</Typography>
            </Box>


            <Grid spacing={2} sx={{ padding: 2 }} container>

              <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{ width: '50%', verticalAlign: 'top', padding: '0 10px' }} >

                <TextField required fullWidth label="Meeting Name" variant="outlined" display={'inline-block'}
                  value={title} onChange={(e) => setTitle(e.target.value)} />
              </Box>



              <Box justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{ width: '50%', verticalAlign: 'top', padding: '0 10px' }} >

                <TextField required fullWidth label="Meeting Link" variant="outlined" display={'inline-block'}
                  value={meeting_link} onChange={(e) => setMeetingLink(e.target.value)} />
              </Box>






              <Box justifyContent={'space-between'} alignItems={'right'} ml={1} mt={2} mb={2} style={{ width: '80%', verticalAlign: 'top' }} >
                <LocalizationProvider dateAdapter={AdapterDayjs}>

                  <DatePicker
                    label="Meeting Date"
                    value={meetingDate}
                    sx={{ padding: 1, lineHeight: 20, width: 356 }}
                    format="DD-MM-YYYY"
                    onChange={handleFromDateChange}
                  />



                  <TimePicker
                    label="Meeting Time"
                    value={meetingTime}
                    sx={{ padding: 1, lineHeight: 20, width: 356 }}
                    onChange={handleSetTime}

                  />

                </LocalizationProvider>

              </Box>

              <Box justifyContent={'space-between'} alignItems={'right'} mt={3} ml={2} mb={0} style={{ width: '50%', verticalAlign: 'top' }} >

                <TextareaAutosize fullWidth
                  label="Description"
                  minRows={3}
                  size="normal"
                  variant="outlined"
                  placeholder="Description"
                  style={{ height: '90px', width: '968px', border: '1px solid #ced4da', borderRadius: '4px', padding: '10px' }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Box>
              <Box justifyContent="space-between" alignItems="center" mt={1} ml={2} mb={1} sx={{ width: '50%', verticalAlign: 'top' }}>
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
              <Box display="flex" justifyContent="flex-start" mr={2} mt={1} ml={2} mb={1} >
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
export default AddMeetingTransactions;