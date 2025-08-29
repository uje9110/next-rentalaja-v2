import { useMemo, useState } from "react";

export const useBooking = () => {
  const date = new Date();
  const [currMonth, setCurrMonth] = useState<number>(date.getMonth());
  const [currYear, setCurrYear] = useState<number>(date.getFullYear());
  const [currDay, setCurrDay] = useState<number>(date.getDate()); // 👈 new

  // derive full date in ms from year, month, and day
  const currDateInMs = useMemo(
    () => new Date(currYear, currMonth, currDay).getTime(),
    [currYear, currMonth, currDay],
  );

  const lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate();
  const datesOfMonth: (number | null)[] = [];
  const startOfTheWeek = new Date(currYear, currMonth, 1).getDay();
  const hoursArr: number[] = [];
  const minutesArr: number[] = [];

  for (let dof: number = 0; dof < startOfTheWeek; dof++) {
    datesOfMonth.push(null);
  }
  for (let day: number = 1; day <= lastDateOfMonth; day++) {
    datesOfMonth.push(day);
  }
  for (let h = 0; h <= 24; h++) {
    if (h >= 7 && h < 21) {
      hoursArr.push(h);
    }
  }
  for (let m = 0; m < 60; m += 5) {
    minutesArr.push(m);
  }

  const handleDecreaseMonth = () => {
    setCurrMonth((prevMonth) => {
      if (prevMonth < 1) {
        // console.log(prevMonth);
        return 11;
      }
      return prevMonth - 1;
    });
  };

  const handleIncreaseMonth = () => {
    setCurrMonth((prevMonth) => {
      if (prevMonth > 10) {
        // console.log(prevMonth);
        return 0;
      }
      return prevMonth + 1;
    });
  };

  const handleIncreaseYear = () => {
    setCurrYear((prevYear) => {
      return prevYear + 1;
    });
  };

  const handleDecreaseYear = () => {
    setCurrYear((prevYear) => {
      return prevYear - 1;
    });
  };

  return {
    currMonth,
    setCurrMonth,
    currYear,
    setCurrYear,
    currDateInMs,
    lastDateOfMonth,
    datesOfMonth,
    startOfTheWeek,
    hoursArr,
    minutesArr,
    handleDecreaseMonth,
    handleIncreaseMonth,
    handleDecreaseYear,
    handleIncreaseYear,
    // rentalStartTimeInMs,
    // setRentalStartTimeInMs,
    // rentalEndTimeInMs,
    // setRentalEndTimeInMs,
  };
};
