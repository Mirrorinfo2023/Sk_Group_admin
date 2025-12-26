"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import {
  Grid,
  Paper,
  TableContainer,
  Typography,
  Box,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import { useRouter } from "next/router";
import { DataEncrypt, DataDecrypt } from "../../utils/encryption";
import ReCAPTCHA from "react-google-recaptcha";

function TransactionHistory() {
  const [showServiceTrans, setShowServiceTrans] = useState({});
  const [instance_id, setInstanceId] = useState("");
  const [access_token, setAccessToken] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);

  const dispatch = useDispatch();
  const router = useRouter();
  const { whatsapp_id } = router.query;

  let rows = showServiceTrans && showServiceTrans.length > 0 ? [...showServiceTrans] : [];

  useEffect(() => {
    const getTnx = async () => {
      try {
        // 🧩 Encrypt request payload
        const encryptedReq = DataEncrypt(JSON.stringify({ whatsapp_id }));
        const reqData = { data: encryptedReq };

        const response = await api.post("/api/setting/get-whatsapp-details", reqData);

        if (response.status === 200) {
          // 🧩 Decrypt response
          const decryptedData = DataDecrypt(response.data.data);
          const parsedData = decryptedData;

          // 🧩 Use decrypted data
          setInstanceId(parsedData.instance_id);
          setAccessToken(parsedData.access_token);
        }
      } catch (error) {
        if (error?.response?.data?.error) {
          dispatch(callAlert({ message: error.response.data.error, type: "FAILED" }));
        } else {
          dispatch(callAlert({ message: error.message, type: "FAILED" }));
        }
      }
    };

    if (whatsapp_id) {
      getTnx();
    }
  }, [whatsapp_id, dispatch]);

  const handleSubmit = async () => {
    if (!captchaValue) {
      alert("⚠️ Please verify the CAPTCHA before updating.");
      return;
    }

    try {
      // 🧩 Step 1: Encrypt the request payload
      const encryptedReq = DataEncrypt(
        JSON.stringify({
          access_token: access_token,
          instance_id: instance_id,
          whatsapp_id: whatsapp_id,
        })
      );

      const reqData = { data: encryptedReq };

      // 🧩 Step 2: Send encrypted request to backend
      const response = await api.post("/api/setting/7a31d17452d0bf82cb568e314db67e48feb5338f", reqData);

      // 🧩 Step 3: Decrypt backend response (if needed)
      if (response.status === 200) {
        const decryptedResponse = DataDecrypt(response.data.data || "");
        const parsedData = decryptedResponse;
        console.log("parsedData ", parsedData);

        alert("✅ Updated successfully");
        setCaptchaValue(null);
        window.history.back();
      }
    } catch (error) {
      console.error("❌ Error updating:", error);
      alert("Something went wrong while updating");
    }
  };

  return (
    <Layout>
      <Grid container spacing={4} sx={{ padding: 2 }}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Box
              display={"inline-block"}
              justifyContent={"space-between"}
              alignItems={"right"}
              mt={1}
              mb={1}
              style={{ width: "40%", verticalAlign: "top" }}
            >
              <Typography variant="h5" sx={{ padding: 2 }}>
                Whatsapp Setting [Update]
              </Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Instance ID */}
            <Box
              justifyContent={"space-between"}
              alignItems={"right"}
              mt={1}
              mb={1}
              style={{ width: "50%", verticalAlign: "top", padding: "0 10px" }}
            >
              <TextField
                required
                fullWidth
                label="Instance Id"
                variant="outlined"
                value={instance_id}
                onChange={(e) => setInstanceId(e.target.value)}
              />
            </Box>

            {/* Access Token */}
            <Box
              justifyContent={"space-between"}
              alignItems={"right"}
              mt={1}
              mb={1}
              style={{ width: "50%", verticalAlign: "top", padding: "0 10px" }}
            >
              <TextField
                required
                fullWidth
                label="Access Token"
                variant="outlined"
                value={access_token}
                onChange={(e) => setAccessToken(e.target.value)}
              />
            </Box>

            {/* ✅ Google reCAPTCHA */}
            <Box display="flex" justifyContent="flex-start" ml={2}  sx={{ mt: 3 }}>
              <ReCAPTCHA
                sitekey="6LdHTbwrAAAAAGawIo2escUPr198m8cP3o_ZzZK1"
                onChange={(value) => setCaptchaValue(value)}
              />
            </Box>

            {/* Submit Button */}
            <Grid item>
              <Box display="flex" justifyContent="flex-start" ml={2} mt={3} mb={2}>
                <Button
                  variant="contained"
                  color="success"
                  size="medium"
                  onClick={handleSubmit}
                  disabled={!captchaValue}
                >
                  Update
                </Button>
              </Box>
            </Grid>

            <br />
          </TableContainer>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default withAuth(TransactionHistory);
