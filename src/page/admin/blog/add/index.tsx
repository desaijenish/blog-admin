import styled from "@emotion/styled";
import {
  Button,
  TextField,
  Box,
  Snackbar,
  Alert,
  Chip,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Avatar,
  // IconButton,
  CircularProgress,
  Card,
  CardMedia,
  Typography,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Tab from "@mui/material/Tab";
import WestIcon from "@mui/icons-material/West";
// import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateBlogMutation,
  useGetBlogByIdQuery,
  useUpdateBlogMutation,
} from "../../../../redux/api/blog";
import { useGetMultiCategoryQuery } from "../../../../redux/api/category";
import {
  // useDeleteDocumentMutation,
  useGetUploadDocumentQuery,
  useUploadDocumentPngMutation,
} from "../../../../redux/api/document";
import ImagesTab from "./Images";
import ContainTab from "./Contain";

const RootContainer = styled.div({
  display: "flex",
  gap: 15,
  flexDirection: "column",
  width: "100%",
  maxWidth: 800,
});

const KeywordsContainer = styled.div({
  display: "flex",
  flexWrap: "wrap",
  gap: 5,
  marginTop: 5,
});

const TwoColumnLayout = styled.div({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 15,
  "@media (max-width: 768px)": {
    gridTemplateColumns: "1fr",
  },
});

const ImageUploadContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 10,
  margin: "15px 0",
});

const ImagePreviewContainer = styled(Card)({
  width: "100%",
  height: 300,
  position: "relative",
  borderRadius: 4,
  overflow: "hidden",
});

const UploadButton = styled(Button)({
  marginTop: 10,
  width: "fit-content",
});

interface BlogFormValues {
  title: string;
  category_id: number | "";
  is_front_show: boolean;
  is_front_top_show: boolean;
  short_content: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  meta_keyword: string;
  cononical_url: string;
  og_title: string;
  og_description: string;
  od_image: string;
  twitter_title: string;
  twitter_description: string;
  twitter_image: string;
  tag: string;
  cover_image_id: number | null;
}

