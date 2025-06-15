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
  // Paper,
  IconButton,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Tooltip,
  Chip,
  Autocomplete,
  // Switch,
  // FormControlLabel,
  // Avatar,
  // Badge,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  // FilterList ,
  Visibility,
  VisibilityOff,
  Star,
  StarBorder,
} from "@mui/icons-material";
import {
  useGetAllBlogQuery,
  useRemoveBlogMutation,
} from "../../../redux/api/blog";
// import { decodeDate } from "../../../utils/decodeDate";
import { useGetMultiCategoryQuery } from "../../../redux/api/category";

const RootContainer = styled(Box)(() => ({
  padding: "24px",
  backgroundColor: "#f9fafc",
  minHeight: "100vh",
}));

const HeaderContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
  flexWrap: "wrap",
  gap: "16px",
});

const SearchContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "24px",
  flexWrap: "wrap",
});

const StyledTableContainer = styled(TableContainer)({
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  overflow: "hidden",
});

const StyledTableHead = styled(TableHead)({
  backgroundColor: "#f3f4f6",
});

const StyledTableCell = styled(TableCell)({
  fontWeight: 600,
  color: "#374151",
});

const ActionCell = styled(TableCell)({
  display: "flex",
  justifyContent: "flex-end",
  gap: "8px",
  minWidth: "150px",
});

const StatusChip = styled(Chip)(() => ({
  fontWeight: 500,
  fontSize: "0.75rem",
}));

const InactiveChip = styled(Chip)(() => ({
  fontWeight: 500,
  fontSize: "0.75rem",
  // backgroundColor: theme.palette.error.light,
  // color: theme.palette.error.dark,
}));

