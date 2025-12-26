import { Box, Button,Divider,TextField,InputLabel,Select,MenuItem, Container, Grid, Paper, Table, TableBody, StyledTableCell, TableContainer, TableHead, TablePagination, TableRow, Typography,FormControlLabel, Checkbox, Tabs, Tab, Layout, TableCell  } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import * as React from 'react';
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



const ViewEmployeeTransactions = () => {
    const router = useRouter();
    const  queryParam  = router.query;
    const employee_id = queryParam.id;
    const [tabvalue, setTabValue] = useState(0);

    const tabhandleChange = (event, newValue) => {
        setTabValue(newValue);
    };
    
  
    const currentDate = new Date();
    const [role, setRole] = useState('');
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [state, setState] = useState('');
    const [address, setAddress] = useState('');
    const [pincode, setPincode] = useState('');
    const [education, setEducation] = useState('');


    const [menus, setMenus] = useState([]);
    const [listchecked, setListchecked] = useState(false);
    const [insertchecked, setInsertchecked] = useState(false);
    const [viewchecked, setViewchecked] = useState(false);
    const [deletechecked, setDeletechecked] = useState(false);
    const [editchecked, setEditchecked] = useState(false);
    
    const listhandleChange = (event, menuId, page_url) => {
        const isChecked = event.target.checked;
        let check_status = 0;

        setListchecked((prevState) => ({
        ...prevState,
        [menuId]: isChecked,
        }));

        if(isChecked)
        {
            check_status = 1;
        }
        updatePermission('list', menuId, check_status, page_url);
    };

    const inserthandleChange = (event, menuId, page_url) => {
        const isChecked = event.target.checked;
        let check_status = 0;

        setInsertchecked((prevState) => ({
        ...prevState,
        [menuId]: isChecked,
        }));

        if(isChecked)
        {
            check_status = 1;
        }

        updatePermission('insert', menuId, check_status, page_url);
    };

    const viewhandleChange = (event, menuId, page_url) => {
        const isChecked = event.target.checked;
        let check_status = 0;

        setViewchecked((prevState) => ({
        ...prevState,
        [menuId]: isChecked,
        }));

        if(isChecked)
        {
            check_status = 1;
        }

        updatePermission('view', menuId, check_status, page_url);
    };

    const deletehandleChange = (event, menuId, page_url) => {
        const isChecked = event.target.checked;
        let check_status = 0;
        setDeletechecked((prevState) => ({
        ...prevState,
        [menuId]: isChecked,
        }));
        
        if(isChecked)
        {
            check_status = 1;
        }

        updatePermission('delete', menuId, check_status, page_url);
    };
    

    const edithandleChange = (event, menuId, page_url) => {
        const isChecked = event.target.checked;
        let check_status = 0;

        setEditchecked((prevState) => ({
        ...prevState,
        [menuId]: isChecked,
        }));

        if(isChecked)
        {
            check_status = 1;
        }

        updatePermission('edit', menuId, check_status, page_url);
    };


    const updatePermission = async(action, menu_id, check_status, page_url) => {
        const reqData = {
            'action': action,
            menu_id: menu_id,
            employee_id: employee_id,
            check_status: check_status,
            page_url: page_url
        };
        try {
            const response = await api.post("/api/menu/set-menu-permission", reqData);
            if (response.status === 200) {
              alert('Success');
            }
        } catch (error) {
            alert(error);
            console.error("Error fetching roles:", error);
        }
    }
    
    useEffect(() => {

        const getEmployee = async () => {
          try {
            const reqData = {
                'employee_id': employee_id
            }
            const response = await api.post("/api/employee/get-employee", reqData);
            if (response.status === 200) {
                setMenus(response.data.menuData);
                setRole(response.data.data.role_name);
                setName(response.data.data.first_name);
                setMobile(response.data.data.mobile);
                setGender(response.data.data.gender);
                setDob(response.data.data.dob);
                setEmail(response.data.data.email);
                setCity(response.data.data.city);
                setDistrict(response.data.data.district);
                setState(response.data.data.state);
                setAddress(response.data.data.address);
                setPincode(response.data.data.pincode);
                setEducation(response.data.data.education);

            }
          } catch (error) {
            console.error("Error fetching employee:", error);
          }
        };

    
        getEmployee();
      }, [employee_id]);

     
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
                        <Typography variant="h5"  sx={{ padding: 2 }}>View Employee</Typography>
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <Tabs value={tabvalue} onChange={tabhandleChange} aria-label="basic tabs example">
                            <Tab label="Profile" />
                            <Tab label="Menu Permission" />
                        </Tabs>
                        {tabvalue === 0 && (
                            <Grid spacing={2}   sx={{ padding: 2 }} container>
                                <Table aria-label="employee" sx={{ size: 2 }} mt={2} >
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>:</TableCell>
                                            <TableCell>{name}</TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>Mobile</TableCell>
                                            <TableCell>:</TableCell>
                                            <TableCell>{mobile}</TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>Date of Birth</TableCell>
                                            <TableCell>:</TableCell>
                                            <TableCell>{dob}</TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>Email</TableCell>
                                            <TableCell>:</TableCell>
                                            <TableCell>{email}</TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>Gender</TableCell>
                                            <TableCell>:</TableCell>
                                            <TableCell>{gender}</TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>Role</TableCell>
                                            <TableCell>:</TableCell>
                                            <TableCell>{role}</TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>City</TableCell>
                                            <TableCell>:</TableCell>
                                            <TableCell>{city}</TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>District</TableCell>
                                            <TableCell>:</TableCell>
                                            <TableCell>{district}</TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>State</TableCell>
                                            <TableCell>:</TableCell>
                                            <TableCell>{state}</TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>Pincode</TableCell>
                                            <TableCell>:</TableCell>
                                            <TableCell>{pincode}</TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>Education</TableCell>
                                            <TableCell>:</TableCell>
                                            <TableCell>{education}</TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>Address</TableCell>
                                            <TableCell>:</TableCell>
                                            <TableCell>{address}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>                      
                            </Grid>
                        )}
                        {tabvalue === 1 && (
                            <Grid spacing={2}   sx={{ padding: 2 }} container>
                                <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={3} mb={1} style={{width: '100%', verticalAlign: 'top', padding: '0 10px'}} >
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Sl No.</TableCell>
                                                <TableCell>Menu Name</TableCell>
                                                <TableCell>Parent Menu</TableCell>
                                                <TableCell>List</TableCell>
                                                <TableCell>Create</TableCell>
                                                <TableCell>View</TableCell>
                                                <TableCell>Edit</TableCell>
                                                <TableCell>Delete</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {menus.map((menu, index) => (
                                            <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{menu.menu_name}</TableCell>
                                            <TableCell>{menu.parent_menu}</TableCell>
                                            <TableCell>
                                                <FormControlLabel
                                                control={<Checkbox checked={menu.list ? menu.list: listchecked[menu.id]} onChange={(event) => listhandleChange(event, menu.id, menu.menu_url)} />}
                                                />
                                                
                                            </TableCell>
                                            <TableCell>
                                                <FormControlLabel
                                                control={<Checkbox checked={menu.insert ? menu.insert: insertchecked[menu.id]} onChange={(event) => inserthandleChange(event, menu.id, menu.menu_url)} />}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FormControlLabel
                                                control={<Checkbox checked={menu.view ? menu.view: viewchecked[menu.id]} onChange={(event) => viewhandleChange(event, menu.id, menu.menu_url)} />}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FormControlLabel
                                                control={<Checkbox checked={menu.edit ? menu.edit: editchecked[menu.id]} onChange={(event) => edithandleChange(event, menu.id, menu.menu_url)} />}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FormControlLabel
                                                control={<Checkbox checked={menu.delete ? menu.delete: deletechecked[menu.id]} onChange={(event) => deletehandleChange(event, menu.id, menu.menu_url)} />}
                                                />
                                            </TableCell>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                </Box>
                            </Grid>
                        )}
                    </Box>
       
                 </TableContainer>
            </Grid>
            
        </Grid>
              
        
        </main>
    
    )
    
}


export default ViewEmployeeTransactions;

