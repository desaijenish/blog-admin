// import React, { useState, useRef, useEffect } from "react";
// import {
//   TextField,
//   Box,
//   InputAdornment,
//   Button,
//   Popper,
//   IconButton,
//   MenuItem,
//   Select,
//   Typography,
// } from "@mui/material";
// import { CalendarToday, Clear, ArrowDropDown } from "@mui/icons-material";
// import dayjs from "dayjs";
// import "react-datepicker/dist/react-datepicker.css";
// import styled from "@emotion/styled";
// import isoWeek from "dayjs/plugin/isoWeek";
// import quarterOfYear from "dayjs/plugin/quarterOfYear";
// import DatePicker from "react-datepicker";

// dayjs.extend(isoWeek);
// dayjs.extend(quarterOfYear);

// type DateFilterType =
//   | "after"
//   | "before"
//   | "range"
//   | "single"
//   | "today-after"
//   | "today-before"
//   | "yesterday"
//   | "last-week"
//   | "custom";

// interface DatePickerValue {
//   date: string | null;
//   endDate?: string | null;
//   type: DateFilterType;
// }

// interface CustomDatePickerProps {
//   onDateSelect: (data: DatePickerValue) => void;
//   value?: DatePickerValue;
// }

// const CalendarContainerWrapper = styled.div`
//   background: white;
//   padding: 16px;
//   border-radius: 8px;
//   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//   display: flex;
//   flex-direction: column;
//   width: 350px;
// `;

// const ToggleContainer = styled.div`
//   display: flex;
//   justify-content: space-between;
//   gap: 8px;
//   margin: 8px 0;
//   align-items: center;
// `;

// const DateRangeDisplay = styled.div`
//   display: flex;
//   gap: 8px;
//   margin: 8px 0;
//   justify-content: center;
//   flex-wrap: wrap;
// `;

// const QuickOptionsContainer = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 8px;
//   margin: 12px 0;
// `;

// const QuickOptionButton = styled(Button)`
//   text-transform: none;
//   padding: 4px 8px;
//   font-size: 0.75rem;
// `;

// const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
//   onDateSelect,
//   value,
// }) => {
//   const [startDate, setStartDate] = useState<Date | undefined>(
//     value?.date ? new Date(value.date) : undefined
//   );
//   const [endDate, setEndDate] = useState<Date | undefined>(
//     value?.endDate ? new Date(value.endDate) : undefined
//   );
//   const [type, setType] = useState<DateFilterType>(value?.type || "after");
//   const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
//   const wrapperRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (value?.date) {
//       const date = new Date(value.date);
//       setStartDate(date);
//       if (value.endDate) {
//         setEndDate(new Date(value.endDate));
//       } else {
//         setEndDate(undefined);
//       }
//     } else {
//       setStartDate(undefined);
//       setEndDate(undefined);
//     }
//     setType(value?.type || "after");
//   }, [value]);

//   const handleInputClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleDateChange = (dates: [Date | null, Date | null]) => {
//     const [start, end] = dates;
//     setStartDate(start ? start : undefined);
//     setEndDate(end ? end : undefined);
//     setType(end ? "range" : "single");
//   };

//   const handleApply = () => {
//     if (type === "today-after" || type === "today-before" || type === "yesterday" || type === "last-week") {
//       onDateSelect({
//         date: null,
//         type,
//       });
//     } else if (startDate) {
//       onDateSelect({
//         date: startDate.toISOString(),
//         endDate: endDate?.toISOString(),
//         type,
//       });
//     } else {
//       onDateSelect({
//         date: null,
//         type: "after",
//       });
//     }
//     handleClose();
//   };

//   const handleClear = () => {
//     setStartDate(undefined);
//     setEndDate(undefined);
//     setType("after");
//     onDateSelect({
//       date: null,
//       type: "after",
//     });
//   };

//   const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
//     const newType = event.target.value as DateFilterType;
//     setType(newType);

//     // Reset dates when switching to non-custom types
//     if (newType !== "range" && newType !== "single" && newType !== "custom") {
//       setStartDate(undefined);
//       setEndDate(undefined);
//     }
//   };

//   const applyQuickOption = (optionType: DateFilterType) => {
//     setType(optionType);

//     switch (optionType) {
//       case "today-after":
//         setStartDate(new Date());
//         setEndDate(undefined);
//         break;
//       case "today-before":
//         setStartDate(new Date());
//         setEndDate(undefined);
//         break;
//       case "yesterday":
//         const yesterday = dayjs().subtract(1, 'day').toDate();
//         setStartDate(yesterday);
//         setEndDate(undefined);
//         break;
//       case "last-week":
//         const startOfLastWeek = dayjs().subtract(1, 'week').startOf('week').toDate();
//         const endOfLastWeek = dayjs().subtract(1, 'week').endOf('week').toDate();
//         setStartDate(startOfLastWeek);
//         setEndDate(endOfLastWeek);
//         break;
//       default:
//         break;
//     }
//   };

