import {
  Box,
  Button,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import TableCell from "@mui/material/TableCell";
import * as React from "react";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FormControl from "@mui/material/FormControl";
import { useRouter } from "next/router";

const AddEmployeeTransactions = () => {
  const router = useRouter();
  const { id, action } = router.query;
  const currentDate = new Date();
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = React.useState(
    dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  );
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [education, setEducation] = useState("");
  const [roles, setRoles] = useState([]);

  const handleChange = (event) => {
    setRole(event.target.value);
  };
  const genderhandleChange = (event) => {
    setGender(event.target.value);
  };
  const handleCancel = async () => {
    window.history.back();
  };
  const handleDateChange = (date) => {
    setDob(date);
  };
  useEffect(() => {
    const getRoles = async () => {
      try {
        const response = await api.get("/api/employee/get-roles");
        if (response.status === 200) {
          setRoles(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    if (action == "edit") {
      const getEmployee = async () => {
        try {
          const reqData = {
            employee_id: id,
          };
          const response = await api.post(
            "/api/employee/get-employee",
            reqData
          );
          if (response.status === 200) {
            const resData = response.data.data;
            setRole(resData.role_id);
            setName(resData.first_name);
            setMobile(resData.mobile);
            setGender(resData.gender);
            setDob(dayjs(resData.dob));
            setEmail(resData.email);
            setCity(resData.city);
            setDistrict(resData.district);
            setState(resData.state);
            setAddress(resData.address);
            setPincode(resData.pincode);
            setEducation(resData.education);
          } else {
            alert(response.data.error);
          }
        } catch (error) {
          console.error("Error fetching roles:", error);

          alert(error.message);
        }
      };
      getEmployee();
    }

    getRoles();
  }, [action, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      alert("Name is required!");
      return;
    }
    if (!mobile) {
      alert("Mobile is required!");
      return;
    }
    if (!email) {
      alert("Email is required!");
      return;
    }
    if (!address) {
      alert("Address is required!");
      return;
    }
    if (!city) {
      alert("City is required!");
      return;
    }
    if (!district) {
      alert("District is required!");
      return;
    }
    if (!state) {
      alert("State is required!");
      return;
    }
    if (!gender) {
      alert("Please select Gender");
      return;
    }
    if (!role) {
      alert("Please select Role");
      return;
    }
    if (!pincode) {
      alert("Pincode is required!");
      return;
    }
    if (!education) {
      alert("Education is required!");
      return;
    }

    const formData = {
      first_name: name,
      dob: dob.toISOString().split("T")[0],
      mobile_no: mobile,
      email: email,
      address: address.replace(/'/g, "\\'"),
      city: city,
      district: district,
      state: state,
      gender: gender,
      role_id: role,
      pincode: pincode,
      education: education,
    };

    try {
      //console.log(formData);
      let response = [];

      if (action == "edit") {
        formData.employee_id = id;
        response = await api.post("/api/employee/edit-employee", formData);
      } else {
        response = await api.post("/api/employee/add-employee", formData);
      }

      if (response.status == 200) {
        window.history.back();
        alert("Employee created successfully");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <main className="p-6 space-y-6">
      <Grid container spacing={4} sx={{ padding: 2 }}>
        <Grid item xs={12}>
          <TableContainer 
            component={Paper} 
            elevation={3}
            sx={{ 
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                padding: '24px',
                backgroundColor: '#f8f9fa',
                borderBottom: '1px solid #e9ecef'
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600,
                  color: '#1a1a1a'
                }}
              >
                {action == "edit" ? "Edit Employee" : "Add New Employee"}
              </Typography>
            </Box>

            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    required
                    fullWidth
                    label="Name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '56px',
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    required
                    fullWidth
                    label="Mobile"
                    variant="outlined"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    InputProps={{
                      minLength: 10,
                      maxLength: 10,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '56px',
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      required
                      label="Date of Birth"
                      value={dob}
                      onChange={handleDateChange}
                      renderInput={(params) => (
                        <TextField 
                          {...params} 
                          fullWidth 
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              height: '56px',
                              '&:hover fieldset': {
                                borderColor: 'primary.main',
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    required
                    fullWidth
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '56px',
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl required fullWidth>
                    <InputLabel id="gender-label">Gender</InputLabel>
                    <Select
                      labelId="gender-label"
                      id="gender"
                      value={gender}
                      label="Gender"
                      onChange={genderhandleChange}
                      sx={{
                        height: '56px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          '&:hover': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    >
                      <MenuItem value="">Please Select</MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Transgender">Transgender</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl required fullWidth>
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                      labelId="role-label"
                      id="role"
                      value={role}
                      label="Role"
                      onChange={handleChange}
                      sx={{
                        height: '56px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          '&:hover': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    >
                      <MenuItem value="">Please Select</MenuItem>
                      {roles.map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                          {role.role_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    required
                    fullWidth
                    label="City"
                    variant="outlined"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '56px',
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    required
                    fullWidth
                    label="District"
                    variant="outlined"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '56px',
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    required
                    fullWidth
                    label="State"
                    variant="outlined"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '56px',
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    required
                    fullWidth
                    label="Pincode"
                    variant="outlined"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    InputProps={{
                      minLength: 7,
                      maxLength: 7,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '56px',
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={8}>
                  <TextField
                    required
                    fullWidth
                    label="Education"
                    variant="outlined"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '56px',
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Address"
                    variant="outlined"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    multiline
                    rows={3}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="large"
                      onClick={handleSubmit}
                      sx={{
                        px: 4,
                        py: 1,
                        borderRadius: '6px',
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        '&:hover': {
                          boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                        },
                      }}
                    >
                      Submit
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={handleCancel}
                      sx={{
                        ml: 2,
                        px: 4,
                        py: 1,
                        borderRadius: '6px',
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </TableContainer>
        </Grid>
      </Grid>
    </main>
  );
};
export default AddEmployeeTransactions;
