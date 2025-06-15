import styled from "@emotion/styled";
import {
  Button,
  TextField,
  Box,
  Snackbar,
  Alert,
  Chip,
  CardMedia,
  Avatar,
  IconButton,
  CircularProgress,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Tab from "@mui/material/Tab";
import WestIcon from "@mui/icons-material/West";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateCategoryMutation,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} from "../../../../redux/api/category";
import {
  useDeleteDocumentMutation,
  useGetUploadDocumentQuery,
  useUploadDocumentPngMutation,
} from "../../../../redux/api/document";

const RootContainer = styled.div({
  display: "flex",
  gap: 15,
  flexDirection: "column",
  width: 360,
});

const KeywordsContainer = styled.div({
  display: "flex",
  flexWrap: "wrap",
  gap: 5,
  marginTop: 5,
});

const ImageUploadContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 10,
  marginBottom: 20,
});

const ImagePreviewContainer = styled.div({
  position: "relative",
  width: "100%",
  maxHeight: 300,
  overflow: "hidden",
  borderRadius: 4,
});

const UploadButton = styled(Button)({
  marginTop: 10,
});

interface CategoryFormValues {
  name: string;
  is_front_show: boolean;
  short_content: string; // Add this line

  cover_image_id: number | null;
  meta_title: string;
  meta_description: string;
  meta_keyword: string;
  og_title: string;
  og_description: string;
  og_keyword: string;
}

