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

interface DobInputElement extends HTMLElement {
    getValue?: () => string;
    setValue?: (value: string) => void;
    setMax?: (value: string) => void;
    clear?: () => void;
}

interface NoteDialogElement extends HTMLDialogElement {
    setWeek?: (week: unknown) => void;
    loadNote?: () => void;
}

// State to track whether past years are shown
let showPastYears: boolean = false;
let currentYearsAndWeeks: YearWeeks[] = [];
let currentNowDate: Date = new Date();
let currentDateOfBirth: Date | null = null;

const getDobInputComponent = (): DobInputElement | null => {
    return document.querySelector('dob-input');
};

const handleDobChange = (): void => {
    const dobComponent = getDobInputComponent();
    if (!dobComponent) return;

    const dobInput = dobComponent.getValue?.() || '';
    const maxDate: string = new Date().toISOString().split("T")[0];

    if (dobInput > maxDate) {
        dobComponent.setValue?.(maxDate);
    }

    const years = getRangeOfYears();

    const dateOfBirth: Date = new Date(dobInput);
    setDateOfBirth(dobInput);
    const endDate: Date = addYears(dateOfBirth, 100);
    const nowDate: Date = new Date();
    const yearsAndWeeks: YearWeeks[] = calculateWeeksInYears(years.startYear, endDate);

    // Store current state for button click handler
    currentYearsAndWeeks = yearsAndWeeks;
    currentNowDate = nowDate;
    currentDateOfBirth = dateOfBirth;
    showPastYears = false; // Reset to false when DOB changes

    renderYearsList(yearsAndWeeks, nowDate, dateOfBirth, showPastYears);
    setupShowPastYearsButton();

    const weeksInfo: WeeksInfo = calculatePassedAndRemainingWeeks(yearsAndWeeks, nowDate);
    (document.getElementById('passedWeeks') as HTMLSpanElement).textContent = `${weeksInfo.passedWeeks}`;
    (document.getElementById('remainingWeeks') as HTMLSpanElement).textContent = `${weeksInfo.remainingWeeks}`;
};

const setupShowPastYearsButton = (): void => {
    // Remove any existing listener by replacing the button
    const existingButton = document.getElementById('show-past-years-btn');
    if (existingButton) {
        const newButton = existingButton.cloneNode(true) as HTMLButtonElement;
        existingButton.parentNode?.replaceChild(newButton, existingButton);
        
        newButton.addEventListener('click', (): void => {
            showPastYears = true;
            renderYearsList(currentYearsAndWeeks, currentNowDate, currentDateOfBirth, showPastYears);
            setupShowPastYearsButton(); // Re-setup in case button needs to be removed
        });
    }
};

const setupDobInputListeners = (): void => {
    const dobComponent = getDobInputComponent();
    if (!dobComponent) return;

    const maxDate: string = new Date().toISOString().split("T")[0];
    dobComponent.setMax?.(maxDate);

    dobComponent.addEventListener('dob-change', handleDobChange);
    dobComponent.addEventListener('dob-delete', (): void => {
        dobComponent.clear?.();
        setDateOfBirth('');

        const years = getRangeOfYears();
        
        // Reset state when DOB is deleted
        currentYearsAndWeeks = calculateWeeksInYears(years.startYear, years.endYear);
        currentNowDate = new Date(years.currentYear);
        currentDateOfBirth = null;
        showPastYears = false;
        
        renderYearsList(currentYearsAndWeeks, currentNowDate, null, showPastYears);
        setupShowPastYearsButton();
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

    const noteDialog = document.querySelector('dialog[is="note-dialog"]') as NoteDialogElement | null;
    if (noteDialog && 'open' in noteDialog) {
        noteDialog.setWeek?.(week);
        noteDialog.loadNote?.();
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
    
    // Initialize state
    currentYearsAndWeeks = calculateWeeksInYears(years.startYear, years.endYear);
    currentNowDate = new Date(years.currentYear);
    currentDateOfBirth = null;
    showPastYears = false;
    
    renderYearsList(currentYearsAndWeeks, currentNowDate, null, showPastYears);
    setupShowPastYearsButton();

    const storedDateOfBirth: string | null = getDateOfBirth();
    const dobComponent = getDobInputComponent();

    if (storedDateOfBirth && dobComponent) {
        dobComponent.setValue?.(storedDateOfBirth);
        handleDobChange();
    }

    // Setup DOB input listeners after component is loaded
    setTimeout(() => setupDobInputListeners(), 100);
};