const dateOfBirthKey = "dob";

export const initStorage = (): void => {
  console.info("Storage initialized");
};

export const getDateOfBirth = (): string | null => {
  return localStorage.getItem(dateOfBirthKey);
};

export const setDateOfBirth = (dob: string): void => {
  localStorage.setItem(dateOfBirthKey, dob);
};

export const getWeekNote = (weekId: string): string => {
  return localStorage.getItem(weekId) ?? "";
};

export const setWeekNote = (weekId: string, note: string): void => {
  localStorage.setItem(weekId, note);
};

export const hasWeekNote = (weekId: string): boolean => {
  const note = localStorage.getItem(weekId);
  return note != null && note.trim().length > 0;
};

export const getOnboardingStatus = (): boolean => {
  return localStorage.getItem("onboardingComplete") === "true";
};

export const setOnboardingStatus = (status: boolean): void => {
  localStorage.setItem("onboardingComplete", status.toString());
};