const CategoryAddEditForm: React.FC = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [value, setValue] = useState<string>("1");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [uploadImage, { isLoading: isUploading }] =
    useUploadDocumentPngMutation();
  const [deleteImage] = useDeleteDocumentMutation();
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  let { id } = useParams<{ id: string }>();
  const { data: categoryData, isSuccess } = useGetCategoryByIdQuery(id, {
    skip: !id,
  });

  // Fetch document data for cover image
  const { data: documentData } = useGetUploadDocumentQuery(
    categoryData?.cover_image_id || 0,
    {
      skip: !categoryData?.cover_image_id,
    }
  );

  useEffect(() => {
    if (isSuccess && categoryData) {
      formik.setValues({
        name: categoryData.name || "",
        short_content: categoryData.short_content || "",
        is_front_show: categoryData.is_front_show || false,
        cover_image_id: categoryData.cover_image_id || null,
        meta_title: categoryData.meta_title || "",
        meta_description: categoryData.meta_description || "",
        meta_keyword: categoryData.meta_keyword || "",
        og_title: categoryData.og_title || "",
        og_description: categoryData.og_description || "",
        og_keyword: categoryData.og_keyword || "",
      });
      // Reset local image URL when category data changes
      setLocalImageUrl(null);
    }
  }, [isSuccess, categoryData]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Create a local URL for preview
      const localUrl = URL.createObjectURL(file);
      setLocalImageUrl(localUrl);

      const formData = new FormData();
      formData.append("image", file);

      const response = await uploadImage(formData).unwrap();

      formik.setFieldValue("cover_image_id", response.id);

      setSnackbarMessage("Image uploaded successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      setLocalImageUrl(null);
      setSnackbarMessage("Failed to upload image");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleDeleteImage = async () => {
    if (!formik.values.cover_image_id) return;

    try {
      await deleteImage(formik.values.cover_image_id).unwrap();

      formik.setFieldValue("cover_image_id", null);
      setLocalImageUrl(null);

      setSnackbarMessage("Image deleted successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage("Failed to delete image");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (_: any, newValue: string) => {
    console.log(_);
    setValue(newValue);
  };

  const formik = useFormik<CategoryFormValues>({
    initialValues: {
      name: "",
      is_front_show: false,
      short_content: "",
      cover_image_id: null,
      meta_title: "",
      meta_description: "",
      meta_keyword: "",
      og_title: "",
      og_description: "",
      og_keyword: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Category name is required"),
      is_front_show: Yup.boolean(),
      cover_image_id: Yup.number().nullable(),
      meta_title: Yup.string(),
      meta_description: Yup.string(),
      meta_keyword: Yup.string(),
      og_title: Yup.string(),
      og_description: Yup.string(),
      og_keyword: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        if (id) {
          await updateCategory({
            id: id,
            data: {
              name: values.name,
              is_front_show: values.is_front_show,
              short_content: values.short_content,
              cover_image_id: values.cover_image_id,
              meta_title: values.meta_title,
              meta_description: values.meta_description,
              meta_keyword: values.meta_keyword,
              og_title: values.og_title,
              og_description: values.og_description,
              og_keyword: values.og_keyword,
            },
          }).unwrap();
          setSnackbarMessage("Category updated successfully!");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
        } else {
          const result = await createCategory({
            name: values.name,
            is_front_show: values.is_front_show,
            short_content: values.short_content,
            cover_image_id: values.cover_image_id,
            meta_title: values.meta_title,
            meta_description: values.meta_description,
            meta_keyword: values.meta_keyword,
            og_title: values.og_title,
            og_description: values.og_description,
            og_keyword: values.og_keyword,
          }).unwrap();
          formik.resetForm();
          setLocalImageUrl(null);
          setSnackbarMessage("Category created successfully!");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
          navigate(`/category/edit/${result.id}`);
        }
      } catch (error) {
        setSnackbarMessage("Error occurred while processing the request.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    },
  });

  const handleSubmitForm = () => {
    formik.setTouched({
      name: true,
      is_front_show: true,
      short_content: true,
      cover_image_id: true,
      meta_title: true,
      meta_description: true,
      meta_keyword: true,
      og_title: true,
      og_description: true,
      og_keyword: true,
    });
    setFormSubmitted(true);
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        formik.handleSubmit();
      }
    });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const renderKeywords = (keywords: string) => {
    if (!keywords) return null;
    return keywords
      .split(",")
      .map(
        (keyword, index) =>
          keyword.trim() && (
            <Chip key={index} label={keyword.trim()} size="small" />
          )
      );
  };

  // Determine the image URL to display
  const getImageUrl = () => {
    if (localImageUrl) return localImageUrl;
    if (documentData)
      return `${import.meta.env.VITE_API_BASE_URL}${
        documentData.static_file_path
      }`;
    return null;
  };

  const imageUrl = getImageUrl();

  return (
    <div>
      <div
        onClick={() => navigate("/category")}
        style={{
          display: "flex",
          gap: 10,
          padding: "10px 0px",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <WestIcon />
        <div style={{ fontSize: 24 }}>Back</div>
      </div>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label={id ? "Edit Category" : "New Category"} value="1" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <RootContainer>
            {/* Name Field */}
            <TextField
              label="Name"
              id="name"
              variant="outlined"
              size="small"
              {...formik.getFieldProps("name")}
              required
              error={formSubmitted && Boolean(formik.errors.name)}
              helperText={formSubmitted && formik.errors.name}
            />
            <TextField
              label="Short Content"
              id="short_content"
              variant="outlined"
              size="small"
              {...formik.getFieldProps("short_content")}
              required
              error={formSubmitted && Boolean(formik.errors.name)}
              helperText={formSubmitted && formik.errors.name}
            />
            {/* Show on Front Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.is_front_show}
                  onChange={formik.handleChange}
                  name="is_front_show"
                  color="primary"
                />
              }
              label="Show on Front Page"
            />

            {/* Cover Image Upload Section */}
            <div>
              <Typography variant="subtitle1">Cover Image</Typography>
              <ImageUploadContainer>
                {imageUrl || formik.values.cover_image_id ? (
                  <>
                    <ImagePreviewContainer>
                      <CardMedia
                        component="img"
                        height="300"
                        image={imageUrl || "/default-cover-image.jpg"}
                        alt="Cover preview"
                      />
                      <IconButton
                        onClick={handleDeleteImage}
                        size="small"
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          backgroundColor: "rgba(255,255,255,0.7)",
                        }}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </ImagePreviewContainer>
                    <UploadButton
                      variant="outlined"
                      onClick={triggerFileInput}
                      startIcon={<CloudUploadIcon />}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <CircularProgress size={24} />
                      ) : (
                        "Replace Image"
                      )}
                    </UploadButton>
                  </>
                ) : (
                  <>
                    <ImagePreviewContainer
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px dashed #ccc",
                      }}
                    >
                      <Avatar style={{ width: 100, height: 100 }}>
                        <CloudUploadIcon fontSize="large" />
                      </Avatar>
                    </ImagePreviewContainer>
                    <UploadButton
                      variant="contained"
                      onClick={triggerFileInput}
                      startIcon={<CloudUploadIcon />}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <CircularProgress size={24} />
                      ) : (
                        "Upload Cover Image"
                      )}
                    </UploadButton>
                  </>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </ImageUploadContainer>
            </div>

            {/* SEO Fields */}
            <TextField
              label="Meta Title"
              id="meta_title"
              variant="outlined"
              size="small"
              {...formik.getFieldProps("meta_title")}
              error={formSubmitted && Boolean(formik.errors.meta_title)}
              helperText={formSubmitted && formik.errors.meta_title}
            />
            <TextField
              label="Meta Description"
              id="meta_description"
              variant="outlined"
              size="small"
              multiline
              rows={3}
              {...formik.getFieldProps("meta_description")}
              error={formSubmitted && Boolean(formik.errors.meta_description)}
              helperText={formSubmitted && formik.errors.meta_description}
            />
            <div>
              <TextField
                label="Meta Keywords (comma separated)"
                id="meta_keyword"
                variant="outlined"
                size="small"
                fullWidth
                {...formik.getFieldProps("meta_keyword")}
                error={formSubmitted && Boolean(formik.errors.meta_keyword)}
                helperText={formSubmitted && formik.errors.meta_keyword}
                placeholder="Enter keywords separated by commas"
              />
              <KeywordsContainer>
                {renderKeywords(formik.values.meta_keyword)}
              </KeywordsContainer>
            </div>
            <TextField
              label="OG Title"
              id="og_title"
              variant="outlined"
              size="small"
              {...formik.getFieldProps("og_title")}
              error={formSubmitted && Boolean(formik.errors.og_title)}
              helperText={formSubmitted && formik.errors.og_title}
            />
            <TextField
              label="OG Description"
              id="og_description"
              variant="outlined"
              size="small"
              multiline
              rows={3}
              {...formik.getFieldProps("og_description")}
              error={formSubmitted && Boolean(formik.errors.og_description)}
              helperText={formSubmitted && formik.errors.og_description}
            />
            <div>
              <TextField
                label="OG Keywords (comma separated)"
                id="og_keyword"
                variant="outlined"
                size="small"
                fullWidth
                {...formik.getFieldProps("og_keyword")}
                error={formSubmitted && Boolean(formik.errors.og_keyword)}
                helperText={formSubmitted && formik.errors.og_keyword}
                placeholder="Enter keywords separated by commas"
              />
              <KeywordsContainer>
                {renderKeywords(formik.values.og_keyword)}
              </KeywordsContainer>
            </div>

            <Button
              variant="contained"
              onClick={handleSubmitForm}
              style={{ color: "white" }}
            >
              {id ? "Update" : "Submit"}
            </Button>
          </RootContainer>
        </TabPanel>
      </TabContext>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          sx={{ width: "100%" }}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CategoryAddEditForm;
