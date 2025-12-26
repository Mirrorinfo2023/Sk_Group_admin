"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import { DataEncrypt, DataDecrypt } from "../../utils/encryption";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/Settings/whatsappSetting";
import { Grid, Paper, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { styled } from '@mui/material/styles';
import { Typography, Box } from "@mui/material";

const FilterRow = styled(Box)(({ theme }) => ({
  background: '#f5faff',
  borderRadius: 12,
  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.06)',
  padding: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: 20,
  marginBottom: 10,
  flexWrap: 'nowrap',
}));

function TransactionHistory(props) {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const dispatch = useDispatch();
  const uid = Cookies.get("uid");

  useEffect(() => {
    const getTnx = async () => {
      try {
        // 1️⃣ Encrypt request
        const reqPayload = {
          whatsapp_id: 0,
          instance_id: "",
          access_token: ""
        };

        const reqData = {
          data: DataEncrypt(JSON.stringify(reqPayload))
        };

        // 2️⃣ Call API
        const response = await api.post("/api/setting/7a31d17452d0bf82cb568e314db67e48feb5338f", reqData);
        //console.log(response ",response)
        if (response.status === 200) {
          // 3️⃣ Decrypt backend response
          const decryptedString = DataDecrypt(response.data.data);
          //console.log(decryptedString ",decryptedString)
          const decryptedData = decryptedString;

          setShowServiceTrans(decryptedData || []);
        }
      } catch (error) {
        if (error?.response?.data?.error) {
          dispatch(callAlert({ message: error.response.data.error, type: "FAILED" }));
        } else {
          dispatch(callAlert({ message: error.message, type: "FAILED" }));
        }
      }
    };

    if (uid) getTnx();
  }, [uid, dispatch]);

  // 🟢 APPLY FILTERS & SEARCH
  const filteredData = useMemo(() => {
    return showServiceTrans
      .filter((item) => {
        // search by instance_id or access_token
        const matchSearch =
          item.instance_id?.toLowerCase().includes(searchText.toLowerCase()) ||
          item.access_token?.toLowerCase().includes(searchText.toLowerCase());

        const matchStatus = statusFilter === "all" || item.status === statusFilter;
        return matchSearch && matchStatus;
      });
  }, [showServiceTrans, searchText, statusFilter]);

  return (
    <Layout>
      <Grid container spacing={4} sx={{ padding: 2 }}>
        <Grid item xs={12}>
          <FilterRow component={Paper}>
            <Typography variant="h5" sx={{ width: "30%" }}>Whatsapp Setting</Typography>

            {/* 🔍 SEARCH BOX */}
            <TextField
              label="Search..."
              variant="outlined"
              size="small"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              sx={{ width: "30%" }}
            />


          </FilterRow>
        </Grid>
      </Grid>

      {/* Pass filtered data to component */}
      <Transactions showServiceTrans={filteredData} />
    </Layout>
  );
}

export default withAuth(TransactionHistory);
