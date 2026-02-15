export const onboardingScreen1: HTMLElement = (() => {
    const template: HTMLTemplateElement = document.createElement('template');

    template.innerHTML = `
  <div id="onboarding-screen-1"
       class="px-10 text-slate-50 fixed w-full h-screen top-0 left-0 flex flex-col justify-center items-center glass overlay text-center">
      <div class="w-full">
          <h2 class="text-2xl font-bold">Your life in weeks</h2>
          <p class="mt-3">
              You enter your date of birth.<br>
              DotCalendar shows 100 years of life, divided into weeks.<br>
              Each <span class="text-emerald-300">dot</span> represents a week.
          </p>
          <div class="flex gap-3 items-center mt-5 max-w-sm mx-auto w-full justify-center">
              <div class="w-full flex gap-1">
                  <div class="dot dot-sm dot-red"></div>
                  <div class="dot dot-sm dot-red"></div>
                  <div class="dot dot-sm dot-red"></div>
                  <div class="dot dot-sm dot-red"></div>
                  <div class="dot dot-sm dot-red"></div>
              </div>
              <span>—</span>
              <p class="w-full">weeks lived</p>
          </div>
          <div class="flex gap-3 items-center mt-3 max-w-sm mx-auto w-full justify-center">
              <div class="w-full flex gap-1">
                  <div class="dot dot-sm dot-green"></div>
                  <div class="dot dot-sm dot-green"></div>
                  <div class="dot dot-sm dot-green"></div>
                  <div class="dot dot-sm dot-green"></div>
                  <div class="dot dot-sm dot-green"></div>
              </div>
              <span>—</span>
              <p class="w-full">weeks remaining</p>
          </div>
          <div>
              <button id="onboarding-screen-1-next" class="btn-glass mt-8">Next</button>
          </div>
        </div>
  </div>`;

    return template.content.firstElementChild as HTMLElement;
})();
