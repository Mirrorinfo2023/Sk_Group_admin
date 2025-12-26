import { Box, Typography, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import Image from "next/image";
import UserName from "./UserName";
import ForgotPassword from "./forgot-password";
import AppLogo from "../../../public/Mayway_logo.jpeg";
import manWithLap from "../../../public/man_with_lap1.png";
import styles from "./Login.module.css"; // Import styles

const LoginPage = () => {
    const [screenHeight, setScreenHeight] = useState(0);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    useEffect(() => {
        const updateScreenHeight = () => setScreenHeight(window.innerHeight);
        window.addEventListener("resize", updateScreenHeight);
        updateScreenHeight();
        return () => window.removeEventListener("resize", updateScreenHeight);
    }, []);

    return (
        <Box className={styles.root}>
            {/* Background quadrants */}
            <Box className={styles.topLeft} />
            <Box className={styles.topRight} />
            <Box className={styles.bottomLeft} />
            <Box className={styles.bottomRight} />

            <Grid container sx={{ height: "100%", position: "relative", zIndex: 1 }}>
                {/* Left Panel */}


                <Grid item xs={12} md={6} className={styles.leftPanel}>
                    {/* Top row: logo left 50%, empty right 50% with background */}
                    <Box className={styles.leftPanelTopRow}>
                        <Box className={styles.leftPanelLogoWrapper}>
                            <Image
                                src={AppLogo}
                                alt="Logo"
                                width={180}
                                className={styles.logoImage}
                            />
                        </Box>
                        <Box className={styles.leftPanelEmptyRight} />
                    </Box>

                    {/* Man image row */}
                    <Box className={styles.personContainer}>
                        <Image
                            src={manWithLap}
                            alt="Person"
                        />
                    </Box>
                </Grid>


                {/* Right Panel */}
                <Grid item xs={12} md={6} className={styles.rightPanel}>
                    <Box className={styles.formContainer}>

                        {/* Heading */}
                        <Typography variant="h5" className={styles.heading}>
                            {showForgotPassword ? (
                                <>
                                    <span style={{ color: "#2198F3" }}>Forgot</span>{" "}
                                    <span style={{ color: "#ED6A24" }}>Password</span>
                                </>
                            ) : (
                                <>
                                    <span style={{ color: "#2198F3" }}>Welcome</span>{" "}
                                    <span style={{ color: "#ED6A24" }}>Back...</span>
                                </>
                            )}
                        </Typography>

                        {/* Sub Text */}
                        {showForgotPassword ? (
                            <Typography variant="body2" className={styles.subText1}>
                                Remembered the password?{" "}
                                <span
                                    style={{
                                        color: "#2198F3",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                        textDecoration: "underline"  
                                    }}
                                    onClick={() => setShowForgotPassword(false)}
                                >
                                    Sign In
                                </span>

                            </Typography>
                        ) : (
                            <Typography variant="body2" className={styles.subText}>
                                Please enter your username and password
                            </Typography>
                        )}

                        {/* Form */}
                        {showForgotPassword ? (
                            <ForgotPassword onBack={() => setShowForgotPassword(false)} />
                        ) : (
                            <UserName onForgotPassword={() => setShowForgotPassword(true)} />
                        )}

                    </Box>
                </Grid>
            </Grid>

            {/* Bottom strip */}
            <Box className={styles.bottomStrip} />
        </Box >
    );
};

export default LoginPage;
