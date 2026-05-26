export const onboardingScreen2: HTMLElement = (() => {
  const template = document.createElement("template");
  const maxDate = new Date().toISOString().split("T")[0];

  template.innerHTML = `
  <div id="onboarding-screen-2"
         class="px-10 text-slate-50 fixed w-full h-screen top-0 left-0 flex flex-col justify-center items-center glass overlay">
        <h2 class="text-xl font-bold text-center">One week — one note.</h2>

        <p class="mt-5 w-full max-w-md">
            For each week you can leave a thought,<br>
            an event, or a decision.
        </p>

        <p class="mt-3 w-full max-w-md">
            Over time this becomes a map of your life,<br>
            not just a counter of weeks lived.
        </p>

        <div class="mt-8 w-full max-w-sm flex flex-col gap-2">
            <label for="onboarding-dob" class="text-sm font-medium" style="color: var(--color-text-light);">
                Your date of birth <span aria-hidden="true" style="color: var(--color-bright-blue);">*</span>
            </label>
            <input type="date"
                   id="onboarding-dob"
                   class="input-glass w-full text-sm"
                   max="${maxDate}"
                   required
                   aria-label="Date of birth"
                   aria-required="true"
                   aria-describedby="onboarding-dob-error">
            <p id="onboarding-dob-error"
               class="text-xs"
               style="color: var(--color-bright-blue); display: none;"
               aria-live="polite">
                Please enter your date of birth to continue.
            </p>
        </div>

        <div>
            <button id="onboarding-screen-2-got-it" class="btn-glass mt-6" type="button" disabled
                    style="opacity: 0.4; cursor: not-allowed;">
                Get started
            </button>
        </div>
    </div>`;

  return template.content.firstElementChild as HTMLElement;
})();
