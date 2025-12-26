// import { Box, Container, Divider, Typography, Paper, Tab, Grid, useMediaQuery, TextField, Button } from "@mui/material";
import { Grid, TextField, FormControlLabel, Checkbox, Box, Button, FormHelperText, Snackbar, Alert, Typography, InputAdornment, IconButton, FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import UserName from "./UserName";
import Link from "next/link";
import style from "./Login.module.css";
import classNames from "classnames";
import { Login, RadioButtonChecked, RadioButtonUnchecked } from "@mui/icons-material";
import Image from "next/image";
import { Carousel } from 'react-responsive-carousel';
import styles from "./Login.module.css";
import { ArrowForward, Person, Lock } from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";

const ForgotPassword = ({ onBack }) => {
    const [userName, setUserName] = useState(""); 
    const [value, setValue] = useState('1');
    const [valueMaster, setValueMaster] = useState('1');

    const handleChange = (event, newValue) => {

        setValue(newValue);

    };

    const handleChangeMaster = (event, newValue) => {

        setValueMaster(newValue);

    };
    // 👇 Define handleSubmit here
    const handleSubmit = () => {
        if (!userName.trim()) {
            alert("Please enter your username");
            return;
        }

        // TODO: add your reset password logic here
        console.log("Reset password for:", userName);

        // maybe go back to login screen
        if (onBack) onBack();
    };
    const isXsScreen = useMediaQuery('(max-width:600px)');

    return (
        <Grid container spacing={2} className={styles.container}>


            <Grid item xs={12}>
                <Typography className={styles.label}>Username</Typography>
                <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter username"
                    InputProps={{
                        className: styles.textFieldRoot,
                        startAdornment: (
                            <InputAdornment position="start">
                                <Person className={styles.inputIcon} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
            <Grid item xs={12}>

                <Button
                    variant="contained"
                    size="large"
                    endIcon={
                        <Box className={styles.arrowIconWrapper}>
                            <ArrowForward className={styles.arrowIcon} />
                        </Box>
                    }
                    className={styles.loginButton}
                    onClick={handleSubmit}
                >
                    Send
                </Button>

            </Grid>
        </Grid>
    );
}
export default ForgotPassword;