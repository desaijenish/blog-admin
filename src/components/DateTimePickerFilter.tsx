import React, { useState, useRef, useEffect } from "react";
import { DateCalendar } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import {
  TextField,
  Box,
  Button,
  Popper,
  PopperProps,
  InputAdornment,
} from "@mui/material";
import { CalendarToday } from "@mui/icons-material";

const calendarStyle = {
  toggleContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    margin: "8px 0",
    alignItems: "center",
  },
  calendarBox: {
    backgroundColor: "white",
    padding: "8px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  activeButton: {
    backgroundColor: "#3f51b5",
    color: "white",
    "&:hover": {
      backgroundColor: "#303f9f",
    },
  },
};

interface CustomDatePickerProps {
  onDateSelect: (data: {
    date: string | null;
    type: "before" | "after" | string;
  }) => void;
  value?: { date: string | null; type: "before" | "after" | string};
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  onDateSelect,
  value,
}) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    value?.date ? dayjs(value.date) : null
  );
  const [type, setType] = useState<"before" | "after" | string>(value?.type || "after");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setSelectedDate(value.date ? dayjs(value.date) : null);
      setType(value.type);
    }
  }, [value]);

  const handleDateChange = (value: Dayjs | null) => {
    setSelectedDate(value);
    onDateSelect({ date: value ? value.format("YYYY-MM-DD") : null, type });
    setAnchorEl(null);
  };

  const handleInputClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleToggleClick = (selectedType: "before" | "after") => {
    setType(selectedType);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setAnchorEl(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const CustomPopper = (props: PopperProps) => (
    <Popper
      {...props}
      anchorEl={anchorEl}
      placement="bottom-start"
      style={{ zIndex: 1300 }}
      open={Boolean(anchorEl)}
    >
      <Box sx={calendarStyle.calendarBox} ref={wrapperRef}>
        <Box sx={calendarStyle.toggleContainer}>
          <Button
            variant={type === "before" ? "contained" : "outlined"}
            sx={type === "before" ? calendarStyle.activeButton : {}}
            onClick={() => handleToggleClick("before")}
          >
            Before
          </Button>
          <Button
            variant={type === "after" ? "contained" : "outlined"}
            sx={type === "after" ? calendarStyle.activeButton : {}}
            onClick={() => handleToggleClick("after")}
          >
            After
          </Button>
        </Box>
        <DateCalendar
          defaultValue={selectedDate || dayjs()}
          onChange={handleDateChange}
        />
      </Box>
    </Popper>
  );

  return (
    <Box>
      <TextField
        label="Due Date"
        value={
          selectedDate
            ? `${type.toUpperCase()}: ${selectedDate.format("YYYY-MM-DD")}`
            : ""
        }
        size="small"
        onClick={handleInputClick}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <CalendarToday />
            </InputAdornment>
          ),
          readOnly: true,
        }}
      />
      <CustomPopper open={Boolean(anchorEl)} />
    </Box>
  );
};

export default CustomDatePicker;
