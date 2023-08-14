"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "./Button";
import DatePicker from "./DatePicker";
import React, {
  Fragment,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { button } from "@/app/style";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import MUIThemeProvider from "./MUIThemeProvider";

interface Field {
  value: string;
  title: string;
}

interface DialogProps<T extends Record<string, Field>> {
  buttonText: string;
  show: boolean;
  setShow: React.Dispatch<SetStateAction<boolean>>;
  handleClick: () => void;
  values: T;
  /** 'T' is a Record type where the keys are string and values are of type 'Field'. 
  The 'Field' type is an object with properties 'value' and 'title', both of type string.
  So, 'T' is an object where each property is a key-value pair, 
  with the key being a string (representing a field name) and the value being an object of type 'Field'. 
  Here's an example of what 'T' could look like:
  {
    "name": {
      "value": "Campaign 1",
      "title": "Name"
    },
    "startDate": {
      "value": "2023-01-01",
      "title": "Start Date"
    },
    // more fields here...
    For each T there will be a field in the dialog
    If the key contains "date" like "startDate" then the input is a date input automatically
  } */
  setValues: React.Dispatch<React.SetStateAction<T>>;
}

export default function DialogComponent<T extends Record<string, Field>>(
  props: DialogProps<T>
) {
  const { show, setShow, handleClick, setValues, values, buttonText } = props;

  const inputRef = useRef(null);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleButtonClick = () => {
    setIsSubmitted(true);
    if (Object.values(values).every((field) => field.value.trim() !== "")) {
      handleClick();
      setShow(false);
    }
  };

  useEffect(() => {
    if (show) {
      setIsSubmitted(false);
    }
  }, [show]);

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: string,
    value: Field
  ) => {
    const regex = /^[0-9\b]+$/;
    if (e.target.value === "" || regex.test(e.target.value)) {
      setValues({
        ...values,
        [key]: { ...values[key], value: e.target.value },
      });
    }
  };

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={() => setShow(false)}
        initialFocus={inputRef}
      >
        <div className="min-h-screen px-4 text-center ">
          <Dialog.Overlay
            className={`fixed inset-0 bg-stone-950/50 opacity-30 
              `}
          />

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Dialog.Panel
            className={`"bg-zinc-100 my-8 inline-block max-w-md transform
          overflow-hidden rounded-2xl  p-4 text-left align-middle 
          shadow-xl transition-all bg-stone-50
          `}
          >
            {Object.entries(values).map(([key, value]) => (
              <label htmlFor={value.title} key={value.title}>
                <div className="flex flex-col p-4 ">
                  {key.toLowerCase().includes("date") ? (
                    <MUIThemeProvider>
                      <DatePicker
                        label={value.title}
                        initialValue={dayjs(value.value)}
                        onChange={(newDate) =>
                          setValues({
                            ...values,
                            [key]: {
                              ...values[key],
                              value: dayjs(newDate)
                                .toDate()
                                .toLocaleDateString(),
                            },
                          })
                        }
                      />
                    </MUIThemeProvider>
                  ) : key.toLowerCase().includes("number") ? (
                    <MUIThemeProvider>
                      <TextField
                        id={value.title}
                        label={value.title}
                        value={value.value}
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                        type="text"
                        onChange={(e) => handleNumberChange(e, key, value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleButtonClick();
                          }
                        }}
                        ref={inputRef.current}
                        error={isSubmitted && value.value === ""}
                        helperText={
                          isSubmitted && value.value === ""
                            ? "This field is required"
                            : ""
                        }
                      />
                    </MUIThemeProvider>
                  ) : (
                    <MUIThemeProvider>
                      <TextField
                        id={value.title}
                        label={value.title}
                        value={value.value}
                        type="text"
                        onChange={(e) =>
                          setValues({
                            ...values,
                            [key]: { ...values[key], value: e.target.value },
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleButtonClick();
                          }
                        }}
                        ref={inputRef.current}
                        error={isSubmitted && value.value === ""}
                        helperText={
                          isSubmitted && value.value === ""
                            ? "This field is required"
                            : ""
                        }
                      />
                    </MUIThemeProvider>
                  )}
                </div>
              </label>
            ))}
            <div className="flex justify-center pt-8">
              <Button
                type="submit"
                onClick={() => {
                  handleButtonClick();
                }}
                className={`${button.violet} w-full`}
              >
                {buttonText}
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
