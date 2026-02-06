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
import './components/dob-input.ts'
import './components/note-dialog.ts'
import {renderCurrentYearLink, renderYearsList} from "./utils/render.ts";

const getDobInputComponent = (): HTMLElement | null => {
    return document.querySelector('dob-input');
};

const handleDobChange = (): void => {
    const dobComponent = getDobInputComponent();
    if (!dobComponent) return;

    const dobInput = (dobComponent as any).getValue?.() || '';
    const maxDate: string = new Date().toISOString().split("T")[0];

    if (dobInput > maxDate) {
        (dobComponent as any).setValue?.(maxDate);
    }

    const years = getRangeOfYears();

    const dateOfBirth: Date = new Date(dobInput);
    setDateOfBirth(dobInput);
    const endDate: Date = addYears(dateOfBirth, 100);
    const nowDate: Date = new Date();
    const yearsAndWeeks: YearWeeks[] = calculateWeeksInYears(years.startYear, endDate);

    renderYearsList(yearsAndWeeks, nowDate, dateOfBirth);

    const weeksInfo: WeeksInfo = calculatePassedAndRemainingWeeks(yearsAndWeeks, nowDate);
    (document.getElementById('passedWeeks') as HTMLSpanElement).textContent = `${weeksInfo.passedWeeks}`;
    (document.getElementById('remainingWeeks') as HTMLSpanElement).textContent = `${weeksInfo.remainingWeeks}`;
};

const setupDobInputListeners = (): void => {
    const dobComponent = getDobInputComponent();
    if (!dobComponent) return;

    const maxDate: string = new Date().toISOString().split("T")[0];
    (dobComponent as any).setMax?.(maxDate);

    dobComponent.addEventListener('dob-change', handleDobChange);
    dobComponent.addEventListener('dob-delete', (): void => {
        (dobComponent as any).clear?.();
        setDateOfBirth('');

        const years = getRangeOfYears();
        renderYearsList(calculateWeeksInYears(years.startYear, years.endYear), new Date(years.currentYear), null);
    });
};

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

// Handle dot clicks - allow opening notes for old weeks
document.addEventListener('dot:click', (event: Event): void => {
    const customEvent = event as CustomEvent;
    const week = customEvent.detail?.week;
    if (!week) return;

    const noteDialog = document.querySelector('dialog[is="note-dialog"]') as HTMLDialogElement;
    if (noteDialog && 'open' in noteDialog) {
        (noteDialog as any).setWeek?.(week);
        (noteDialog as any).loadNote?.();
        noteDialog.showModal?.();
    }
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
    const dobComponent = getDobInputComponent();

    if (storedDateOfBirth && dobComponent) {
        (dobComponent as unknown).setValue?.(storedDateOfBirth);
        handleDobChange();
    }

    // Setup DOB input listeners after component is loaded
    setTimeout(() => setupDobInputListeners(), 100);
};