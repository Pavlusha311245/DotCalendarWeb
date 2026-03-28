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
import {getState, setState} from "./utils/state.ts";
import {DOBInput} from "./components/dob-input.ts";
import {NoteDialog} from "./components/note-dialog.ts";

const getDobInputComponent = (): DOBInput | null => {
    return document.querySelector('dob-input');
};

const handleDobChange = (): void => {
    const dobComponent = getDobInputComponent();
    if (!dobComponent) return;

    const dobInput = dobComponent.getValue() || '';
    const maxDate: string = new Date().toISOString().split("T")[0];

    if (dobInput > maxDate) {
        dobComponent.setValue(maxDate);
    }

    const years = getRangeOfYears();

    const dateOfBirth: Date = new Date(dobInput);
    setDateOfBirth(dobInput);
    const endDate: Date = addYears(dateOfBirth, 100);
    const nowDate: Date = new Date();
    const yearsAndWeeks: YearWeeks[] = calculateWeeksInYears(years.startYear, endDate);

    setState({
        yearsAndWeeks,
        nowDate,
        dateOfBirth,
        showPastYears: false,
    });

    renderYearsList(yearsAndWeeks, nowDate, dateOfBirth, false);
    setupShowPastYearsButton();

    const weeksInfo: WeeksInfo = calculatePassedAndRemainingWeeks(yearsAndWeeks, nowDate);
    const passedEl = document.getElementById('passedWeeks');
    const remainingEl = document.getElementById('remainingWeeks');
    if (passedEl) passedEl.textContent = `${weeksInfo.passedWeeks}`;
    if (remainingEl) remainingEl.textContent = `${weeksInfo.remainingWeeks}`;
};

let pastYearsBtnController: AbortController | null = null;

const setupShowPastYearsButton = (): void => {
    pastYearsBtnController?.abort();
    const button = document.getElementById('show-past-years-btn');
    if (!button) return;

    pastYearsBtnController = new AbortController();
    button.addEventListener('click', (): void => {
        setState({ showPastYears: true });
        const { yearsAndWeeks, nowDate, dateOfBirth } = getState();
        renderYearsList(yearsAndWeeks, nowDate, dateOfBirth, true);
        setupShowPastYearsButton();
    }, { signal: pastYearsBtnController.signal });
};

const setupDobInputListeners = (): void => {
    const dobComponent = getDobInputComponent();
    if (!dobComponent) return;

    const maxDate: string = new Date().toISOString().split("T")[0];
    dobComponent.setMax(maxDate);

    dobComponent.addEventListener('dob-change', handleDobChange);
    dobComponent.addEventListener('dob-delete', (): void => {
        dobComponent.clear();
        setDateOfBirth('');

        const years = getRangeOfYears();
        const yearsAndWeeks = calculateWeeksInYears(years.startYear, years.endYear);
        const nowDate = new Date(years.currentYear);

        setState({
            yearsAndWeeks,
            nowDate,
            dateOfBirth: null,
            showPastYears: false,
        });

        renderYearsList(yearsAndWeeks, nowDate, null, false);
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
    const sunCircle = document.getElementById('sun-circle');
    const sunRays = document.getElementById('sun-rays');
    const moon = document.getElementById('moon');

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

const themeToggleButton = document.getElementById('theme-toggle');
if (themeToggleButton) {
    themeToggleButton.addEventListener('click', (): void => {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

// Handle dot clicks via event delegation - opens notes for any week
document.addEventListener('dot:click', (event: Event): void => {
    const customEvent = event as CustomEvent;
    const week = customEvent.detail?.week;
    if (!week) return;

    const noteDialog = document.querySelector('dialog[is="note-dialog"]') as NoteDialog | null;
    if (noteDialog) {
        noteDialog.openNote(week);
    }
});

window.onload = function (): void {
    initTheme();

    if (!isOnboardingComplete()) {
        startOnboarding();
    }

    initStorage();
    renderCurrentYearLink();

    const years = getRangeOfYears();
    const yearsAndWeeks = calculateWeeksInYears(years.startYear, years.endYear);
    const nowDate = new Date(years.currentYear);

    setState({
        yearsAndWeeks,
        nowDate,
        dateOfBirth: null,
        showPastYears: false,
    });

    renderYearsList(yearsAndWeeks, nowDate, null, false);
    setupShowPastYearsButton();

    const storedDateOfBirth: string | null = getDateOfBirth();
    const dobComponent = getDobInputComponent();

    if (storedDateOfBirth && dobComponent) {
        dobComponent.setValue(storedDateOfBirth);
        handleDobChange();
    }

    customElements.whenDefined('dob-input').then(() => setupDobInputListeners());
};