const BlogAddEditForm: React.FC = () => {
  const navigate = useNavigate();
  const [createBlog] = useCreateBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [value, setValue] = useState<string>("1");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [uploadImage, { isLoading: isUploading }] =
    useUploadDocumentPngMutation();
  // const [deleteImage] = useDeleteDocumentMutation();
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  let { id } = useParams<{ id: string }>();
  const {
    data: blogData,
    isSuccess,
    refetch: refetchBlogData,
  } = useGetBlogByIdQuery(id, {
    skip: !id,
  });

  // Fetch document data for cover image
  const { data: documentData } = useGetUploadDocumentQuery(
    blogData?.cover_image_id || 0,
    {
      skip: !blogData?.cover_image_id,
    }
  );

  // Fetch categories for dropdown
  const { data: categoriesData } = useGetMultiCategoryQuery({});

  useEffect(() => {
    if (isSuccess && blogData) {
      formik.setValues({
        title: blogData.title || "",
        category_id: blogData.category_id || "",
        is_front_show: blogData.is_front_show || false,
        is_front_top_show: blogData.is_front_top_show || false,
        short_content: blogData.short_content || "",
        slug: blogData.slug || "",
        meta_title: blogData.meta_title || "",
        meta_description: blogData.meta_description || "",
        meta_keyword: blogData.meta_keyword || "",
        cononical_url: blogData.cononical_url || "",
        og_title: blogData.og_title || "",
        og_description: blogData.og_description || "",
        od_image: blogData.od_image || "",
        twitter_title: blogData.twitter_title || "",
        twitter_description: blogData.twitter_description || "",
        twitter_image: blogData.twitter_image || "",
        tag: blogData.tag || "",
        cover_image_id: blogData.cover_image_id || null,
      });

      // Reset local image URL when blog data changes
      setLocalImageUrl(null);
    }
  }, [isSuccess, blogData]);

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

      // If editing, refetch the blog data to get updated image
      if (id) {
        await refetchBlogData();
      }
    } catch (error) {
      setLocalImageUrl(null);
      setSnackbarMessage("Failed to upload image");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  // const handleDeleteImage = async () => {
  //   if (!formik.values.cover_image_id) return;

  //   try {
  //     await deleteImage(formik.values.cover_image_id).unwrap();

  //     formik.setFieldValue("cover_image_id", null);
  //     setLocalImageUrl(null);

  //     setSnackbarMessage("Image deleted successfully!");
  //     setSnackbarSeverity("success");
  //     setOpenSnackbar(true);

  //     // If editing, refetch the blog data
  //     if (id) {
  //       await refetchBlogData();
  //     }
  //   } catch (error) {
  //     setSnackbarMessage("Failed to delete image");
  //     setSnackbarSeverity("error");
  //     setOpenSnackbar(true);
  //   }
  // };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formik = useFormik<BlogFormValues>({
    initialValues: {
      title: "",
      category_id: "",
      is_front_show: false,
      is_front_top_show: false,
      short_content: "",
      slug: "",
      meta_title: "",
      meta_description: "",
      meta_keyword: "",
      cononical_url: "",
      og_title: "",
      og_description: "",
      od_image: "",
      twitter_title: "",
      twitter_description: "",
      twitter_image: "",
      tag: "",
      cover_image_id: null,
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required("Title is required"),
      category_id: Yup.number().required("Category is required"),
      is_front_show: Yup.boolean(),
      is_front_top_show: Yup.boolean(),
      short_content: Yup.string().required("Short content is required"),
      slug: Yup.string().required("Slug is required"),
      meta_title: Yup.string(),
      meta_description: Yup.string(),
      meta_keyword: Yup.string(),
      cononical_url: Yup.string(),
      og_title: Yup.string(),
      og_description: Yup.string(),
      od_image: Yup.string(),
      twitter_title: Yup.string(),
      twitter_description: Yup.string(),
      twitter_image: Yup.string(),
      tag: Yup.string(),
      cover_image_id: Yup.number().nullable(),
    }),
    onSubmit: async (values) => {
      try {
        const blogData = {
          title: values.title,
          category_id: Number(values.category_id),
          is_front_show: values.is_front_show,
          is_front_top_show: values.is_front_top_show,
          short_content: values.short_content,
          slug: values.slug,
          meta_title: values.meta_title,
          meta_description: values.meta_description,
          meta_keyword: values.meta_keyword,
          cononical_url: values.cononical_url,
          og_title: values.og_title,
          og_description: values.og_description,
          od_image: values.od_image,
          twitter_title: values.twitter_title,
          twitter_description: values.twitter_description,
          twitter_image: values.twitter_image,
          tag: values.tag,
          cover_image_id: values.cover_image_id,
        };
        if (id) {
          await updateBlog({
            id: id,
            data: blogData,
          }).unwrap();
          setSnackbarMessage("Blog updated successfully!");
          setSnackbarSeverity("success");
        } else {
          const result = await createBlog(blogData).unwrap();
          formik.resetForm();
          setLocalImageUrl(null);
          setSnackbarMessage("Blog created successfully!");
          setSnackbarSeverity("success");
          navigate(`/blog/edit/${result.id}`);
        }
        setOpenSnackbar(true);
      } catch (error: any) {
        console.log(error);
        if (error.data && error.data.detail) {
          // Handle field-specific errors from backend
          const backendErrors = error.data.detail;
          console.log(error);

          setSnackbarMessage(backendErrors);
          setSnackbarSeverity("error");
        } else {
          // Generic error message
          setSnackbarMessage(
            error.data?.message ||
              "Error occurred while processing the request."
          );
          setSnackbarSeverity("error");
        }
        setOpenSnackbar(true);
      }
    },
  });

  const handleSubmitForm = () => {
    const touchedFields: any = {};
    Object.keys(formik.initialValues).forEach((key) => {
      touchedFields[key] = true;
    });
    formik.setTouched(touchedFields);

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

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    console.log(event);

    setValue(newValue);
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
        onClick={() => navigate("/blog")}
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
            <Tab label={id ? "Edit Blog" : "New Blog"} value="1" />
            <Tab label="Images" value="2" disabled={!id} />
            <Tab label="Contain" value="3" disabled={!id} />
          </TabList>
        </Box>
        <TabPanel value="1">
          <RootContainer>
            {/* Improved Cover Image Upload Section */}
            <div>
              <h3>Cover Image</h3>
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
                      {/* <IconButton
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
                      </IconButton> */}
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

            {/* Rest of your form fields */}
            <TwoColumnLayout>
              <TextField
                label="Title"
                id="title"
                variant="outlined"
                size="small"
                fullWidth
                {...formik.getFieldProps("title")}
                required
                error={formSubmitted && Boolean(formik.errors.title)}
                helperText={formSubmitted && formik.errors.title}
              />

              <TextField
                select
                label="Category"
                id="category_id"
                variant="outlined"
                size="small"
                fullWidth
                {...formik.getFieldProps("category_id")}
                required
                error={formSubmitted && Boolean(formik.errors.category_id)}
                helperText={formSubmitted && formik.errors.category_id}
              >
                <MenuItem value="">Select a category</MenuItem>
                {categoriesData?.map((category: any) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </TwoColumnLayout>

            <TwoColumnLayout>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.is_front_show}
                    onChange={formik.handleChange}
                    name="is_front_show"
                    color="primary"
                  />
                }
                label="Show on Front"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.is_front_top_show}
                    onChange={formik.handleChange}
                    name="is_front_top_show"
                    color="primary"
                  />
                }
                label="Show on Top of Front"
              />
            </TwoColumnLayout>

            <TextField
              label="Short Content"
              id="short_content"
              variant="outlined"
              size="small"
              multiline
              rows={3}
              fullWidth
              {...formik.getFieldProps("short_content")}
              required
              error={formSubmitted && Boolean(formik.errors.short_content)}
              helperText={formSubmitted && formik.errors.short_content}
            />

            <TwoColumnLayout>
              <TextField
                label="Slug"
                id="slug"
                variant="outlined"
                size="small"
                fullWidth
                {...formik.getFieldProps("slug")}
                required
                error={formSubmitted && Boolean(formik.errors.slug)}
                helperText={formSubmitted && formik.errors.slug}
              />
              <TextField
                label="Canonical URL"
                id="cononical_url"
                variant="outlined"
                size="small"
                fullWidth
                {...formik.getFieldProps("cononical_url")}
                error={formSubmitted && Boolean(formik.errors.cononical_url)}
                helperText={formSubmitted && formik.errors.cononical_url}
              />
            </TwoColumnLayout>

            <TextField
              label="Tags (comma separated)"
              id="tag"
              variant="outlined"
              size="small"
              fullWidth
              {...formik.getFieldProps("tag")}
              error={formSubmitted && Boolean(formik.errors.tag)}
              helperText={formSubmitted && formik.errors.tag}
              placeholder="Enter tags separated by commas"
            />
            <KeywordsContainer>
              {renderKeywords(formik.values.tag)}
            </KeywordsContainer>

            <h3>SEO Meta Data</h3>
            <TwoColumnLayout>
              <TextField
                label="Meta Title"
                id="meta_title"
                variant="outlined"
                size="small"
                fullWidth
                {...formik.getFieldProps("meta_title")}
                error={formSubmitted && Boolean(formik.errors.meta_title)}
                helperText={formSubmitted && formik.errors.meta_title}
              />
              <TextField
                label="OG Title"
                id="og_title"
                variant="outlined"
                size="small"
                fullWidth
                {...formik.getFieldProps("og_title")}
                error={formSubmitted && Boolean(formik.errors.og_title)}
                helperText={formSubmitted && formik.errors.og_title}
              />
            </TwoColumnLayout>

            <TwoColumnLayout>
              <TextField
                label="Meta Description"
                id="meta_description"
                variant="outlined"
                size="small"
                multiline
                rows={3}
                fullWidth
                {...formik.getFieldProps("meta_description")}
                error={formSubmitted && Boolean(formik.errors.meta_description)}
                helperText={formSubmitted && formik.errors.meta_description}
              />
              <TextField
                label="OG Description"
                id="og_description"
                variant="outlined"
                size="small"
                multiline
                rows={3}
                fullWidth
                {...formik.getFieldProps("og_description")}
                error={formSubmitted && Boolean(formik.errors.og_description)}
                helperText={formSubmitted && formik.errors.og_description}
              />
            </TwoColumnLayout>

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

            <TwoColumnLayout>
              <TextField
                label="OG Image URL"
                id="od_image"
                variant="outlined"
                size="small"
                fullWidth
                {...formik.getFieldProps("od_image")}
                error={formSubmitted && Boolean(formik.errors.od_image)}
                helperText={formSubmitted && formik.errors.od_image}
              />
              <TextField
                label="Twitter Image URL"
                id="twitter_image"
                variant="outlined"
                size="small"
                fullWidth
                {...formik.getFieldProps("twitter_image")}
                error={formSubmitted && Boolean(formik.errors.twitter_image)}
                helperText={formSubmitted && formik.errors.twitter_image}
              />
            </TwoColumnLayout>

            <TwoColumnLayout>
              <TextField
                label="Twitter Title"
                id="twitter_title"
                variant="outlined"
                size="small"
                fullWidth
                {...formik.getFieldProps("twitter_title")}
                error={formSubmitted && Boolean(formik.errors.twitter_title)}
                helperText={formSubmitted && formik.errors.twitter_title}
              />
              <TextField
                label="Twitter Description"
                id="twitter_description"
                variant="outlined"
                size="small"
                fullWidth
                {...formik.getFieldProps("twitter_description")}
                error={
                  formSubmitted && Boolean(formik.errors.twitter_description)
                }
                helperText={formSubmitted && formik.errors.twitter_description}
              />
            </TwoColumnLayout>

            <Button
              variant="contained"
              onClick={handleSubmitForm}
              style={{ color: "white", marginTop: 20 }}
              size="large"
            >
              {id ? "Update" : "Submit"}
            </Button>
          </RootContainer>
        </TabPanel>
        <TabPanel value="2">
          {id ? (
            <ImagesTab blogId={id} />
          ) : (
            <Typography>Please save the blog first to add images</Typography>
          )}
        </TabPanel>

        <TabPanel value="3">
          {id ? (
            <ContainTab blogId={parseInt(id)} />
          ) : (
            <Typography>Please save the blog first to add content</Typography>
          )}
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

export default BlogAddEditForm;
