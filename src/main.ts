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
import './components/note-dialog.ts'
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

// Theme toggle
const initTheme = (): void => {
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
};

const updateThemeIcon = (theme: string): void => {
    const sunCircle = document.getElementById('sun-circle') as HTMLElement | null;
    const sunRays = document.getElementById('sun-rays') as HTMLElement | null;
    const moon = document.getElementById('moon') as HTMLElement | null;

    if (!sunCircle || !sunRays || !moon) return;

    if (theme === 'light') {
        sunCircle.style.display = 'none';
        sunRays.style.display = 'none';
        moon.style.display = 'block';
    } else {
        sunCircle.style.display = 'block';
        sunRays.style.display = 'block';
        moon.style.display = 'none';
    }
};

const themeToggleButton: HTMLButtonElement = document.getElementById('theme-toggle') as HTMLButtonElement;
themeToggleButton.addEventListener('click', (): void => {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

window.onload = function (): void {
    initTheme();

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