//   const formatDisplayDate = () => {
//     if (type === "today-after") return "Today or after";
//     if (type === "today-before") return "Today or before";
//     if (type === "yesterday") return "Yesterday";
//     if (type === "last-week") return "Last week";

//     if (startDate && endDate && startDate !== endDate) {
//       return `${dayjs(startDate).format("MMM D, YYYY")} - ${dayjs(endDate).format("MMM D, YYYY")}`;
//     } else if (startDate) {
//       return `${type === "before" ? "Before" : type === "after" ? "After" : "On"} ${dayjs(startDate).format("MMM D, YYYY")}`;
//     }
//     return "Select date";
//   };

//   return (
//     <Box>
//       <TextField
//         label="Due Date"
//         value={formatDisplayDate()}
//         onClick={handleInputClick}
//         fullWidth
//         InputProps={{
//           endAdornment: (
//             <InputAdornment position="end">
//               {startDate || type !== "after" ? (
//                 <IconButton onClick={handleClear} size="small">
//                   <Clear fontSize="small" />
//                 </IconButton>
//               ) : (
//                 <ArrowDropDown />
//               )}
//             </InputAdornment>
//           ),
//           readOnly: true,
//         }}
//       />

//       <Popper
//         open={Boolean(anchorEl)}
//         anchorEl={anchorEl}
//         placement="bottom-start"
//         style={{ zIndex: 1300 }}
//       >
//         <CalendarContainerWrapper ref={wrapperRef}>
//           <Box
//             display="flex"
//             justifyContent="space-between"
//             alignItems="center"
//             mb={2}
//           >
//             <Typography variant="subtitle1">Select Date Filter</Typography>
//             <IconButton onClick={handleClose} size="small">
//               <Clear />
//             </IconButton>
//           </Box>

//           <Select
//             value={type}
//             onChange={handleTypeChange}
//             fullWidth
//             size="small"
//             sx={{ mb: 2 }}
//           >
//             <MenuItem value="after">After</MenuItem>
//             <MenuItem value="before">Before</MenuItem>
//             <MenuItem value="range">Range</MenuItem>
//             <MenuItem value="single">Single Date</MenuItem>
//             <MenuItem value="custom">Custom</MenuItem>
//             <MenuItem value="today-after">Today or after</MenuItem>
//             <MenuItem value="today-before">Today or before</MenuItem>
//             <MenuItem value="yesterday">Yesterday</MenuItem>
//             <MenuItem value="last-week">Last week</MenuItem>
//           </Select>

//           {(type === "range" || type === "single" || type === "custom") && (
//             <>
//               <QuickOptionsContainer>
//                 <QuickOptionButton
//                   variant="outlined"
//                   size="small"
//                   onClick={() => applyQuickOption("today-after")}
//                 >
//                   Today
//                 </QuickOptionButton>
//                 <QuickOptionButton
//                   variant="outlined"
//                   size="small"
//                   onClick={() => applyQuickOption("yesterday")}
//                 >
//                   Yesterday
//                 </QuickOptionButton>
//                 <QuickOptionButton
//                   variant="outlined"
//                   size="small"
//                   onClick={() => applyQuickOption("last-week")}
//                 >
//                   Last Week
//                 </QuickOptionButton>
//               </QuickOptionsContainer>

//               <DateRangeDisplay>
//                 {startDate && (
//                   <Typography variant="body2">
//                     {type === "range" ? "Start:" : "Date:"} {dayjs(startDate).format("MMM D, YYYY")}
//                   </Typography>
//                 )}
//                 {endDate && startDate !== endDate && (
//                   <Typography variant="body2">
//                     End: {dayjs(endDate).format("MMM D, YYYY")}
//                   </Typography>
//                 )}
//               </DateRangeDisplay>

//               <DatePicker
//                 selected={startDate}
//                 onChange={handleDateChange}
//                 startDate={startDate}
//                 endDate={endDate}
//                 selectsRange={type === "range"}
//                 inline
//                 shouldCloseOnSelect={false}
//               />
//             </>
//           )}

//           <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
//             <Button variant="outlined" onClick={handleClose}>
//               Cancel
//             </Button>
//             <Button
//               variant="contained"
//               onClick={handleApply}
//               disabled={!startDate && !["today-after", "today-before", "yesterday", "last-week"].includes(type)}
//             >
//               Apply
//             </Button>
//           </Box>
//         </CalendarContainerWrapper>
//       </Popper>
//     </Box>
//   );
// };

// export default CustomDatePicker;

// import React from 'react'

const DateTimePickerFilter = () => {
  return <div>DateTimePickerFilter</div>;
};

export default DateTimePickerFilter;
