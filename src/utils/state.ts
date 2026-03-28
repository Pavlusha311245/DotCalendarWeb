import type { YearWeeks } from './date-calculation.ts';

interface AppState {
    showPastYears: boolean;
    yearsAndWeeks: YearWeeks[];
    nowDate: Date;
    dateOfBirth: Date | null;
}

const state: AppState = {
    showPastYears: false,
    yearsAndWeeks: [],
    nowDate: new Date(),
    dateOfBirth: null,
};

export const getState = (): Readonly<AppState> => ({ ...state });

export const setState = (partial: Partial<AppState>): void => {
    Object.assign(state, partial);
};
