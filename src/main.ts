import {addWeeks, addYears} from 'date-fns';
import {getDateOfBirth, getWeekNote, initStorage, setDateOfBirth, setWeekNote} from "./utils/storage.ts";
import {
    calculatePassedAndRemainingWeeks,
    calculateWeeksInYears,
    WeeksInfo,
    YearWeeks
} from "./utils/date-calculation.ts";
import {isOnboardingComplete, startOnboarding} from "./utils/onboarding.ts";
import './components/calendar-dot.ts'

const dateOfBirthInput: HTMLInputElement = document.getElementById('date-of-birth') as HTMLInputElement;

const createElementWithClass = (
    tagName: string,
    className: string,
    textContent: string
): HTMLElement => {
    const element: HTMLElement = document.createElement(tagName);
    element.className = className;
    element.textContent = textContent;
    return element;
};

const generateDotElement = (
    year: number,
    weeksCount: number,
    dob: Date,
    currentDate: Date
): HTMLElement => {
    const divElement: HTMLElement = createElementWithClass('div', 'mt-2 flex w-full flex-wrap gap-1', '');

    for (let i: number = 0; i < weeksCount; i++) {
        const calendarDotElement = document.createElement('calendar-dot');
        calendarDotElement.setAttribute('week', `week-${year}-${i + 1}`);

        const weekDate: Date = addWeeks(new Date(year, 0, 1), i);

        if (weekDate < dob) {
            continue
        } else if (weekDate <= currentDate) {
            calendarDotElement.setAttribute('color', 'red');
            calendarDotElement.addEventListener('click', () => showWeekInfo(calendarDotElement.id));
        } else {
            calendarDotElement.setAttribute('color', 'green');
            calendarDotElement.addEventListener('click', () => showWeekInfo(calendarDotElement.id));
        }

        divElement.appendChild(calendarDotElement);
    }
    return divElement;
};

const showWeekInfo = (id: string) => {
    const dialog = document.getElementById("note-dialog") as HTMLDialogElement;
    const localStorageData: string = getWeekNote(id);

    const textarea = dialog.querySelector("textarea") as HTMLTextAreaElement;
    textarea!.value = localStorageData;

    dialog.querySelector('#save-note')?.addEventListener('click', () => {
        setWeekNote(id, textarea.value);
        dialog.close();
    })
    dialog.showModal();
}

const generateYearsList = (yearsAndWeeks: YearWeeks[], nowDate: Date, dob: Date): void => {
    const yearsList: HTMLElement = document.getElementById('yearsList') as HTMLElement;
    yearsList.innerHTML = '';

    const fragment: DocumentFragment = document.createDocumentFragment();

    yearsAndWeeks.forEach(({year, weeksCount}) => {
        const yearElement: HTMLElement = createElementWithClass('h2', 'text-stale-50 text-xl font-bold text-center w-12', year.toString());
        yearElement.id = `year${year}`;
        if (year === nowDate.getFullYear()) {
            yearElement.classList.add('text-emerald-400');
        }
        const flexDivElement: HTMLElement = generateDotElement(year, weeksCount, dob, nowDate);
        const outerDivElement: HTMLElement = createElementWithClass('div', 'flex gap-5 items-center', '');
        outerDivElement.append(yearElement, flexDivElement);

        fragment.appendChild(outerDivElement)
    });

    yearsList.appendChild(fragment)
};

const handleDobChange = (): void => {
    const maxDate: string = new Date().toISOString().split("T")[0];
    if (dateOfBirthInput.value > maxDate) {
        dateOfBirthInput.value = maxDate
    }

    const startDate: Date = new Date(dateOfBirthInput.value);
    setDateOfBirth(dateOfBirthInput.value)
    const endDate: Date = addYears(startDate, 100);
    const nowDate: Date = new Date();
    const yearsAndWeeks: YearWeeks[] = calculateWeeksInYears(startDate, endDate);

    generateYearsList(yearsAndWeeks, nowDate, startDate);

    const weeksInfo: WeeksInfo = calculatePassedAndRemainingWeeks(yearsAndWeeks, nowDate);

    (document.getElementById('passedWeeks') as HTMLSpanElement).textContent = `${weeksInfo.passedWeeks}`;
    (document.getElementById('remainingWeeks') as HTMLSpanElement).textContent = `${weeksInfo.remainingWeeks}`;
};

const generateCurrentYearLink = (): void => {
    const currentYear = new Date().getFullYear();

    const currentYearLink = document.getElementById('current-year') as HTMLLinkElement;
    currentYearLink.href = `#year${currentYear}`;
    currentYearLink.textContent = `${currentYear}`
}

window.onload = function (): void {
    if (!isOnboardingComplete()) {
        startOnboarding();
    }

    initStorage()

    dateOfBirthInput.addEventListener('change', handleDobChange);
    dateOfBirthInput.max = new Date().toISOString().split("T")[0];

    generateCurrentYearLink();

    const storedDateOfBirth: string | null = getDateOfBirth();
    if (storedDateOfBirth) {
        dateOfBirthInput.value = storedDateOfBirth;
        handleDobChange();
    }
};