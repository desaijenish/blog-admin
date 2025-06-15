// ContentTab.tsx
import React, { useState, useRef } from "react";
import {
  Button,
  Box,
  Card,
  CardMedia,
  IconButton,
  CircularProgress,
  Grid,
  TextField,
  Snackbar,
  Alert,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Chip,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import EditIcon from "@mui/icons-material/Edit";
import { styled } from "@mui/system";
import {
  useGetUploadImagesQuery,
  useUpdateImageMutation,
  useUploadImageMutation,
} from "../../../../redux/api/image";
import { useDeleteImageMutation } from "../../../../redux/api/blog";

const ImageUploadContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: 10,
  margin: "15px 0",
});

const ImageGrid = styled(Grid)({
  marginTop: 20,
});

const ImageCard = styled(Card)({
  position: "relative",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
});

const ImageActions = styled("div")({
  position: "absolute",
  top: 5,
  right: 5,
  display: "flex",
  gap: 5,
  backgroundColor: "rgba(255,255,255,0.8)",
  borderRadius: 4,
  padding: 4,
});

const ImageDetails = styled("div")({
  padding: 10,
  flexGrow: 1,
});

// const UploadButton = styled(Button)({
//   marginTop: 10,
//   width: "fit-content",
// });

const KeywordChip = styled(Chip)({
  margin: "2px",
});

interface ImagesTabProps {
  blogId: string;
}

interface ImageFormData {
  id?: string;
  image: File | null;
  caption: string;
  seo_keywords: string;
}

const ImagesTab: React.FC<ImagesTabProps> = ({ blogId }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentImage, setCurrentImage] = useState<ImageFormData>({
    image: null,
    caption: "",
    seo_keywords: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // RTK Query hooks
  const { data: images, refetch: refetchImages } = useGetUploadImagesQuery(
    blogId,
    { skip: !blogId }
  );
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const [updateImage, { isLoading: isUpdating }] = useUpdateImageMutation();
  const [deleteImage] = useDeleteImageMutation();

  const handleOpenDialog = () => {
    setIsEditMode(false);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (image: any) => {
    setIsEditMode(true);
    setCurrentImage({
      id: image.id,
      image: null,
      caption: image.caption,
      seo_keywords: image.seo_keywords,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentImage({
      image: null,
      caption: "",
      seo_keywords: "",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCurrentImage({
        ...currentImage,
        image: e.target.files[0],
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentImage({
      ...currentImage,
      [name]: value,
    });
  };

  const handleImageUpload = async () => {
    if (!currentImage.image || !blogId) return;

    try {
      const formData = new FormData();
      formData.append("image", currentImage.image);
      formData.append("caption", currentImage.caption);
      formData.append("seo_keywords", currentImage.seo_keywords);
      console.log(currentImage);
      await uploadImage({ blog_id: blogId, formData }).unwrap();
      await refetchImages();

      setSnackbarMessage("Image uploaded successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      handleCloseDialog();
    } catch (error) {
      setSnackbarMessage("Failed to upload image");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleImageUpdate = async () => {
    if (!currentImage.id) return;

    try {
      const formData = new FormData();
      if (currentImage.image) {
        formData.append("image", currentImage.image);
      }
      formData.append("caption", currentImage.caption);
      formData.append("seo_keywords", currentImage.seo_keywords);
      console.log();
      await updateImage({ image_id: currentImage.id, formData }).unwrap();
      await refetchImages();

      setSnackbarMessage("Image updated successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      handleCloseDialog();
    } catch (error) {
      setSnackbarMessage("Failed to update image");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleDeleteImage = async (id: string) => {
    try {
      await deleteImage(id).unwrap();
      await refetchImages();

      setSnackbarMessage("Image deleted successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage("Failed to delete image");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSnackbarMessage("URL copied to clipboard!");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const renderKeywords = (keywords: string) => {
    if (!keywords) return null;
    return keywords
      .split(",")
      .map((keyword, index) => (
        <KeywordChip
          key={index}
          label={keyword.trim()}
          size="small"
          variant="outlined"
        />
      ));
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Content Images
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Upload and manage images for your blog post. You can add captions and
        SEO keywords for each image.
      </Typography>

      <ImageUploadContainer>
        <Button
          variant="contained"
          onClick={handleOpenDialog}
          startIcon={<AddPhotoAlternateIcon />}
          disabled={!blogId}
          sx={{ width: "fit-content" }}
        >
          Add New Image
        </Button>
      </ImageUploadContainer>

      {images && images.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle1" gutterBottom>
            Uploaded Images ({images.length})
          </Typography>
          <ImageGrid container spacing={3}>
            {images.map((image: any) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
                <ImageCard>
                  <CardMedia
                    component="img"
                    height="180"
                    image={`${import.meta.env.VITE_API_BASE_URL}${
                      image.static_file_path
                    }`}
                    alt={image.caption || "Uploaded content"}
                    sx={{ objectFit: "cover" }}
                  />
                  <ImageDetails>
                    <Typography variant="subtitle2" gutterBottom noWrap>
                      {image.caption || "No caption"}
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                      {renderKeywords(image.seo_keywords)}
                    </Box>
                  </ImageDetails>
                  <ImageActions>
                    <Tooltip title="Copy URL">
                      <IconButton
                        onClick={() =>
                          copyToClipboard(
                            `${import.meta.env.VITE_API_BASE_URL}${
                              image.static_file_path
                            }`
                          )
                        }
                        size="small"
                      >
                        <FileCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => handleOpenEditDialog(image)}
                        size="small"
                      >
                        <EditIcon fontSize="small" color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleDeleteImage(image.id)}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" color="error" />
                      </IconButton>
                    </Tooltip>
                  </ImageActions>
                </ImageCard>
              </Grid>
            ))}
          </ImageGrid>
        </>
      )}

      {/* Add/Edit Image Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {isEditMode ? "Edit Image" : "Upload New Image"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "none" }}
            />

            <Button
              variant="outlined"
              onClick={triggerFileInput}
              startIcon={<CloudUploadIcon />}
              fullWidth
              sx={{ py: 1.5 }}
            >
              {currentImage.image
                ? currentImage.image.name
                : isEditMode
                ? "Change Image (optional)"
                : "Select Image"}
            </Button>

            {(currentImage.image || (isEditMode && !currentImage.image)) && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <img
                  src={
                    currentImage.image
                      ? URL.createObjectURL(currentImage.image)
                      : `${import.meta.env.VITE_API_BASE_URL}${
                          images?.find((img: any) => img.id === currentImage.id)
                            ?.static_file_path
                        }`
                  }
                  alt="Preview"
                  style={{
                    maxHeight: 200,
                    maxWidth: "100%",
                    borderRadius: 4,
                    border: "1px solid #eee",
                  }}
                />
              </Box>
            )}

            <TextField
              label="Caption"
              name="caption"
              value={currentImage.caption}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />

            <TextField
              label="SEO Keywords"
              name="seo_keywords"
              value={currentImage.seo_keywords}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              helperText="Separate keywords with commas"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={isEditMode ? handleImageUpdate : handleImageUpload}
            variant="contained"
            disabled={
              (!currentImage.image && !isEditMode) ||
              (isEditMode ? isUpdating : isUploading)
            }
            startIcon={
              isUploading || isUpdating ? (
                <CircularProgress size={20} />
              ) : undefined
            }
          >
            {isUploading || isUpdating
              ? "Processing..."
              : isEditMode
              ? "Update Image"
              : "Upload Image"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ImagesTab;
