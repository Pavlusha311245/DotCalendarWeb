export const onboardingScreen2: HTMLElement = (() => {
    const template = document.createElement('template');

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

        <div>
            <button id="onboarding-screen-2-got-it" class="btn-glass mt-8">Got it!</button>
        </div>
    </div>`;

    return template.content.firstElementChild as HTMLElement;
})();
