import {getDateOfBirth} from "./storage.ts";
import {onboardingScreen1} from "../components/onboarding/screen1.ts";
import {onboardingScreen2} from "../components/onboarding/screen2.ts";

export const isOnboardingComplete: () => boolean = (): boolean => {
    const dob: string | null = getDateOfBirth();
    return dob !== null && dob !== '';
};

export const startOnboarding = (): void => {
    const mainContainer: HTMLElement = document.getElementById('content') as HTMLElement;
    mainContainer.appendChild(onboardingScreen1);

    const nextButton: HTMLElement = document.getElementById('onboarding-screen-1-next') as HTMLElement;
    nextButton.addEventListener('click', () => {
        onboardingScreen1.remove();
        mainContainer.appendChild(onboardingScreen2);

        const goItButton: HTMLButtonElement = document.getElementById('onboarding-screen-2-got-it') as HTMLButtonElement;
        goItButton.addEventListener('click', () => {
            onboardingScreen2.remove()
        });
    });
}