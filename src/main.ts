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

    const startDate: Date = new Date(dateOfBirthInput.value);
    setDateOfBirth(dateOfBirthInput.value)
    const endDate: Date = addYears(startDate, 100);
    const nowDate: Date = new Date();
    const yearsAndWeeks: YearWeeks[] = calculateWeeksInYears(startDate, endDate);

    renderYearsList(yearsAndWeeks, nowDate, startDate);

    const weeksInfo: WeeksInfo = calculatePassedAndRemainingWeeks(yearsAndWeeks, nowDate);
    (document.getElementById('passedWeeks') as HTMLSpanElement).textContent = `${weeksInfo.passedWeeks}`;
    (document.getElementById('remainingWeeks') as HTMLSpanElement).textContent = `${weeksInfo.remainingWeeks}`;
};

const dateOfBirthInput: HTMLInputElement = document.getElementById('date-of-birth') as HTMLInputElement;
dateOfBirthInput.addEventListener('change', handleDobChange);
dateOfBirthInput.max = new Date().toISOString().split("T")[0];

window.onload = function (): void {
    if (!isOnboardingComplete()) {
        startOnboarding();
    }

    initStorage()
    renderCurrentYearLink();

    const years = getRangeOfYears();
    const yearsAndWeeks: YearWeeks[] = calculateWeeksInYears(years.startYear, years.endYear);

    renderYearsList(yearsAndWeeks, new Date(years.currentYear), null);

    const storedDateOfBirth: string | null = getDateOfBirth();
    if (storedDateOfBirth) {
        dateOfBirthInput.value = storedDateOfBirth;
        handleDobChange();
    }
};