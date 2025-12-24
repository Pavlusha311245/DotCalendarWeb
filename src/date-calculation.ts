import {differenceInWeeks, endOfWeek, startOfWeek} from "date-fns";

export type YearWeeks = {
    year: number;
    weeksCount: number;
};

export type WeeksInfo = {
    totalWeeks: number;
    passedWeeks: number;
    remainingWeeks: number;
}

const calculateYearWeeks = (year: number): YearWeeks => {
    const startOfYear: Date = startOfWeek(new Date(year, 0, 1));
    const endOfYear: Date = endOfWeek(new Date(year, 11, 31));
    const weeksCount: number = differenceInWeeks(endOfYear, startOfYear);
    return {year, weeksCount};
};

export const calculateWeeksInYears = (startDate: Date, endDate: Date): YearWeeks[] => {
    const years: number[] = Array.from(
        {length: endDate.getFullYear() - startDate.getFullYear() + 1},
        (_, idx) => idx + startDate.getFullYear()
    );
    return years.map(calculateYearWeeks);
};

export const calculatePassedAndRemainingWeeks = (yearsAndWeeks: YearWeeks[], currentDate: Date): WeeksInfo => {
    let totalWeeks: number = 0;
    let passedWeeks: number = 0;
    for (const yearData of yearsAndWeeks) {
        totalWeeks += yearData.weeksCount;
        if (yearData.year < currentDate.getFullYear()) {
            passedWeeks += yearData.weeksCount;
        } else if (yearData.year == currentDate.getFullYear()) {
            const startOfYear = startOfWeek(new Date(yearData.year, 0, 1));
            passedWeeks += differenceInWeeks(currentDate, startOfYear);
        }
    }
    return {totalWeeks, passedWeeks, remainingWeeks: totalWeeks - passedWeeks};
};