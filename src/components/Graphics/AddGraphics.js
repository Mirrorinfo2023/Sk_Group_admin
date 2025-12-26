import {
  Box,
  Button,
  Divider,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  StyledTableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { DataDecrypt } from "../../../utils/encryption";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FormControl from "@mui/material/FormControl";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const AddGraphicsTransactions = () => {
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 10,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 10,
  });

  const [title, setTitle] = useState("");
  const [cat_group, setCatGroup] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await api.get("/api/graphics/get-graphics-category");
        if (response.status === 200) {
          const decryptedObject = DataDecrypt(response.data);
          setCategories(decryptedObject.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getCategories();
  }, []);

  const handleChange = (event) => {
    setTransactionType(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    const allowedCharacters = /^[a-zA-Z\s]*$/;

    try {
      if (!allowedCharacters.test(cat_group)) {
        // if(cat_group.trim().length ===0 ){
        alert("Please Enter proper category Group...");
      } else {
        const formData = {
          image: selectedFile,
          graphics_name: title,
          category_id: transactionType,
          cat_group: cat_group,
        };
        const response = await api.post(
          "/api/graphics/add-graphics",
          formData,
          {
            headers: { "content-type": "multipart/form-data" },
          }
        );

        if (response) {
          window.history.back();

          alert("Graphics Added successfully");
        } else {
          console.error("Failed to upload graphics");
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <main className="p-6 space-y-6">
      <Grid container spacing={4} sx={{ padding: 2 }}>
        <Grid item={true} xs={12}>
          <TableContainer component={Paper}>
            <Box
              display={"inline-block"}
              justifyContent={"space-between"}
              alignItems={"right"}
              mt={1}
              mb={1}
              style={{ width: "30%", verticalAlign: "top" }}
            >
              <Typography variant="h5" sx={{ padding: 2 }}>
                Add New Graphics
              </Typography>
            </Box>

            <Grid spacing={2} sx={{ padding: 2 }} container>
              <Box
                justifyContent={"space-between"}
                alignItems={"right"}
                mt={1}
                mb={1}
                style={{
                  width: "50%",
                  verticalAlign: "top",
                  padding: "0 10px",
                }}
              >
                <TextField
                  required
                  fullWidth
                  label="Graphics Name"
                  variant="outlined"
                  display={"inline-block"}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Box>

              <Box
                justifyContent={"space-between"}
                alignItems={"right"}
                mt={1}
                mb={1}
                style={{
                  width: "50%",
                  verticalAlign: "top",
                  padding: "0 10px",
                }}
              >
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Graphics Category
                  </InputLabel>
                  <Select
                    labelId="transaction-type-label"
                    id="transaction-type"
                    value={transactionType}
                    label="Transaction Type"
                    onChange={handleChange}
                  >
                    <MenuItem value="">Please Select</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box
                justifyContent={"space-between"}
                alignItems={"right"}
                mt={1}
                mb={1}
                style={{
                  width: "50%",
                  verticalAlign: "top",
                  padding: "0 10px",
                }}
              >
                <TextField
                  required
                  fullWidth
                  label="Graphics Category Group"
                  variant="outlined"
                  display={"inline-block"}
                  value={cat_group}
                  onChange={(e) => setCatGroup(e.target.value)}
                />
              </Box>

              <Box
                justifyContent="space-between"
                alignItems="center"
                mt={1}
                ml={2}
                mb={1}
                sx={{ width: "50%", verticalAlign: "top" }}
              >
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload file
                  <VisuallyHiddenInput
                    type="file"
                    onChange={(event) => handleFileChange(event)}
                  />
                </Button>
                {selectedFile && (
                  <Typography variant="body2" sx={{ marginTop: 1 }}>
                    {selectedFile.name}
                  </Typography>
                )}
              </Box>
            </Grid>

            <Grid item>
              <Box
                display="flex"
                justifyContent="flex-end"
                mr={2}
                mt={1}
                ml={2}
                mb={1}
              >
                <Button
                  variant="contained"
                  color="success"
                  size="medium"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Box>
            </Grid>
          </TableContainer>
        </Grid>
      </Grid>
    </main>
  );
};
export default AddGraphicsTransactions;
