"use client";

import {
  Box,
  Button,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  TableContainer,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Chip,
  IconButton,
} from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import { DataDecrypt, DataEncrypt } from "../../../utils/encryption";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import CategoryIcon from "@mui/icons-material/Category";
import AppsIcon from "@mui/icons-material/Apps";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

// Styled components for enhanced UI
const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  border: 0,
  borderRadius: 8,
  color: 'white',
  height: 48,
  padding: '0 30px',
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  '&:hover': {
    boxShadow: '0 4px 8px 2px rgba(33, 203, 243, .4)',
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    padding: theme.spacing(1),
    background: 'linear-gradient(145deg, #f5f7fa 0%, #ffffff 100%)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  },
}));

const DialogHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: '16px 16px 0 0',
}));

const ActionButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1, 3),
  ...(variant === 'outlined' && {
    border: `2px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    '&:hover': {
      border: `2px solid ${theme.palette.primary.dark}`,
      backgroundColor: 'rgba(25, 118, 210, 0.04)',
    },
  }),
  ...(variant === 'contained' && {
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
    color: 'white',
    boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
    '&:hover': {
      boxShadow: '0 4px 8px 2px rgba(33, 150, 243, .4)',
    },
  }),
}));

const AddBannersTransactions = () => {
  const [title, setTitle] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [appCategories, setAppCategories] = useState([]);
  const [appType, setAppType] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  // Popup states
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [openAppModal, setOpenAppModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newAppName, setNewAppName] = useState("");

  // Fetch categories and app types
  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await api.get("/api/banner/66a815be731fee133d7ecc8f240447c14e770b83");

        if (response.status === 200 && response.data?.data) {
          const decrypted = DataDecrypt(response.data.data);
          const parsed = decrypted;

          if (parsed.status === 200) {
            setCategories(parsed.data.bannersCategory || []);
            setAppCategories(parsed.data.notificationApp || []);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    getCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Please enter category name");
      return;
    }

    try {
      const body = {
        data: DataEncrypt(JSON.stringify({
          category_name: newCategoryName.trim()
        }))
      };

      const response = await api.post("/api/banner/66a815be731fee133d7ecc8f240447c14e77083e", body);

      // console.log("response ", response)
      // Decrypt response
      const decrypted = DataDecrypt(response.data.data);

      if (decrypted.status === 200) {
        alert("Category Added Successfully");

        setCategories(prev => [
          ...prev,
          { id: Date.now(), category_name: newCategoryName }
        ]);

        setOpenCategoryModal(false);
        setNewCategoryName("");
      } else {
        alert(decrypted.message);
      }

    } catch (error) {
      alert("Error adding category");
    }
  };

  const handleAddAppType = async () => {
    if (!newAppName.trim()) {
      alert("Please enter App Type name");
      return;
    }

    try {
      const body = {
        data: DataEncrypt(JSON.stringify({
          app_name: newAppName
        }))
      };

      const response = await api.post("/api/banner/66a815be731fee133d7ecc8f240447c14e77000", body);
      // console.log("response ", response)
      const decrypted = DataDecrypt(response.data.data);

      if (decrypted.status === 200) {
        alert("App Type Added Successfully");

        setAppCategories(prev => [
          ...prev,
          { id: Date.now(), app_name: newAppName }
        ]);

        setOpenAppModal(false);
        setNewAppName("");
      } else {
        alert(decrypted.message);
      }

    } catch (error) {
      alert("Error adding app type");
    }
  };

  // SUBMIT BANNER
  const handleSubmit = async () => {
    if (!title || !transactionType || !appType || !selectedFile) {
      alert("Please fill all fields and select an image.");
      return;
    }

    if (!captchaVerified) {
      alert("Please verify CAPTCHA.");
      return;
    }

    // 🔐 Encrypt the text payload
    const encryptedPayload = DataEncrypt(
      JSON.stringify({
        title,
        categoryId: transactionType,
        app_id: appType,
      })
    );

    const formData = new FormData();
    formData.append("img", selectedFile);   // FILE
    formData.append("data", encryptedPayload); // 🔐 Encrypted text

    try {
      setLoading(true);

      const response = await api.post("/api/banner/848c9e6b17fd0bab24254d057a09a88e8db32bcc", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      //console.log("response ", response)
      // 🔓 Decrypt API Response
      const decryptedResponse = (DataDecrypt(response.data.data));

      //console.log("decryptedResponse ", decryptedResponse)
      if (decryptedResponse.status === 200) {
        alert("Banner uploaded successfully");
        window.history.back();
      }
    } catch (error) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="p-6 space-y-6">
      <Grid container spacing={4} sx={{ padding: 2 }}>
        <Grid item xs={12}>
          <TableContainer
            component={Paper}
            elevation={3}
            sx={{ borderRadius: "16px", overflow: 'hidden' }}
          >
            {/* HEADER WITH BUTTONS */}
            <Box
              sx={{
                padding: "24px",
                backgroundColor: "transparent",
                borderBottom: "1px solid #e9ecef",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "black",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 600, color: "black" }}>
                Add New Banner
              </Typography>

              <Box sx={{ display: "flex", gap: 2 }}>
                <ActionButton
                  variant="outlined"
                  onClick={() => setOpenCategoryModal(true)}
                  startIcon={<CategoryIcon />}
                  sx={{ color: "black", borderColor: "black" }}
                >
                  Add Category
                </ActionButton>

                <ActionButton
                  variant="outlined"
                  onClick={() => setOpenAppModal(true)}
                  startIcon={<AppsIcon />}
                  sx={{ color: "black", borderColor: "black" }}
                >
                  Add App Type
                </ActionButton>
              </Box>
            </Box>


            {/* BODY */}
            <Box sx={{ p: 4 }}>
              <Grid container spacing={3}>
                {/* FORM FIELDS */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>App Type</InputLabel>
                    <Select
                      value={appType}
                      label="App Type"
                      onChange={(e) => setAppType(e.target.value)}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="">Select</MenuItem>
                      {appCategories.map((app) => (
                        <MenuItem value={app.id} key={app.id}>
                          {app.app_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Banner Category</InputLabel>
                    <Select
                      value={transactionType}
                      label="Banner Category"
                      onChange={(e) => setTransactionType(e.target.value)}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="">Select</MenuItem>
                      {categories.map((cat) => (
                        <MenuItem value={cat.id} key={cat.id}>
                          {cat.category_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* CAPTCHA */}
                <Grid item xs={12} md={6}>
                  <ReCAPTCHA
                    sitekey="6LdHTbwrAAAAAGawIo2escUPr198m8cP3o_ZzZK1"
                    onChange={() => setCaptchaVerified(true)}
                  />
                </Grid>

                {/* FILE UPLOAD */}
                <Grid item xs={12}>
                  <ActionButton
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload Image
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                  </ActionButton>

                  {selectedFile && (
                    <Chip
                      label={selectedFile.name}
                      onDelete={() => setSelectedFile(null)}
                      color="primary"
                      variant="outlined"
                      sx={{ ml: 2 }}
                    />
                  )}
                </Grid>

                {/* SUBMIT */}
                <Grid item xs={12}>
                  <GradientButton
                    onClick={handleSubmit}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                  >
                    {loading ? "Submitting..." : "Submit Banner"}
                  </GradientButton>
                </Grid>
              </Grid>
            </Box>
          </TableContainer>
        </Grid>
      </Grid>

      {/* ENHANCED POPUP 1: Add Category */}
      <StyledDialog
        open={openCategoryModal}
        onClose={() => setOpenCategoryModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CategoryIcon />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Add New Category
            </Typography>
          </Box>
          <IconButton
            onClick={() => setOpenCategoryModal(false)}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogHeader>

        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Create a new banner category to organize your banners effectively.
          </Typography>
          <TextField
            fullWidth
            label="Category Name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
            placeholder="Enter category name..."
            autoFocus
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <ActionButton
            onClick={() => setOpenCategoryModal(false)}
            variant="outlined"
          >
            Cancel
          </ActionButton>
          <ActionButton
            onClick={handleAddCategory}
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add Category
          </ActionButton>
        </DialogActions>
      </StyledDialog>

      {/* ENHANCED POPUP 2: Add App Type */}
      <StyledDialog
        open={openAppModal}
        onClose={() => setOpenAppModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AppsIcon />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Add New App Type
            </Typography>
          </Box>
          <IconButton
            onClick={() => setOpenAppModal(false)}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogHeader>

        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Add a new application type for better banner categorization.
          </Typography>
          <TextField
            fullWidth
            label="App Type Name"
            value={newAppName}
            onChange={(e) => setNewAppName(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
            placeholder="Enter app type name..."
            autoFocus
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <ActionButton
            onClick={() => setOpenAppModal(false)}
            variant="outlined"
          >
            Cancel
          </ActionButton>
          <ActionButton
            onClick={handleAddAppType}
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add App Type
          </ActionButton>
        </DialogActions>
      </StyledDialog>
    </main>
  );
};

export default AddBannersTransactions;