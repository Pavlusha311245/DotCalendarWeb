import {addYears} from 'date-fns';
import {getDateOfBirth, initStorage, setDateOfBirth} from "./utils/storage.ts";
import {
    calculatePassedAndRemainingWeeks,
    calculateWeeksInYears, getRangeOfYears,
    WeeksInfo,
    YearWeeks
} from "./utils/date-calculation.ts";
import {isOnboardingComplete, startOnboarding} from "./utils/onboarding.ts";
import './components/calendar-dot.ts'
import {renderCurrentYearLink, renderYearsList} from "./utils/render.ts";

const handleDobChange = (): void => {
    const maxDate: string = new Date().toISOString().split("T")[0];
    if (dateOfBirthInput.value > maxDate) {
        dateOfBirthInput.value = maxDate
    }

    const years = getRangeOfYears();

    const dateOfBirth: Date = new Date(dateOfBirthInput.value);
    setDateOfBirth(dateOfBirthInput.value)
    const endDate: Date = addYears(dateOfBirth, 100);
    const nowDate: Date = new Date();
    const yearsAndWeeks: YearWeeks[] = calculateWeeksInYears(years.startYear, endDate);

    renderYearsList(yearsAndWeeks, nowDate, dateOfBirth);

    const weeksInfo: WeeksInfo = calculatePassedAndRemainingWeeks(yearsAndWeeks, nowDate);
    (document.getElementById('passedWeeks') as HTMLSpanElement).textContent = `${weeksInfo.passedWeeks}`;
    (document.getElementById('remainingWeeks') as HTMLSpanElement).textContent = `${weeksInfo.remainingWeeks}`;
};

const dateOfBirthInput: HTMLInputElement = document.getElementById('date-of-birth') as HTMLInputElement;
dateOfBirthInput.addEventListener('change', handleDobChange);
dateOfBirthInput.max = new Date().toISOString().split("T")[0];

const deleteDateOfBirthButton: HTMLButtonElement = document.getElementById('delete-dob') as HTMLButtonElement;
deleteDateOfBirthButton.addEventListener('click', (): void => {
    dateOfBirthInput.value = '';
    setDateOfBirth('');

    const years = getRangeOfYears();
    renderYearsList(calculateWeeksInYears(years.startYear, years.endYear), new Date(years.currentYear), null);
});

window.onload = function (): void {
    if (!isOnboardingComplete()) {
        startOnboarding();
    }

    initStorage()
    renderCurrentYearLink();

    const years = getRangeOfYears();
    renderYearsList(calculateWeeksInYears(years.startYear, years.endYear), new Date(years.currentYear), null);

    const storedDateOfBirth: string | null = getDateOfBirth();
    if (storedDateOfBirth) {
        dateOfBirthInput.value = storedDateOfBirth;
        handleDobChange();
    }
};