import { differenceInWeeks, eachYearOfInterval, getISOWeeksInYear, startOfWeek } from "date-fns";

/**
 * Represents the number of weeks in a specific year.
 */
export type YearWeeks = {
  year: number;
  weeksCount: number;
};

/**
 * Represents information about total, passed, and remaining weeks.
 */
export type WeeksInfo = {
  totalWeeks: number;
  passedWeeks: number;
  remainingWeeks: number;
};

/**
 * Represents a range of years with start, current, and end year as Date objects.
 */
export type RangeOfYears = {
  startYear: Date;
  currentYear: Date;
  endYear: Date;
};

/**
 * Gets a range of years spanning from 100 years before the current year to 100 years after.
 *
 * @returns An object containing the start year, current year, and end year as Date objects.
 */
export const getRangeOfYears: () => RangeOfYears = (): RangeOfYears => {
  const currentYear: number = new Date().getFullYear();

  return {
    startYear: new Date(currentYear - 100, 0, 1),
    currentYear: new Date(),
    endYear: new Date(currentYear + 100, 11, 31),
  };
};

/**
 * Calculates the number of weeks in each year within a specified date range.
 *
 * @param startDate
 * @param endDate
 */
export const calculateWeeksInYears = (startDate: Date, endDate: Date): YearWeeks[] => {
  const years = eachYearOfInterval({ start: startDate, end: endDate });

  return years.map((yearDate) => ({
    year: yearDate.getFullYear(),
    weeksCount: getISOWeeksInYear(yearDate),
  }));
};

/**
 * Calculates the total number of weeks, passed weeks, and remaining weeks
 * based on the provided years and weeks data and the current date.
 *
 * @param yearsAndWeeks
 * @param currentDate
 */
export const calculatePassedAndRemainingWeeks = (
  yearsAndWeeks: YearWeeks[],
  currentDate: Date,
): WeeksInfo => {
  const currentYear = currentDate.getFullYear();
  const startOfCurrentYear = startOfWeek(new Date(currentYear, 0, 1));

  const totalWeeks = yearsAndWeeks.reduce((sum, { weeksCount }) => sum + weeksCount, 0);

  const passedWeeks = yearsAndWeeks.reduce((sum, { year, weeksCount }) => {
    if (year < currentYear) return sum + weeksCount;
    if (year === currentYear) return sum + differenceInWeeks(currentDate, startOfCurrentYear);
    return sum;
  }, 0);

  return { totalWeeks, passedWeeks, remainingWeeks: totalWeeks - passedWeeks };
};
