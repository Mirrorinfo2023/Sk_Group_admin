"use client";
import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Typography,
    DialogContentText,
    Card,
    Chip,
} from "@mui/material";
import { Add, Edit, Delete, VisibilityOff, Visibility } from "@mui/icons-material";
import Layout from "@/components/Dashboard/layout";
import api from "../../utils/api";
import { InputAdornment } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import TuneIcon from "@mui/icons-material/Tune";
import { DataEncrypt, DataDecrypt } from "../../utils/encryption";

const CourseReportTable = () => {
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState(""); // New state for category filter
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [categoryImage, setCategoryImage] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [viewData, setViewData] = useState(null);

    const [categories, setCategories] = useState([]);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryDescription, setNewCategoryDescription] = useState("");
    const [categoryErrors, setCategoryErrors] = useState({});

    const [formData, setFormData] = useState({
        category: "",
        name: "",
        link: "",
    });
    const [errors, setErrors] = useState({});
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [rows, setRows] = useState([]);

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, "0");
        const month = date.toLocaleString("en-US", { month: "short" });
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const handleView = (row) => {
        setViewData(row);
        setViewOpen(true);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.post("/api/courses_video/006db6cc97a5160392932874bf6539ad2f0caea4");

                ////console.log(("Encrypted Category API Response:", res);

                if (res.status === 200) {

                    // Decrypt the encrypted string inside res.data.data
                    const decrypted = DataDecrypt(res.data.data);
                    //console.log("Decrypted:", decrypted);

                    // decrypted is already an object:
                    // { status:200, message:"success", data:[...] }

                    const categoryArray = decrypted.data || [];
                    //console.log("categoryArray:", categoryArray);

                    const categoryDict = categoryArray.reduce((acc, cat) => {
                        acc[cat.id] = cat.title;
                        return acc;
                    }, {});

                    //console.log("categoryDict:", categoryDict);

                    setCategories(categoryDict);
                }
            } catch (err) {
                console.error("Failed to decrypt categories:", err);
            }
        };

        fetchCategories();
    }, []);
    //console.log("categorys are ", categories)

    useEffect(() => {
        const fetchVideos = async () => {
            try {

                // 1️⃣ Encrypt empty request (because you send nothing)
                const reqData = {
                    data: DataEncrypt(JSON.stringify({}))   // or {} also fine
                };

                // 2️⃣ API call
                const res = await api.post("/api/courses_video//1111b6cc97a5160392932874bf6539ad2f0caea4", reqData);

                if (res.data?.status === 200) {

                    // 3️⃣ Decrypt response
                    const decrypted = DataDecrypt(res.data.data);
                    const parsed = (decrypted);
                    // console.log("parsed ", parsed)
                    const videoArray = Array.isArray(parsed) ? parsed : [parsed];
                    // console.log("videoArray ", videoArray)
                    setRows(
                        videoArray.map((vid) => ({
                            id: vid.id,
                            date: formatDate(vid.created_on),
                            category: categories[vid.category_id] || "N/A",
                            name: vid.title,
                            link: vid.video_link,
                            status: vid.status,
                        }))
                    );
                }

            } catch (err) {
                console.error("Error fetching videos:", err);
            }
        };

        fetchVideos();
    }, [categories]);


    const handleOpen = () => {
        setFormData({ category: "", name: "", link: "" });
        setErrors({});
        setIsEditing(false);
        setEditId(null);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const validateForm = () => {
        let tempErrors = {};
        if (!formData.category) tempErrors.category = "Category is required";
        if (!formData.name) tempErrors.name = "Course name is required";
        if (!formData.link) {
            tempErrors.link = "Course link is required";
        } else if (!/^https?:\/\/.+/.test(formData.link)) {
            tempErrors.link = "Enter a valid URL";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleEdit = (row) => {
        setFormData({
            category: Object.keys(categories).find(
                (id) => categories[id] === row.category
            ) || "",
            name: row.name,
            link: row.link,
        });
        setIsEditing(true);
        setEditId(row.id);
        setErrors({});
        setOpen(true);
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const payload = {
                title: formData.name,
                video_link: formData.link,
                category_id: formData.category,
                status: 1,
            };

            // 🔐 Encrypt Payload
            const encryptedPayload = {
                data: DataEncrypt(JSON.stringify(payload))
            };

            if (isEditing && editId) {
                payload.video_id = editId;

                const encryptedUpdatePayload = {
                    data: DataEncrypt(JSON.stringify(payload))
                };

                const res = await api.post("/api/courses_video/40554376bbb6e31e0bc64423ded5cc004fb482cb", encryptedUpdatePayload);

                const decrypted = (DataDecrypt(res.data.data));

                if (decrypted.status === 200) {
                    alert("Video updated successfully!");
                    setRows(rows.map(r =>
                        r.id === editId
                            ? {
                                ...r,
                                category: categories[payload.category_id] || "N/A",
                                name: payload.title,
                                link: payload.video_link,
                                status: 1,
                            }
                            : r
                    ));
                    handleClose();
                }
            } else {
                const res = await api.post("/api/courses_video/215b2b9906271845aa0b56afb52ac99d0d1cd2ed", encryptedPayload);

                const decrypted = (DataDecrypt(res.data.data));

                if (decrypted.status === 200 || decrypted.status === 201) {
                    alert("Video added successfully!");
                    setRows([
                        ...rows,
                        {
                            id: decrypted.data.insertId,
                            category: categories[payload.category_id] || "N/A",
                            name: payload.title,
                            link: payload.video_link,
                            status: 1,
                            date: formatDate(new Date()),
                        }
                    ]);
                    handleClose();
                }
            }

        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        }
    };


    const handleAddCategorySubmit = async () => {
        if (!newCategoryName.trim()) {
            setCategoryErrors({ name: "Category name is required" });
            return;
        }
        setCategoryErrors({});

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("category_name", newCategoryName);
            formDataToSend.append("description", newCategoryDescription);
            if (categoryImage) formDataToSend.append("image", categoryImage);
            formDataToSend.append("user_id", 1);

            const res = await api.post("/api/courses_video/addcategory", formDataToSend);
            if (res.data.status === 201) {
                alert("Category added successfully!");
                const newCategory = res.data.data;
                setCategories({
                    ...categories,
                    [newCategory.id]: newCategory.category_name,
                });
                setCategoryOpen(false);
                setNewCategoryName("");
                setNewCategoryDescription("");
                setCategoryImage(null);
            }
        } catch (err) {
            console.error("Failed to add category:", err);
            alert("Something went wrong");
        }
    };

    const confirmActionHandler = () => {
        if (confirmAction) confirmAction();
        setConfirmOpen(false);
    };

    const handleToggleHide = async (id) => {
        try {
            const res = await api.post("/api/courses_video/hide-video", { video_id: id });
            if (res.data.status === 200) {
                setRows(rows.map(r =>
                    r.id === id ? { ...r, status: res.data.newStatus } : r
                ));
            }
        } catch (err) {
            console.error("Toggle hide error:", err);
            alert("Something went wrong");
        }
    };

    const handleDelete = (id) => {
        setConfirmAction(() => async () => {
            try {
                // 1️⃣ Build plain JSON object
                const payload = { video_id: id };

                // 2️⃣ Encrypt the payload (MUST BE STRINGIFIED)
                const encryptedData = DataEncrypt(JSON.stringify(payload));

                // 3️⃣ Send encrypted data as `data`
                const res = await api.post("/api/courses_video/bdbb2b9906271845aa0b56afb52ac99d0d1cd345", {
                    data: encryptedData
                });
                //console.log(("res ", res)
                // 4️⃣ Backend returns encrypted JSON → decrypt it
                const decrypted = DataDecrypt(res.data.data);
                //console.log(("decrypted ", decrypted)
                if (decrypted.status === 200) {
                    alert("Video deleted successfully!");
                    setRows(rows.filter((row) => row.id !== id));
                } else {
                    alert(decrypted.message);
                }
            } catch (err) {
                console.error("Delete error:", err);
                alert("Something went wrong");
            }
        });

        setConfirmOpen(true);
    };


    const filteredRows = rows.filter(
        (row) =>
            row.status === 1 &&
            (row.name.toLowerCase().includes(search.toLowerCase()) ||
                row.category.toLowerCase().includes(search.toLowerCase())) &&
            (categoryFilter === "" || row.category === categoryFilter) // Add category filter condition
    );

    const handleResetFilters = () => {
        setSearch("");
        setCategoryFilter(""); // Reset category filter too
    };

    const activeFilterCount = (search ? 1 : 0) + (categoryFilter ? 1 : 0); // Update active filter count

    return (
        <Layout>
            <Box sx={{ p: 1.5 }}>
                {/* Header Section */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}>
                    <Typography variant="h6" sx={{
                        fontWeight: "bold",
                        background: 'blue',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: '18px'
                    }}>
                        Course Report
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <IconButton
                            size="small"
                            onClick={() => setShowFilters(!showFilters)}
                            sx={{
                                backgroundColor: showFilters ? '#2196f3' : '#f5f5f5',
                                color: showFilters ? 'white' : 'inherit',
                                '&:hover': {
                                    backgroundColor: showFilters ? '#1976d2' : '#e0e0e0'
                                }
                            }}
                        >
                            <TuneIcon sx={{ fontSize: 18 }} />
                        </IconButton>

                        <Button
                            variant="contained"
                            onClick={handleOpen}
                            startIcon={<Add />}
                            sx={{
                                borderRadius: '8px',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                px: 2,
                                py: 0.8,
                                background: 'blue',
                                textTransform: 'none',
                                minWidth: 'auto'
                            }}
                        >
                            Add Video
                        </Button>
                    </Box>
                </Box>

                {/* Compact Filters Section */}
                {showFilters && (
                    <Card sx={{ p: 1.5, mb: 2, backgroundColor: '#f8f9fa' }}>
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            flexWrap: 'wrap'
                        }}>
                            <TextField
                                placeholder="Search courses..."
                                variant="outlined"
                                size="small"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ color: '#666', mr: 1, fontSize: 20 }} />,
                                }}
                                sx={{
                                    width: "200px",
                                    '& .MuiOutlinedInput-root': {
                                        height: '36px',
                                        fontSize: '0.8rem',
                                    }
                                }}
                            />

                            {/* Category Filter Dropdown */}
                            <Select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                displayEmpty
                                size="small"
                                sx={{
                                    width: "180px",
                                    height: '36px',
                                    fontSize: '0.8rem',
                                    '& .MuiSelect-select': {
                                        padding: '8px 12px',
                                    }
                                }}
                            >
                                <MenuItem value="">All Categories</MenuItem>
                                {Object.entries(categories).map(([id, title]) => (
                                    <MenuItem key={id} value={title}>
                                        {title}
                                    </MenuItem>
                                ))}
                            </Select>

                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>

                                {activeFilterCount > 0 && (
                                    <button
                                        onClick={handleResetFilters}
                                        style={{
                                            backgroundColor: '#f5f5f5',
                                            color: '#666',
                                            border: '1px solid #ddd',
                                            borderRadius: '6px',
                                            padding: '8px 16px',
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            height: '36px',
                                            minWidth: '80px'
                                        }}
                                    >
                                        Reset
                                    </button>
                                )}
                            </Box>
                        </Box>
                    </Card>
                )}

                {/* Results Summary */}
                <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '0.8rem' }}>
                        Showing {filteredRows.length} of {rows.length} courses
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {search && (
                            <Chip
                                label={`Search: ${search}`}
                                size="small"
                                onDelete={() => setSearch('')}
                            />
                        )}
                        {categoryFilter && (
                            <Chip
                                label={`Category: ${categoryFilter}`}
                                size="small"
                                onDelete={() => setCategoryFilter('')}
                            />
                        )}
                    </Box>
                </Box>

                {/* Table */}
                <Card sx={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{
                                    background: '#2196f3',
                                    '& th': {
                                        color: '#fff',
                                        fontWeight: 600,
                                        fontSize: '11px',
                                        padding: '8px 6px',
                                        borderRight: '1px solid rgba(255,255,255,0.2)',
                                        '&:last-child': { borderRight: 'none' }
                                    },
                                }}>
                                    <TableCell>#</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Course Name</TableCell>
                                    <TableCell>Link</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredRows.length > 0 ? (
                                    filteredRows.map((row, index) => (
                                        <TableRow
                                            key={row.id}
                                            hover
                                            sx={{
                                                '&:nth-of-type(even)': { backgroundColor: '#f8f9fa' },
                                                '& td': {
                                                    padding: '6px 6px',
                                                    fontSize: '11px',
                                                    borderRight: '1px solid #e0e0e0',
                                                    '&:last-child': { borderRight: 'none' }
                                                }
                                            }}
                                        >
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontSize="10px" color="#666">
                                                    {row.date}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                {row.category}
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontSize="11px" fontWeight="500">
                                                    {row.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <a
                                                    href={row.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        fontSize: '10px',
                                                        color: '#2196f3',
                                                        textDecoration: 'none',
                                                        wordBreak: 'break-all'
                                                    }}
                                                >
                                                    {row.link.length > 30 ? `${row.link.substring(0, 30)}...` : row.link}
                                                </a>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: "flex", gap: 0.5 }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleView(row)}
                                                        sx={{
                                                            backgroundColor: '#e3f2fd',
                                                            '&:hover': { backgroundColor: '#bbdefb' },
                                                            width: 28,
                                                            height: 28
                                                        }}
                                                    >
                                                        <Visibility sx={{ fontSize: 14 }} />
                                                    </IconButton>

                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEdit(row)}
                                                        sx={{
                                                            backgroundColor: '#f3e5f5',
                                                            '&:hover': { backgroundColor: '#e1bee7' },
                                                            width: 28,
                                                            height: 28
                                                        }}
                                                    >
                                                        <Edit sx={{ fontSize: 14 }} />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDelete(row.id)}
                                                        sx={{
                                                            backgroundColor: '#ffebee',
                                                            '&:hover': { backgroundColor: '#ffcdd2' },
                                                            width: 28,
                                                            height: 28
                                                        }}
                                                    >
                                                        <Delete sx={{ fontSize: 14 }} />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="body2" color="textSecondary">
                                                    No courses found
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>

                {/* Keep your existing Dialogs - they will work with the compact design */}
                <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                    <DialogTitle sx={{
                        background: 'lightblue',
                        color: '#fff',
                        fontSize: '1rem',
                        py: 2
                    }}>
                        {isEditing ? "Edit Video" : "Add New Video"}
                    </DialogTitle>
                    <DialogContent sx={{ mt: 2 }}>
                        <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
                            <Select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                displayEmpty
                                error={!!errors.category}
                                size="small"
                                fullWidth
                            >
                                <MenuItem value="">Select Category</MenuItem>
                                {Object.entries(categories).map(([id, title]) => (
                                    <MenuItem key={id} value={id}>{title}</MenuItem>
                                ))}
                            </Select>
                            <Button
                                size="small"
                                onClick={() => setCategoryOpen(true)}
                                sx={{ minWidth: 'auto', whiteSpace: 'nowrap' }}
                            >
                                Add Category
                            </Button>
                        </Box>
                        {errors.category && <Typography color="error" variant="caption">{errors.category}</Typography>}

                        <TextField
                            label="Course Name"
                            fullWidth
                            size="small"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            error={!!errors.name}
                            helperText={errors.name}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Course Link"
                            fullWidth
                            size="small"
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            error={!!errors.link}
                            helperText={errors.link}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} size="small">Cancel</Button>
                        <Button onClick={handleSubmit} variant="contained" size="small">
                            {isEditing ? "Update" : "Submit"}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Category Dialog */}
                <Dialog open={categoryOpen} onClose={() => setCategoryOpen(false)} fullWidth maxWidth="sm">
                    <DialogTitle sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: '#fff',
                        fontSize: '1rem',
                        py: 2
                    }}>
                        Add New Category
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Category Name *"
                            fullWidth
                            size="small"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            error={!!categoryErrors.name}
                            helperText={categoryErrors.name}
                            sx={{ mb: 2, mt: 2 }}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            size="small"
                            multiline
                            rows={2}
                            value={newCategoryDescription}
                            onChange={(e) => setNewCategoryDescription(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            size="small"
                            value={categoryImage ? categoryImage.name : ""}
                            placeholder="Upload Category Image"
                            InputProps={{
                                readOnly: true,
                                startAdornment: <ImageIcon color="action" sx={{ fontSize: 18 }} />,
                                endAdornment: (
                                    <IconButton component="label" size="small">
                                        <UploadFileIcon sx={{ fontSize: 18 }} />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={(e) => setCategoryImage(e.target.files[0])}
                                        />
                                    </IconButton>
                                ),
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setCategoryOpen(false)} size="small">Cancel</Button>
                        <Button onClick={handleAddCategorySubmit} variant="contained" size="small">
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Confirmation Dialog */}
                <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                    <DialogTitle sx={{ fontSize: '1rem' }}>Confirm Action</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this course?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmOpen(false)} size="small">Cancel</Button>
                        <Button onClick={confirmActionHandler} color="error" variant="contained" size="small">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={viewOpen} onClose={() => setViewOpen(false)} fullWidth maxWidth="sm">
                    <DialogTitle sx={{ fontWeight: "bold" }}>Video Details</DialogTitle>
                    <DialogContent dividers>
                        {viewData && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Typography><strong>ID:</strong> {viewData.id}</Typography>
                                <Typography><strong>Date:</strong> {viewData.date}</Typography>
                                <Typography><strong>Category:</strong> {viewData.category}</Typography>
                                <Typography><strong>Name:</strong> {viewData.name}</Typography>
                                <Typography sx={{ wordBreak: "break-all" }}>
                                    <strong>Link:</strong> {viewData.link}
                                </Typography>

                                {/* Preview if it's YouTube */}
                                {viewData.link.includes("youtube") && (
                                    <iframe
                                        width="100%"
                                        height="250"
                                        src={viewData.link.replace("watch?v=", "embed/")}
                                        style={{ borderRadius: "8px", marginTop: "10px" }}
                                    ></iframe>
                                )}
                            </Box>
                        )}
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => setViewOpen(false)}>Close</Button>
                    </DialogActions>
                </Dialog>

            </Box>
        </Layout>
    );
};

export default CourseReportTable;