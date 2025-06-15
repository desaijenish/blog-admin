import * as React from "react";
import {
  Modal,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { CaretUpDown as CaretUpDownIcon } from "@phosphor-icons/react/dist/ssr/CaretUpDown";
// import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

interface Company {
  id: string;
  name: string;
}

interface CompanySelectModalProps {
  open: boolean;
  onClose?: () => void;
  companies?: Company[];
  selectedCompany?: string | null;
  handleCompanyChange: (event: SelectChangeEvent<string>) => void;
}
const CompanySelectModal: React.FC<CompanySelectModalProps> = ({
  open,
  onClose,
  companies,
  selectedCompany,
  handleCompanyChange,
}) => {
  // const dispatch = useDispatch();
  const router = useNavigate();

  const handleChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value;
    handleCompanyChange(event);

    const selectedCompanyObj = companies?.find(
      (item) => item.name === newValue
    );

    if (selectedCompanyObj) {
      // dispatch(setId(selectedCompanyObj.id)); // Uncomment when using Redux
      if (typeof window !== "undefined") {
        router("/"); // Change this to your desired route
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "#121621",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <Typography variant="h5" component="h6" color={"white"}>
          Please Select Company
        </Typography>
        <div>
          <FormControl fullWidth>
            <InputLabel>Company</InputLabel>
            <Select
              label="Company"
              sx={{
                background: "none",
                color: "var(--mui-palette-neutral-400)",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#635BFF",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#635BFF",
                },
              }}
              IconComponent={CaretUpDownIcon}
              onChange={handleChange}
              value={selectedCompany || ""}
            >
              {companies?.map((option) => (
                <MenuItem key={option.id} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </Box>
    </Modal>
  );
};

export default CompanySelectModal;
