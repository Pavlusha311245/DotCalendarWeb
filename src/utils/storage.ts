/**
 * Key used for storing date of birth.
 */
const dateOfBirthKey = 'dob';

/**
 * Initializes the storage system.
 */
export const initStorage = (): void => {
    console.info('Storage initialized')
};


/**
 * Gets the date of birth from storage.
 */
export const getDateOfBirth: () => string | null = (): string | null => {
    return localStorage.getItem(dateOfBirthKey);
}

/**
 * Sets the date of birth in storage.
 *
 * @param dob
 */
export const setDateOfBirth: (dob: string) => void = (dob: string): void => {
    localStorage.setItem(dateOfBirthKey, dob);
}

/**
 * Gets the note for a specific week.
 *
 * @param weekId
 */
export const getWeekNote: (weekId: string) => string = (weekId: string): string => {
    return localStorage.getItem(weekId) || "";
}

/**
 * Sets the note for a specific week.
 *
 * @param weekId
 * @param note
 */
export const setWeekNote: (weekId: string, note: string) => void = (weekId: string, note: string): void => {
    localStorage.setItem(weekId, note);
}