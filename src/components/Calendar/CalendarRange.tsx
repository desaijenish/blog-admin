import { FC, useEffect, useState } from "react";
import {
  Popper,
  Button as MUIButton,
  IconButton as MUIIconButton,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import dayjs from "dayjs";
import DatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "@emotion/styled";
import isoWeek from "dayjs/plugin/isoWeek";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import Header from "./Header";
import "./index.css";

const theme = {
  palette: {
    neutral: {
      100: "#E0E0E0",
      400: "#9E9E9E",
      900: "#212121",
    },
  },
  typography: {
    caption: {
      sm: { medium: { fontSize: "12px", fontWeight: "500" } },
    },
    paragraph: {
      md: { regular: { fontSize: "14px", fontWeight: "400" } },
    },
  },
};

dayjs.extend(isoWeek);
dayjs.extend(quarterOfYear);

const now = dayjs();
const startOfToday = now.startOf("day");
const startOfYesterday = now.startOf("day").subtract(1, "day");
const startOfThisWeek = now.startOf("isoWeek");
const endOfThisWeek = now.endOf("isoWeek").startOf("day");
const startOfPrevWeek = startOfThisWeek.subtract(1, "week");
const endOfPrevWeek = endOfThisWeek.subtract(1, "week");
const startOfThisMonth = now.startOf("month");
const endofThisMonth = now.endOf("month").startOf("day");
const endOfLastMonth = now.startOf("month").subtract(1).startOf("day");
const startOfLastMonth = endOfLastMonth.startOf("month");
const startOfThisYear = now.startOf("year");
const endOfThisYear = now.endOf("year");
const endOfLastYear = now.startOf("year").subtract(1).endOf("year");
const startOfLastYear = endOfLastYear.startOf("year");

interface HeaderContainerProps {
  className?: string;
  children: React.ReactNode;
}

export type Placement = "bottom" | "right" | "top";

const RootContainer = styled.div<{ placement: string }>(({ placement }) => ({
  ...(placement === "bottom" && { marginTop: 12 }),
  ...(placement === "right" && { marginLeft: 12 }),
}));

const HeaderIcon = styled.div(() => ({
  paddingTop: 8,
  paddingLeft: 24,
  paddingRight: 24,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const ButtonContainer = styled.div(() => ({
  padding: "16px 24px",
  display: "flex",
  gap: 16,
  alignItems: "center",
  justifyContent: "end",
}));

const SideBar = styled.div({
  padding: "20px 16px",
  borderRight: `1px solid ${theme.palette.neutral[100]}`,
  display: "flex",
  flexDirection: "column",
  gap: 10,
});

const Title = styled.div(() => ({
  ...theme.typography.caption.sm.medium,
  color: theme.palette.neutral[400],
}));

const DateValue = styled.div(() => ({
  ...theme.typography.paragraph.md.regular,
  color: theme.palette.neutral[900],
  borderBottom: `1px solid ${theme.palette.neutral[900]}`,
}));

const Container = styled.div(() => ({
  display: "flex",
}));

const DateHeader = styled.div(() => ({
  display: "flex",
  gap: 24,
}));

interface CalendarProps {
  value: [Date, Date] | undefined;
  onChange: (value: [Date, Date] | undefined) => void;
  open: boolean;
  onClose?: () => void;
  anchorEl?: HTMLElement | null;
  placement?: Placement;
  monthsShown?: number;
  isResetAllow?: boolean;
}

const DATE_DISPLAY_FORMAT = "DD MMM YYYY";

const CalenderRange: FC<CalendarProps> = ({
  value,
  onChange,
  open,
  anchorEl,
  onClose,
  placement = "bottom",
  monthsShown,
  isResetAllow = true,
}) => {
  const [startDate, setStartDate] = useState<Date | undefined>(
    value ? value[0] : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    value ? dayjs(value[1]).toDate() : undefined
  );

  useEffect(() => {
    setStartDate(value ? value[0] : undefined);
    setEndDate(value ? dayjs(value[1]).toDate() : undefined);
  }, [value]);

  const onCloseHandler = onClose ? onClose : () => {};

  const handleApply = () => {
    if (startDate && endDate) {
      onChange([startDate, dayjs(endDate).toDate()]);
    } else if (startDate) {
      onChange([startDate, startDate]);
    } else {
      onChange(undefined);
    }
    onCloseHandler();
  };

  const HeaderContainer: FC<HeaderContainerProps> = ({ className, children }) => {
    const startDateStr = startDate
      ? dayjs(startDate).format(DATE_DISPLAY_FORMAT)
      : "";
    const endDateStr = endDate
      ? dayjs(endDate).format(DATE_DISPLAY_FORMAT)
      : "";

    return (
      <RootContainer placement={placement}>
        <CalendarContainer className={className}>
          <Container>
            <SideBar>
              <MUIButton
                variant="outlined"
                onClick={() => {
                  setStartDate(startOfToday.toDate());
                  setEndDate(startOfToday.toDate());
                }}
                size="small"
              >
                Today
              </MUIButton>
              <MUIButton
                variant="outlined"
                onClick={() => {
                  setStartDate(startOfYesterday.toDate());
                  setEndDate(startOfYesterday.toDate());
                }}
                size="small"
              >
                Yesterday
              </MUIButton>
              <MUIButton
                variant="outlined"
                onClick={() => {
                  setStartDate(startOfThisWeek.toDate());
                  setEndDate(endOfThisWeek.toDate());
                }}
                size="small"
              >
                This Week
              </MUIButton>
              <MUIButton
                variant="outlined"
                onClick={() => {
                  setStartDate(startOfPrevWeek.toDate());
                  setEndDate(endOfPrevWeek.toDate());
                }}
                size="small"
              >
                Last Week
              </MUIButton>
              <MUIButton
                variant="outlined"
                onClick={() => {
                  setStartDate(startOfThisMonth.toDate());
                  setEndDate(endofThisMonth.toDate());
                }}
                size="small"
              >
                This Month
              </MUIButton>
              <MUIButton
                variant="outlined"
                onClick={() => {
                  setStartDate(startOfLastMonth.toDate());
                  setEndDate(endOfLastMonth.toDate());
                }}
                size="small"
              >
                Last Month
              </MUIButton>
              <MUIButton
                variant="outlined"
                onClick={() => {
                  setStartDate(startOfThisYear.toDate());
                  setEndDate(endOfThisYear.toDate());
                }}
                size="small"
              >
                This Year
              </MUIButton>
              <MUIButton
                variant="outlined"
                onClick={() => {
                  setStartDate(startOfLastYear.toDate());
                  setEndDate(endOfLastYear.toDate());
                }}
                size="small"
              >
                Last Year
              </MUIButton>
              {isResetAllow && (
                <MUIButton
                  variant="outlined"
                  onClick={() => {
                    setStartDate(undefined);
                    setEndDate(undefined);
                  }}
                  size="small"
                >
                  All Time
                </MUIButton>
              )}
            </SideBar>

            <div className="calendar-picker">
              <HeaderIcon>
                <DateHeader>
                  <div>
                    <Title>FROM</Title>
                    <DateValue>{startDateStr}</DateValue>
                  </div>
                  <div>
                    <Title>TO</Title>
                    <DateValue>{endDateStr}</DateValue>
                  </div>
                </DateHeader>
                <MUIIconButton onClick={onCloseHandler} size="small">
                  <ClearIcon />
                </MUIIconButton>
              </HeaderIcon>
              {children}
            </div>
          </Container>
        </CalendarContainer>
      </RootContainer>
    );
  };

  const handleChange = (date: Date | [Date | null, Date | null] | null) => {
    if (Array.isArray(date)) {
      setStartDate(date[0] || undefined);
      setEndDate(date[1] || undefined);
    } else if (date) {
      setStartDate(date);
    }
  };

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement={`${placement}-start`}
      style={{ zIndex: 1400 }}
    >
      <DatePicker
        onChange={handleChange}
        calendarContainer={HeaderContainer}
        renderCustomHeader={(props) => (
          <Header {...props} startDate={startDate} />
        )}
        shouldCloseOnSelect={false}
        inline
        startDate={startDate}
        endDate={endDate}
        selectsRange={true}
        onClickOutside={onClose}
        monthsShown={monthsShown}
        fixedHeight
      >
        <ButtonContainer>
          <MUIButton onClick={handleApply} variant="contained" size="small">
            Apply
          </MUIButton>
          <MUIButton onClick={onCloseHandler} size="small" variant="outlined">
            Cancel
          </MUIButton>
        </ButtonContainer>
      </DatePicker>
    </Popper>
  );
};

export default CalenderRange;