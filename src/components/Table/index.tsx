import { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  // Checkbox,
  // Avatar,
  IconButton,
  Paper,
  // Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { green, red } from "@mui/material/colors";

interface TableProp {
  column: any[];
  data: any[];
}
const TableComponent: FC<TableProp> = ({ column, data }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {column?.map((column: any) => (
              <TableCell key={column.field}>{column}</TableCell>
            ))}
            <TableCell />
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((user: any) => (
            <TableRow key={user.id}>
              {column.map((column: any) => (
                <>
                  <TableCell key={column.field}>
                    {column.render ? column.render(user) : user[column.field]}
                  </TableCell>
                </>
              ))}
              <TableCell>
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
