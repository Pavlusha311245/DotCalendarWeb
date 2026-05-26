import { getOnboardingStatus, setDateOfBirth, setOnboardingStatus } from "./storage.ts";
import { onboardingScreen1 } from "../components/onboarding/screen1.ts";
import { onboardingScreen2 } from "../components/onboarding/screen2.ts";
import { DOBInput } from "../components/dob-input.ts";

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
  const mainContainer: HTMLElement = document.getElementById("content") as HTMLElement;
  mainContainer.appendChild(onboardingScreen1);

  const nextButton: HTMLElement = document.getElementById(
    "onboarding-screen-1-next",
  ) as HTMLElement;
  nextButton.addEventListener("click", () => {
    onboardingScreen1.remove();
    mainContainer.appendChild(onboardingScreen2);

    const dobInput = document.getElementById("onboarding-dob") as HTMLInputElement;
    const errorEl = document.getElementById("onboarding-dob-error") as HTMLElement;
    const gotItButton = document.getElementById("onboarding-screen-2-got-it") as HTMLButtonElement;

    // Enable button only when a valid date is entered
    dobInput.addEventListener("input", () => {
      const hasValue = dobInput.value.length > 0;
      gotItButton.disabled = !hasValue;
      gotItButton.style.opacity = hasValue ? "1" : "0.4";
      gotItButton.style.cursor = hasValue ? "pointer" : "not-allowed";
      if (hasValue) errorEl.style.display = "none";
    });

    gotItButton.addEventListener("click", () => {
      if (!dobInput.value) {
        errorEl.style.display = "block";
        dobInput.focus();
        return;
      }

      // Save DOB to localStorage
      setDateOfBirth(dobInput.value);

      // Unlock the main section — only reachable via this validated code path
      const mainSection = document.getElementById("main-section") as HTMLElement | null;
      if (mainSection) mainSection.inert = false;

      onboardingScreen2.remove();
      setOnboardingStatus(true);

      // Update the dob-input component in the main UI and trigger re-render
      const dobComponent = document.querySelector<DOBInput>("dob-input");
      if (dobComponent) {
        dobComponent.setValue(dobInput.value);
        dobComponent.dispatchEvent(
          new CustomEvent("dob-change", { bubbles: true, composed: true }),
        );
      }
    });
  });
};
