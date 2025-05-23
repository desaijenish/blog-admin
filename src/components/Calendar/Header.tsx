import styled from "@emotion/styled";
import dayjs from "dayjs";
import { useEffect } from "react";
import { ReactDatePickerCustomHeaderProps } from "react-datepicker";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const IconContainer = styled.div(() => ({
  backgroundColor: "#ffffff",
  display: "flex",
  alignItems: "center",
  gap: 24,
  justifyContent: "space-between",
  marginBottom: 10,
}));

interface HeaderProps extends ReactDatePickerCustomHeaderProps {
  startDate: Date | undefined;
}

const Header: React.FC<HeaderProps> = ({
  decreaseMonth,
  increaseMonth,
  monthDate,
  startDate,
  changeMonth,
  changeYear,
}) => {
  const month = dayjs(monthDate).month();
  const year = dayjs(monthDate).year();

  useEffect(() => {
    if (startDate) {
      const month = dayjs(startDate).month();
      const year = dayjs(startDate).year();
      changeMonth(month);
      changeYear(year);
    }
  }, [startDate, changeMonth, changeYear]);

  return (
    <IconContainer>
      <button onClick={decreaseMonth}>{"<"}</button>
      <div>{`${months[month]} ${year}`}</div>
      <button onClick={increaseMonth}>{">"}</button>
    </IconContainer>
  );
};

export default Header;
