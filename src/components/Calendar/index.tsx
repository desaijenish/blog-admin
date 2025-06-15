import styled from "@emotion/styled";
import dayjs from "dayjs";
import { FC, ForwardedRef, forwardRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Typography } from "@mui/material";
import Header from "./Header";
import "./index.css";

const RootContainer = styled.div(() => ({}));

const ButtonContainer = styled.div(() => ({
  padding: "16px 24px",
  display: "flex",
  gap: "16px",
  alignItems: "center",
  justifyContent: "end",
}));

const StyledButton = styled(Button)(() => ({
  borderRadius: 4,
  padding: "8px 16px",
}));

const LabelContainer = styled.div(() => ({
  marginBottom: "8px",
}));

interface CalendarProps {
  onApply: (date: Date) => void;
  allowPastDates?: boolean;
  style?: React.CSSProperties;
  selected?: Date;
  format?: string;
  label?: string;
  error?: string | null | boolean;
  minDate?: Date;
}

interface InputProps {
  toggle: () => void;
  selectedDate?: Date;
  format?: string;
  error?: string | null | boolean;
}

type Ref = ForwardedRef<HTMLInputElement>;

const Input = forwardRef(
  ({ toggle, selectedDate, format, error }: InputProps, ref: Ref) => {
    const date = selectedDate ? dayjs(selectedDate).format(format) : "";

    return (
      <input
        ref={ref}
        onFocus={toggle}
        value={date}
        onChange={() => {}} // Add an empty onChange handler to silence the warning
        placeholder="DD/MM/YYYY HH:mm"
        style={{
          border: error ? "1px solid red" : "1px solid lightgray",
          borderRadius: 8,
          padding: "10px 12px",
          width: "100%",
          height: "56px",
        }}
      />
    );
  }
);

const Calendar: FC<CalendarProps> = ({
  style,
  onApply,
  allowPastDates = true,
  selected,
  format = "DD/MM/YYYY HH:mm a",
  label,
  error,
  minDate,
}) => {
  const [startDate, setStartDate] = useState<Date | undefined>(selected);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(selected);
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((prevOpen) => !prevOpen);

  const handleApply = () => {
    if (startDate) {
      onApply(startDate);
      setSelectedDate(startDate);
      toggle();
    }
  };

  const onChange = (date: Date | null) => {
    if (date) setStartDate(date);
  };

  const now = new Date();

  return (
    <RootContainer style={style}>
      {label && (
        <LabelContainer>
          <Typography variant="body1">{label}</Typography>
        </LabelContainer>
      )}
      <DatePicker
        selected={startDate}
        onChange={onChange}
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          decreaseYear,
          increaseYear,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
          prevYearButtonDisabled,
          nextYearButtonDisabled,
          monthDate,
          customHeaderCount,
          // changeMonth,
          // changeYear,
        }) => (
          <Header
            date={date}
            decreaseMonth={decreaseMonth}
            increaseMonth={increaseMonth}
            decreaseYear={decreaseYear}
            increaseYear={increaseYear}
            prevMonthButtonDisabled={prevMonthButtonDisabled}
            nextMonthButtonDisabled={nextMonthButtonDisabled}
            prevYearButtonDisabled={prevYearButtonDisabled}
            nextYearButtonDisabled={nextYearButtonDisabled}
            monthDate={monthDate}
            customHeaderCount={customHeaderCount}
            startDate={startDate}
            changeMonth={(month: number) =>
              setStartDate((prev) => prev && dayjs(prev).month(month).toDate())
            }
            changeYear={(year: number) =>
              setStartDate((prev) => prev && dayjs(prev).year(year).toDate())
            }
          />
        )}
        timeCaption="Time"
        shouldCloseOnSelect={false}
        onInputClick={toggle}
        open={open}
        showTimeSelect
        dateFormat="dd/MM/yyyy h:mm aa"
        minDate={minDate || (allowPastDates ? undefined : now)}
        customInput={
          <Input
            toggle={toggle}
            selectedDate={selectedDate}
            format={format}
            error={error}
          />
        }
        onClickOutside={toggle}
        // PopperProps={{
        //   placement: "bottom-end",
        //   anchorEl: anchorEl
        // }}
      >
        <ButtonContainer>
          <StyledButton
            variant="contained"
            color="primary"
            onClick={handleApply}
          >
            Apply
          </StyledButton>
          <StyledButton variant="outlined" onClick={toggle}>
            Cancel
          </StyledButton>
        </ButtonContainer>
      </DatePicker>
    </RootContainer>
  );
};

export default Calendar;
