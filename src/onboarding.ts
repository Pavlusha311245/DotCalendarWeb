import {getDateOfBirth} from "./storage.ts";

export const isOnboardingComplete: () => boolean = (): boolean => {
    const dob: string | null = getDateOfBirth();
    return dob !== null && dob !== '';
}