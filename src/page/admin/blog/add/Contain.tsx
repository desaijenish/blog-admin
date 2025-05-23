// ContentTab.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/i18n/ko-kr";
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import tableMergedCell from "@toast-ui/editor-plugin-table-merged-cell";
import {
  useGetContentByIdQuery,
  useUpdateContentMutation,
} from "../../../../redux/api/content";

interface ContentTabProps {
  blogId: number;
}

const ContentTab: React.FC<ContentTabProps> = ({ blogId }) => {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const editorRef = useRef<Editor>(null);
  const autoSaveInterval = useRef<NodeJS.Timeout | null>(null);

  // Mock API calls - replace with your actual RTK queries
  const { data: contentData } = useGetContentByIdQuery(blogId);
  const [updateContent] = useUpdateContentMutation();

  // Load initial content
  useEffect(() => {
    if (contentData) {
      setContent(contentData.contain || "");
      setIsLoading(false);
    }
  }, [contentData]);

  // Auto-save functionality
  const saveContent = useCallback(async () => {
    if (!editorRef.current) return;

    const markdownContent = editorRef.current.getInstance().getMarkdown();
    if (markdownContent === content) return; // Don't save if content hasn't changed

    setIsSaving(true);
    try {
      await updateContent({
        blog_id: blogId,
        data: { contain: markdownContent },
      }).unwrap();

      setContent(markdownContent);
      setLastSaved(new Date().toLocaleTimeString());
      setSnackbarMessage("Content auto-saved successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to auto-save content");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsSaving(false);
    }
  }, [blogId, content, updateContent]);

  // Set up auto-save interval
  useEffect(() => {
    autoSaveInterval.current = setInterval(saveContent, 30000); // 10 seconds

    return () => {
      if (autoSaveInterval.current) {
        clearInterval(autoSaveInterval.current);
      }
    };
  }, [saveContent]);

  const handleManualSave = async () => {
    if (autoSaveInterval.current) {
      clearInterval(autoSaveInterval.current);
    }
    await saveContent();
    // Restart the auto-save interval
    autoSaveInterval.current = setInterval(saveContent, 10000);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Blog Content Editor</Typography>

        <Box display="flex" alignItems="center" gap={2}>
          {isSaving && (
            <Box display="flex" alignItems="center">
              <CircularProgress size={20} sx={{ mr: 1 }} />
              <Typography variant="body2">Saving...</Typography>
            </Box>
          )}
          {lastSaved && (
            <Typography variant="body2" color="textSecondary">
              Last saved: {lastSaved}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleManualSave}
            disabled={isSaving}
          >
            Save Now
          </Button>
        </Box>
      </Box>

      <Editor
        ref={editorRef}
        initialValue={content}
        previewStyle="vertical"
        height="calc(100vh - 180px)"
        initialEditType="wysiwyg" // Start in WYSIWYG mode
        useCommandShortcut={true}
        plugins={[colorSyntax, tableMergedCell]}
        language="en-US"
        toolbarItems={[
          ["heading", "bold", "italic", "strike"],
          ["hr", "quote"],
          ["ul", "ol", "task", "indent", "outdent"],
          ["table", "image", "link"],
          ["code", "codeblock"],
          ["scrollSync"],
        ]}
        hideModeSwitch={false}
        usageStatistics={false}
        autofocus={false}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContentTab;
