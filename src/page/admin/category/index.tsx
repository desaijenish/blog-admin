import styled from "@emotion/styled";
import * as React from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Tooltip,
  Chip,
  Avatar,
  Paper,
  Stack,
  // Badge,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import {
  useGetAllCategoryQuery,
  useRemoveCategoryMutation,
} from "../../../redux/api/category";
import { decodeDate } from "../../../utils/decodeDate";

const RootContainer = styled(Box)({
  padding: "32px",
  backgroundColor: "#f8fafc",
  minHeight: "100vh",
});

const HeaderContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "32px",
  flexWrap: "wrap",
  gap: "16px",
});

const SearchContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  marginBottom: "24px",
  flexWrap: "wrap",
  "& .MuiTextField-root": {
    flexGrow: 1,
    maxWidth: "400px",
  },
});

const StyledTableContainer = styled(TableContainer)(() => ({
  borderRadius: "12px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  border: "1px solid #e2e8f0",
  overflow: "hidden",
  backgroundColor: "white",
}));

const StyledTableHead = styled(TableHead)({
  backgroundColor: "#f1f5f9",
  "& .MuiTableCell-root": {
    fontWeight: 600,
    color: "#334155",
    letterSpacing: "0.5px",
    fontSize: "0.875rem",
  },
});

const StyledTableCell = styled(TableCell)({
  padding: "16px",
  borderBottom: "1px solid #e2e8f0",
});

const ActionCell = styled.div({
  display: "flex",
  justifyContent: "flex-end",
  gap: "8px",
});

// const StatusBadge = styled(Badge)(({ theme }) => ({
//   "& .MuiBadge-badge": {
//     right: 10,
//     top: 10,
//     padding: "0 4px",
//     minWidth: "20px",
//     height: "20px",
//     borderRadius: "10px",
//   },
// }));

const Category: React.FC = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = React.useState<string>("");
  const [search, setSearch] = React.useState<string>("");
  const { data: categories = [], isFetching } = useGetAllCategoryQuery({
    search,
  });
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [deleteCategory] = useRemoveCategoryMutation();

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    console.log(event);

    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (id: number) => {
    navigate(`/category/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    await deleteCategory(id);
  };

  const handleClear = () => {
    setSearchInput("");
    setSearch("");
  };

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getStatusChip = (status: number) => {
    return status === 1 ? (
      <Chip
        icon={<CheckCircleIcon fontSize="small" />}
        label="Active"
        color="success"
        size="small"
        variant="outlined"
        sx={{ fontWeight: 500 }}
      />
    ) : (
      <Chip
        icon={<CancelIcon fontSize="small" />}
        label="Inactive"
        color="error"
        size="small"
        variant="outlined"
        sx={{ fontWeight: 500 }}
      />
    );
  };

  const getVisibilityChip = (isFrontShow: boolean | null) => {
    if (isFrontShow === null) {
      return (
        <Chip
          label="Not Set"
          color="default"
          size="small"
          variant="outlined"
          sx={{ fontWeight: 500 }}
        />
      );
    }
    return isFrontShow ? (
      <Chip
        icon={<VisibilityIcon fontSize="small" />}
        label="Visible"
        color="info"
        size="small"
        variant="outlined"
        sx={{ fontWeight: 500 }}
      />
    ) : (
      <Chip
        icon={<VisibilityOffIcon fontSize="small" />}
        label="Hidden"
        color="warning"
        size="small"
        variant="outlined"
        sx={{ fontWeight: 500 }}
      />
    );
  };

  return (
    <RootContainer>
      <HeaderContainer>
        <Typography
          variant="h4"
          component="h1"
          fontWeight="700"
          color="#1e293b"
        >
          Category Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/category/add")}
          sx={{
            backgroundColor: "#4f46e5",
            "&:hover": {
              backgroundColor: "#4338ca",
            },
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            padding: "8px 16px",
          }}
        >
          Add New Category
        </Button>
      </HeaderContainer>

      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <SearchContainer>
          <TextField
            fullWidth
            label="Search categories..."
            placeholder="Search by name, meta title..."
            variant="outlined"
            size="medium"
            InputProps={{
              startAdornment: (
                <SearchIcon color="action" sx={{ mr: 1, color: "#64748b" }} />
              ),
              endAdornment: searchInput && (
                <IconButton
                  size="small"
                  onClick={handleClear}
                  sx={{ color: "#64748b" }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              ),
              sx: {
                borderRadius: "8px",
                backgroundColor: "#f8fafc",
              },
            }}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            disabled={!searchInput.trim()}
            sx={{
              backgroundColor: "#4f46e5",
              "&:hover": {
                backgroundColor: "#4338ca",
              },
              textTransform: "none",
              fontWeight: 500,
              borderRadius: "8px",
              padding: "8px 20px",
            }}
          >
            Search
          </Button>
        </SearchContainer>

        {isFetching ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
          >
            <CircularProgress color="inherit" />
          </Box>
        ) : (
          <StyledTableContainer>
            <Table>
              <StyledTableHead>
                <TableRow>
                  <StyledTableCell>Category</StyledTableCell>
                  <StyledTableCell>Meta Title</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Visibility</StyledTableCell>
                  <StyledTableCell>Created Date</StyledTableCell>
                  <StyledTableCell align="right">Actions</StyledTableCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {categories.length > 0 ? (
                  categories
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((category: any) => (
                      <TableRow
                        key={category.id}
                        hover
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          "&:hover": {
                            backgroundColor: "#f8fafc",
                          },
                        }}
                      >
                        <StyledTableCell>
                          <Stack direction="row" alignItems="center" gap={2}>
                            <Avatar
                              sx={{
                                bgcolor: "#e0e7ff",
                                color: "#4f46e5",
                                fontWeight: 600,
                              }}
                            >
                              {category.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography fontWeight={500}>
                              {category.name}
                            </Typography>
                          </Stack>
                        </StyledTableCell>
                        <StyledTableCell>
                          <Typography variant="body2" color="text.secondary">
                            {category.meta_title || "—"}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell>
                          {getStatusChip(category.status)}
                        </StyledTableCell>
                        <StyledTableCell>
                          {getVisibilityChip(category.is_front_show)}
                        </StyledTableCell>
                        <StyledTableCell>
                          <Typography variant="body2">
                            {decodeDate(category.created_date)}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell>
                          <ActionCell>
                            <Tooltip title="Edit" arrow>
                              <IconButton
                                onClick={() => handleEdit(category.id)}
                                size="small"
                                sx={{
                                  color: "#4f46e5",
                                  "&:hover": {
                                    backgroundColor: "#e0e7ff",
                                  },
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete" arrow>
                              <IconButton
                                onClick={() => handleDelete(category.id)}
                                size="small"
                                sx={{
                                  color: "#ef4444",
                                  "&:hover": {
                                    backgroundColor: "#fee2e2",
                                  },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </ActionCell>
                        </StyledTableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        {search
                          ? "No categories found matching your search."
                          : "No categories available. Create your first category!"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={categories.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                borderTop: "1px solid #e2e8f0",
                "& .MuiTablePagination-actions": {
                  marginLeft: "8px",
                },
              }}
            />
          </StyledTableContainer>
        )}
      </Paper>
    </RootContainer>
  );
};

export default Category;
