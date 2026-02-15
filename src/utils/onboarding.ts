import {getOnboardingStatus, setOnboardingStatus} from "./storage.ts";
import {onboardingScreen1} from "../components/onboarding/screen1.ts";
import {onboardingScreen2} from "../components/onboarding/screen2.ts";

/**
 * Checks if the onboarding process has been completed.
 *
 * @returns {boolean} True if onboarding is complete, false otherwise.
 */
export const isOnboardingComplete: () => boolean = (): boolean => {
    return getOnboardingStatus();
};

/**
 * Starts the onboarding process by displaying onboarding screens sequentially.
 */
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
            setOnboardingStatus(true)
        });
    });
}