const Blog: React.FC = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = React.useState<string>("");
  const [search, setSearch] = React.useState<string>("");

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [deleteBlog] = useRemoveBlogMutation();

  const [categoryId, setCategoryId] = React.useState<number | null>(null);
  const [slugInput, setSlugInput] = React.useState<string>("");
  const [slug, setSlug] = React.useState<string>("");
  const [statusFilter, setStatusFilter] = React.useState<boolean | null>(null);

  const { data: categories = [] } = useGetMultiCategoryQuery("");
  const { data: blogs = [], isFetching } = useGetAllBlogQuery({
    search,
    category_id: categoryId || undefined,
    slug,
  });

  const handleCategoryChange = (event: any, newValue: any) => {
    console.log(event);

    setCategoryId(newValue?.id || null);
    setPage(0);
  };

  const handleSlugChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSlugInput(event.target.value);
  };

  const handleSlugSearch = () => {
    setSlug(slugInput);
    setPage(0);
  };

  const handleClearSlug = () => {
    setSlugInput("");
    setSlug("");
  };

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
    navigate(`/blog/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    await deleteBlog(id);
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

  // const handleStatusFilterChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setStatusFilter(event.target.checked);
  //   setPage(0);
  // };

  // const handleClearStatusFilter = () => {
  //   setStatusFilter(null);
  // };

  return (
    <RootContainer>
      <HeaderContainer>
        <Typography variant="h4" component="h1" fontWeight="600">
          Blog Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/blog/add")}
          sx={{
            backgroundColor: "#6366f1",
            "&:hover": {
              backgroundColor: "#4f46e5",
            },
          }}
        >
          Add New Blog
        </Button>
      </HeaderContainer>

      <SearchContainer>
        <TextField
          label="Search Blogs"
          placeholder="Search by title, meta title or keywords..."
          variant="outlined"
          size="small"
          sx={{
            width: "320px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
          InputProps={{
            startAdornment: <SearchIcon color="action" />,
            endAdornment: searchInput && (
              <IconButton
                size="small"
                onClick={handleClear}
                sx={{ color: "text.secondary" }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            ),
          }}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />

        {/* Category Dropdown */}
        <Autocomplete
          options={categories}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={handleCategoryChange}
          size="small"
          sx={{ width: 250 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Filter by Category"
              variant="outlined"
            />
          )}
          value={categories.find((c: any) => c.id === categoryId) || null}
          clearIcon={
            <IconButton
              size="small"
              onClick={() => setCategoryId(null)}
              sx={{ visibility: categoryId ? "visible" : "hidden" }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          }
        />

        {/* Slug Filter */}
        <Box display="flex" alignItems="center" gap={1}>
          <TextField
            label="Filter by Slug"
            placeholder="Enter slug..."
            variant="outlined"
            size="small"
            sx={{
              width: "250px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
            InputProps={{
              startAdornment: <SearchIcon color="action" />,
              endAdornment: slugInput && (
                <IconButton
                  size="small"
                  onClick={handleClearSlug}
                  sx={{ color: "text.secondary" }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              ),
            }}
            value={slugInput}
            onChange={handleSlugChange}
            onKeyPress={(e) => e.key === "Enter" && handleSlugSearch()}
          />
          <Button
            variant="outlined"
            onClick={handleSlugSearch}
            disabled={!slugInput.trim()}
          >
            Apply
          </Button>
        </Box>

        {/* Clear All Filters Button */}
        <Button
          variant="outlined"
          color="error"
          startIcon={<ClearIcon />}
          onClick={() => {
            setSearchInput("");
            setSearch("");
            setCategoryId(null);
            setSlugInput("");
            setSlug("");
            setStatusFilter(null);
          }}
          disabled={!search && !categoryId && !slug && statusFilter === null}
          sx={{ ml: "auto" }}
        >
          Clear All
        </Button>
      </SearchContainer>

      {isFetching ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <StyledTableContainer>
          <Table>
            <StyledTableHead>
              <TableRow>
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>Meta Title</StyledTableCell>
                <StyledTableCell>Slug</StyledTableCell>
                <StyledTableCell>Category</StyledTableCell>
                <StyledTableCell align="center">Visibility</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="right">Actions</StyledTableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {blogs.length > 0 ? (
                blogs
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((blog: any) => (
                    <TableRow
                      key={blog.id}
                      hover
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>
                        <Typography fontWeight="500">{blog.title}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {blog.meta_title || "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{blog.slug}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={blog.category_name}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" justifyContent="center" gap={1}>
                          <Tooltip
                            title={
                              blog.is_front_show
                                ? "Visible on front"
                                : "Hidden on front"
                            }
                          >
                            {blog.is_front_show ? (
                              <Visibility color="success" fontSize="small" />
                            ) : (
                              <VisibilityOff
                                color="disabled"
                                fontSize="small"
                              />
                            )}
                          </Tooltip>
                          <Tooltip
                            title={
                              blog.is_front_top_show
                                ? "Featured on front"
                                : "Not featured"
                            }
                          >
                            {blog.is_front_top_show ? (
                              <Star color="warning" fontSize="small" />
                            ) : (
                              <StarBorder color="disabled" fontSize="small" />
                            )}
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {blog.status === 1 ? (
                          <StatusChip label="Active" size="small" />
                        ) : (
                          <InactiveChip label="Inactive" size="small" />
                        )}
                      </TableCell>
                      <ActionCell>
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleEdit(blog.id)}
                            color="primary"
                            size="small"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDelete(blog.id)}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </ActionCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">
                      {search || categoryId || slug || statusFilter !== null
                        ? "No blogs found matching your filters."
                        : "No blogs available. Create your first blog!"}
                    </Typography>
                    {!search &&
                      !categoryId &&
                      !slug &&
                      statusFilter === null && (
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() => navigate("/blog/add")}
                          sx={{ mt: 2 }}
                        >
                          Add Blog
                        </Button>
                      )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={blogs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ borderTop: "1px solid #e5e7eb" }}
          />
        </StyledTableContainer>
      )}
    </RootContainer>
  );
};

export default Blog;
