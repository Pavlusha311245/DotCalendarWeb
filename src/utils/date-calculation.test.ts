import {describe, expect, test} from "bun:test";
import {
    calculatePassedAndRemainingWeeks,
    calculateWeeksInYears,
    getRangeOfYears,
    YearWeeks
} from "./date-calculation.ts";

describe("getRangeOfYears", () => {
    test("returns startYear 100 years before current year", () => {
        const currentYear = new Date().getFullYear();
        const { startYear } = getRangeOfYears();
        expect(startYear.getFullYear()).toBe(currentYear - 100);
    });

    test("returns endYear 100 years after current year", () => {
        const currentYear = new Date().getFullYear();
        const { endYear } = getRangeOfYears();
        expect(endYear.getFullYear()).toBe(currentYear + 100);
    });

    test("currentYear is today", () => {
        const today = new Date();
        const { currentYear } = getRangeOfYears();
        expect(currentYear.getFullYear()).toBe(today.getFullYear());
    });
});

describe("calculateWeeksInYears", () => {
    test("regular year 2023 has 52 ISO weeks", () => {
        const start = new Date(2023, 0, 1);
        const end = new Date(2023, 11, 31);
        const result = calculateWeeksInYears(start, end);
        expect(result).toHaveLength(1);
        expect(result[0].year).toBe(2023);
        expect(result[0].weeksCount).toBe(52);
    });

    test("long year 2020 has 53 ISO weeks", () => {
        const start = new Date(2020, 0, 1);
        const end = new Date(2020, 11, 31);
        const result = calculateWeeksInYears(start, end);
        expect(result[0].weeksCount).toBe(53);
    });

    test("long year 2015 has 53 ISO weeks", () => {
        const start = new Date(2015, 0, 1);
        const end = new Date(2015, 11, 31);
        const result = calculateWeeksInYears(start, end);
        expect(result[0].weeksCount).toBe(53);
    });

    test("returns correct number of years for a range", () => {
        const start = new Date(2020, 0, 1);
        const end = new Date(2024, 11, 31);
        const result = calculateWeeksInYears(start, end);
        expect(result).toHaveLength(5);
        expect(result[0].year).toBe(2020);
        expect(result[4].year).toBe(2024);
    });

    test("single year range returns one entry", () => {
        const start = new Date(2024, 0, 1);
        const end = new Date(2024, 11, 31);
        const result = calculateWeeksInYears(start, end);
        expect(result).toHaveLength(1);
    });
});

describe("calculatePassedAndRemainingWeeks", () => {
    test("all weeks in the future returns 0 passed weeks", () => {
        const futureYear = new Date().getFullYear() + 5;
        const yearsAndWeeks: YearWeeks[] = [{ year: futureYear, weeksCount: 52 }];
        const currentDate = new Date(futureYear - 1, 6, 1);
        const result = calculatePassedAndRemainingWeeks(yearsAndWeeks, currentDate);
        expect(result.passedWeeks).toBe(0);
        expect(result.remainingWeeks).toBe(52);
        expect(result.totalWeeks).toBe(52);
    });

    test("all weeks in the past returns all as passed", () => {
        const pastYear = 2000;
        const yearsAndWeeks: YearWeeks[] = [{ year: pastYear, weeksCount: 52 }];
        const currentDate = new Date(2025, 0, 1);
        const result = calculatePassedAndRemainingWeeks(yearsAndWeeks, currentDate);
        expect(result.passedWeeks).toBe(52);
        expect(result.remainingWeeks).toBe(0);
        expect(result.totalWeeks).toBe(52);
    });

    test("totalWeeks equals passedWeeks + remainingWeeks", () => {
        const yearsAndWeeks: YearWeeks[] = [
            { year: 2022, weeksCount: 52 },
            { year: 2023, weeksCount: 52 },
            { year: 2024, weeksCount: 53 },
        ];
        const currentDate = new Date(2023, 6, 1);
        const result = calculatePassedAndRemainingWeeks(yearsAndWeeks, currentDate);
        expect(result.passedWeeks + result.remainingWeeks).toBe(result.totalWeeks);
        expect(result.totalWeeks).toBe(157);
    });

    test("multi-year passed weeks accumulates correctly", () => {
        const yearsAndWeeks: YearWeeks[] = [
            { year: 2020, weeksCount: 53 },
            { year: 2021, weeksCount: 52 },
            { year: 2022, weeksCount: 52 },
        ];
        const currentDate = new Date(2022, 0, 1);
        const result = calculatePassedAndRemainingWeeks(yearsAndWeeks, currentDate);
        // 2020 (53) + 2021 (52) = 105 weeks fully passed, plus partial 2022
        expect(result.passedWeeks).toBeGreaterThanOrEqual(105);
        expect(result.totalWeeks).toBe(157);
    });

    test("passedWeeks never exceeds totalWeeks", () => {
        const yearsAndWeeks: YearWeeks[] = [
            { year: 2020, weeksCount: 53 },
            { year: 2021, weeksCount: 52 },
        ];
        const currentDate = new Date(2025, 6, 1);
        const result = calculatePassedAndRemainingWeeks(yearsAndWeeks, currentDate);
        expect(result.passedWeeks).toBeLessThanOrEqual(result.totalWeeks);
    });
});
