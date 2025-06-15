import React from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  SelectChangeEvent,
  Box,
} from "@mui/material";

interface DropDownProps {
  label: string;
  value: string | number;
  options: Array<{
    id: number | string;
    first_name: string;
    last_name?: string;
  }>;
  name?: string;
  onChange: (event: SelectChangeEvent<string | number>) => void;
  onBlur?: (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>
  ) => void;
  error?: string | null | undefined;
  helperText?: string | null | undefined;
  required?: any;
}

const DropDown: React.FC<DropDownProps> = ({
  label,
  value,
  options,
  name,
  onChange,
  onBlur,
  error,
  helperText,
  // required
}) => {
  return (
    <Box sx={{ width: "100%" }}>
      <FormControl
        error={Boolean(error)}
        margin="normal"
        fullWidth
        size="small"
        required
      >
        <InputLabel id={`${name}-label`}>{label}</InputLabel>
        <Select
          labelId={`${name}-label`}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          label={label}
          name={name}
          sx={{
            textAlign: "left", // Align selected text to the left
            "& .MuiSelect-select": {
              display: "flex",
              justifyContent: "flex-start", // Left align selected text
              alignItems: "center", // Center vertically
            },
          }}
        >
          {options.length > 0 ? (
            options.map((option) => (
              <MenuItem
                key={option.id}
                value={option.id}
                sx={{ justifyContent: "flex-start" }} // Left align menu items
              >
                {`${option.first_name} ${option?.last_name}`}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No {label.toLowerCase()} available</MenuItem>
          )}
        </Select>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </Box>
  );
};

export default DropDown;
