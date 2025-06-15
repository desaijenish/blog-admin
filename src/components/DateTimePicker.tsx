import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { TextField } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

dayjs.extend(utc);
dayjs.extend(timezone);

interface DateTimePickerProps {
  onSubmit: (dateTime: string) => void;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({ onSubmit }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [value, setValue] = React.useState<Dayjs | null>(null);
  const [date, setDate] = React.useState("");

  const handleSubmit = () => {
    const dateTime = dayjs(value).format("DD/MM/YYYY  hh:mm A");
    setDate(dateTime);
    onSubmit(dateTime);
  };

  return (
    <div>
      <TextField
        id="outlined-read-only-input"
        label="Date & Time"
        InputProps={{
          readOnly: true,
        }}
        onClick={handleOpen}
        fullWidth
        value={date}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="en-us"
          >
            <StaticDateTimePicker
              orientation="portrait"
              timezone="Europe/Paris"
              onChange={(newValue: Dayjs | null) => setValue(newValue)} // Proper type for `onChange`
              onAccept={handleSubmit}
              onClose={handleClose}
              value={value}
            />
          </LocalizationProvider>
        </Box>
      </Modal>
    </div>
  );
};

export default DateTimePicker;
