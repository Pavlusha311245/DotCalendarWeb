const dateOfBirthKey = 'dob';

export const getDateOfBirth: () => string | null = (): string | null => {
    return localStorage.getItem(dateOfBirthKey);
}

export const setDateOfBirth: (dob: string) => void = (dob: string): void => {
    localStorage.setItem(dateOfBirthKey, dob);
}

export const getWeekNote: (weekId: string) => string = (weekId: string): string => {
    return localStorage.getItem(weekId) || "";
}

export const setWeekNote: (weekId: string, note: string) => void = (weekId: string, note: string): void => {
    localStorage.setItem(weekId, note);
}