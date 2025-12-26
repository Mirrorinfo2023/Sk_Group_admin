import { Login, Style } from "@mui/icons-material";
import { Box, Container, Paper, Typography } from "@mui/material";
import Image from "next/image";
import style from "./Header.module.css";

const Redirect = ({secondService}) => {
    return (
        <Container maxWidth="xs">
            <Box component={Paper} p={2} mt={10} position={'relative'} >

                <Box className={style.loaderRedirect}></Box>

                <Typography variant="body2" mb={5} mt={4} textAlign={'center'} >Please wait while we are login into {secondService.service_name}</Typography>

                <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                  

                    <Box height={70} width={70}  display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <Login />
                    </Box>

                    <Box height={70} width={70} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <Image src={process.env.NEXT_PUBLIC_API_BASE_URL+"/uploads/"+secondService.logo} height={70} width={70} layout="responsive" alt="" />
                    </Box>
                </Box> 
            </Box>
        </Container>
    )
}
export default Redirect;