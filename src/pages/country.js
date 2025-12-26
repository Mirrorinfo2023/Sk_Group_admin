"use client";
import { useEffect, useState } from 'react';
import Layout from "@/components/Dashboard/layout";
import api from "../../utils/api";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const CountriesPage = () => {
  const [countries, setCountries] = useState([]);
  
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await api.get("/api/countries/get-countries");
        setCountries(response.data.data);
        console.dir(response.data)
      } catch (error) {
        setError('Failed to fetch countries', error);
        console.log(error);
      } 
    };

    fetchCountries();
  }, []);

  useEffect(()=>{
    console.dir(countries);
  },[countries])


  return (
    <Layout>
    <Container style={{marginTop: '180px', marginBottom:'50px'}}>
    
     
        <Typography variant="h6" gutterBottom style={{textAlign:"center"}}>Country List</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow style={{backgroundColor:"gainsboro"}}>
                    <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Flag</TableCell>
                        <TableCell>Capital</TableCell>
                        <TableCell>Timezones</TableCell>
                       
                    </TableRow>
                </TableHead>
                <TableBody>
                    {countries.map((country) => (
                        <TableRow key={country.id}>
                             <TableCell>{country.id}</TableCell>
                            <TableCell>{country.name}</TableCell>
                            <TableCell>{country.flag}</TableCell>
                            
                            <TableCell>{country.capital}</TableCell>
                            <TableCell>{country.timezones}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Container>
    </Layout>
);
};


export default CountriesPage;
