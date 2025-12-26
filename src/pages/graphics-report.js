"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import GraphicsTransactions from "@/components/Graphics/Graphics_list";
import {
  Grid,
  Button,
  Paper,
  styled,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";

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
const FilterRow = styled(Box)(({ theme }) => ({
  background: "#f5faff",
  borderRadius: 12,
  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.06)",
  padding: "16px",
  display: "flex",
  alignItems: "center",
  gap: 20,
  marginBottom: 10,
  flexWrap: "nowrap",
  justifyContent: "space-between",
}));
function GraphicsReport(props) {
  const [showServiceTrans, setShowServiceTrans] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  let rows;

  if (showServiceTrans && showServiceTrans.length > 0) {
    rows = [...showServiceTrans];
  } else {
    rows = [];
  }
  const handleSearch = (text) => {
    setSearchTerm(text);
  };
  const dispatch = useDispatch();

  const currentDate = new Date();
  const [fromDate, setFromDate] = React.useState(
    dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  );
  const [toDate, setToDate] = React.useState(dayjs(getDate.date));

  useEffect(() => {
    const getTnx = async () => {
      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };

      try {
        const response = await api.post(
          "/api/graphics/get-graphics-report",
          reqData
        );

        if (response.status === 200) {
          setShowServiceTrans(response.data.data);
        }
      } catch (error) {
        if (error?.response?.data?.error) {
          dispatch(
            callAlert({ message: error.response.data.error, type: "FAILED" })
          );
        } else {
          dispatch(callAlert({ message: error.message, type: "FAILED" }));
        }
      }
    };

    if (fromDate || toDate) {
      getTnx();
    }
  }, [fromDate, toDate, dispatch]);

  const handleFromDateChange = (date) => {
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
  };

  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  let filteredRows;
  if (selectedValue != "") {
    filteredRows = rows.filter((row) => {
      return (
        row.sub_type &&
        row.sub_type.toLowerCase().includes(selectedValue.toLowerCase())
      );
    });
  } else {
    filteredRows = rows.filter((row) => {
      return (
        (row.cat_group &&
          row.cat_group.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.graphics_name && row.graphics_name.includes(searchTerm)) ||
        (row.category_name && row.category_name.includes(searchTerm))
      );
    });
  }

  return (
    <Layout>
      <Grid container spacing={4} sx={{ padding: 2 }}>
        <Grid item={true} xs={12}>
          <FilterRow component={Paper}>
            {/* First Row */}
           
              <Typography variant="h5" whiteSpace={"nowrap"}>
                Marketing
              </Typography>
           

            {/* Second Row */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
              <Box sx={{ width: "20%" }}>
                <TextField
                  id="standard-basic"
                  placeholder="Search"
                  variant="standard"
                  fullWidth
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon />,
                  }}
                />
              </Box>
            
              <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <DatePicker
                      label="From Date"
                      value={fromDate}
                      sx={{
                        minWidth: 140,
                        maxWidth: 170,
                        fontSize:"13px",
                      }}
                      format="DD-MM-YYYY"
                      onChange={handleFromDateChange}
                    />
                    <DatePicker
                      label="To Date"
                      value={toDate}
                      sx={{
                        minWidth: 140,
                        maxWidth: 170,
                        fontSize:"13px",
                      }}
                      format="DD-MM-YYYY"
                      onChange={handleToDateChange}
                    />
                  </div>
                </LocalizationProvider>
              </Box>
            
                <Button
                  variant="contained"
                  style={{
                    background: 'linear-gradient(90deg, #2196F3 0%, #21CBF3 100%)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontWeight: 'bold',
                    boxShadow: 'none',
                    textTransform: 'none',
                    fontSize: '1rem',
                    padding: '8px 16px'
                  }}
                  href={`/add-new-graphics/`}
                >
                  Add New Graphics
                </Button>
                <Button
                  variant="contained"
                  href={`/graphics-category-list/`}
                  style={{
                    background: 'linear-gradient(90deg, #2196F3 0%, #21CBF3 100%)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontWeight: 'bold',
                    boxShadow: 'none',
                    textTransform: 'none',
                    fontSize: '1rem',
                    padding: '8px 16px'
                  }}
                >
                  Category List
                </Button>
              
            </Box>
          </FilterRow>
        </Grid>
      </Grid>
      <GraphicsTransactions showServiceTrans={filteredRows} />
    </Layout>
  );
}
export default withAuth(GraphicsReport);
