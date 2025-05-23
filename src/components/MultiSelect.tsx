import {
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  SelectChangeEvent, // Import SelectChangeEvent for type definition
} from "@mui/material";
import { FC } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";

interface MultiSelectProps {
  onChange: (value: string[] | undefined) => void;
  options: string[];
  value: string[];
  placeholder: string;
}

const MultiSelect: FC<MultiSelectProps> = ({
  options,
  placeholder,
  onChange,
  value = [],
}) => {
  // Define the type for the `onChange` event in the `Select` component
  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const selectedValues = event.target.value;
    onChange(Array.isArray(selectedValues) ? selectedValues : undefined);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 250 }}>
      <Select
        multiple
        value={value}
        displayEmpty
        onChange={handleChange} // Use the typed handler
        input={
          <OutlinedInput
            sx={{
              height: "40px", // Fixed height
              padding: "0 14px",
              borderRadius: "8px",
              overflow: "hidden", // Prevent overflow
              whiteSpace: "nowrap", // Prevent text wrapping
              textOverflow: "ellipsis", // Show "..." when text overflows
            }}
            placeholder={placeholder}
            endAdornment={
              value.length > 0 && (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="clear selection"
                    onClick={() => onChange([])}
                    edge="end"
                    size="small"
                  >
                    <CancelIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }
          />
        }
        renderValue={(selected) =>
          selected.length === 0 ? (
            <span style={{ color: "#adadad", whiteSpace: "nowrap" }}>
              {placeholder}
            </span>
          ) : (
            <Stack
              direction="row"
              gap={1}
              flexWrap="nowrap" // Prevent wrapping
              overflow="hidden"
              sx={{ textOverflow: "ellipsis" }}
            >
              {selected.map((event) => (
                <Chip
                  key={event}
                  label={event}
                  onDelete={() =>
                    onChange(value.filter((item) => item !== event))
                  }
                  deleteIcon={<CancelIcon />}
                  sx={{
                    maxWidth: "120px", // Prevent excessive chip width
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                />
              ))}
            </Stack>
          )
        }
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 300, // Increased height for better scrolling
              width: 250,
            },
          },
        }}
      >
        {options.map((name) => (
          <MenuItem
            key={name}
            value={name}
            sx={{ justifyContent: "space-between" }}
          >
            {name}
            {value.includes(name) ? <CheckIcon color="info" /> : null}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MultiSelect;
