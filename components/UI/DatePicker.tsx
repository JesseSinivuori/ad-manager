"use client";
import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

type DatePickerProps = {
  label: string;
  onChange: (newValue: Dayjs | null) => void;
  initialValue: Dayjs | null;
};

export default function DatePickerValue(props: DatePickerProps) {
  const { label, onChange, initialValue } = props;
  const [value, setValue] = React.useState<Dayjs | null>(initialValue);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={dayjs(value)}
        onChange={(newValue) => {
          setValue(newValue);
          onChange(newValue);
        }}
      />
    </LocalizationProvider>
  );
}
