import {
    differenceInWeeks,
    addWeeks,
    addYears,
    startOfWeek,
    endOfWeek
} from 'date-fns';

type YearWeeks = {
    year: number;
    weeksCount: number;
};

type WeeksInfo = {
    totalWeeks: number;
    passedWeeks: number;
    remainingWeeks: number;
}

const calculateYearWeeks = (year: number): YearWeeks => {
    const startOfYear: Date = startOfWeek(new Date(year, 0, 1));
    const endOfYear: Date = endOfWeek(new Date(year, 11, 31));
    const weeksCount: number = differenceInWeeks(endOfYear, startOfYear);
    return {year, weeksCount};
};

const calculateWeeksInYears = (startDate: Date, endDate: Date): YearWeeks[] => {
    const years: number[] = Array.from(
        {length: endDate.getFullYear() - startDate.getFullYear() + 1},
        (_, idx) => idx + startDate.getFullYear()
    );
    return years.map(calculateYearWeeks);
};

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

const generateDivElement = (
    year: number,
    weeksCount: number,
    dob: Date,
    currentDate: Date
): HTMLElement => {
    const divElement: HTMLElement = createElementWithClass('div', 'mt-2 flex flex-wrap gap-1', '');

    for (let i: number = 0; i < weeksCount; i++) {
        const weekDiv: HTMLElement = createElementWithClass('div', 'dot', '');
        const weekDate: Date = addWeeks(new Date(year, 0, 1), i);
        weekDiv.id = `week-${year}-${i + 1}`;

        if (weekDate < dob) {
            weekDiv.classList.add('dot-gray');
        } else if (weekDate <= currentDate) {
            weekDiv.classList.add('dot-red');
            weekDiv.addEventListener('click', () => showWeekInfo(weekDiv.id));
        } else {
            weekDiv.classList.add('dot-green');
            weekDiv.addEventListener('click', () => showWeekInfo(weekDiv.id));
        }

        divElement.appendChild(weekDiv);
    }
    return divElement;
};

const showWeekInfo = (id: string) => {
    const dialog = document.getElementById("note-dialog") as HTMLDialogElement;

    const localStorageData = localStorage.getItem(id) || "";

    const textarea = dialog.querySelector("textarea") as HTMLTextAreaElement;
    textarea!.value = localStorageData;

    dialog.querySelector('#save-note')?.addEventListener('click', () => {
        localStorage.setItem(id, textarea.value);
        dialog.close();
    })

    dialog.showModal();
}

const generateYearsList = (yearsAndWeeks: YearWeeks[], nowDate: Date, dob: Date): void => {
    const yearsList: HTMLElement = document.getElementById('yearsList') as HTMLElement;
    yearsList.innerHTML = '';

    const fragment: DocumentFragment = document.createDocumentFragment();

    yearsAndWeeks.forEach(({year, weeksCount}) => {
        const yearElement: HTMLElement = createElementWithClass('h2', 'text-xl font-bold text-center', year.toString());
        yearElement.id = `year${year}`;
        const flexDivElement: HTMLElement = generateDivElement(year, weeksCount, dob, nowDate);
        const outerDivElement: HTMLElement = createElementWithClass('div', 'flex gap-5 items-center', '');
        outerDivElement.append(yearElement, flexDivElement);

        fragment.appendChild(outerDivElement)
    });

    yearsList.appendChild(fragment)
};

const calculatePassedAndRemainingWeeks = (yearsAndWeeks: YearWeeks[], currentDate: Date): WeeksInfo => {
    let totalWeeks: number = 0;
    let passedWeeks: number = 0;
    for (const yearData of yearsAndWeeks) {
        totalWeeks += yearData.weeksCount;
        if (yearData.year < currentDate.getFullYear()) {
            passedWeeks += yearData.weeksCount;
        } else if (yearData.year == currentDate.getFullYear()) {
            const startOfYear = startOfWeek(new Date(yearData.year, 0, 1));
            passedWeeks += differenceInWeeks(currentDate, startOfYear);
        }
    }
    return {totalWeeks, passedWeeks, remainingWeeks: totalWeeks - passedWeeks};
};

const handleDobChange = (): void => {
    const inputDateOfBirth: HTMLInputElement = (document.getElementById("date-of-birth") as HTMLInputElement);
    const maxDate: string = new Date().toISOString().split("T")[0];
    if (inputDateOfBirth.value > maxDate) {
        inputDateOfBirth.value = maxDate
    }

    const startDate: Date = new Date(inputDateOfBirth.value);
    localStorage.setItem('dob', inputDateOfBirth.value);
    const endDate: Date = addYears(startDate, 100);
    const nowDate: Date = new Date();
    const yearsAndWeeks: YearWeeks[] = calculateWeeksInYears(startDate, endDate);

    generateYearsList(yearsAndWeeks, nowDate, startDate);

    const weeksInfo: WeeksInfo = calculatePassedAndRemainingWeeks(yearsAndWeeks, nowDate);

    const infoPassedElement: HTMLElement = document.getElementById('infoPassed') as HTMLElement;
    infoPassedElement.textContent = `Passed weeks: ${weeksInfo.passedWeeks}`;

    const infoRemainingElement: HTMLElement = document.getElementById('infoRemaining') as HTMLElement;
    infoRemainingElement.textContent = `Remaining weeks: ${weeksInfo.remainingWeeks}`;
};

(document.querySelector('#date-of-birth') as HTMLInputElement).addEventListener('change', handleDobChange);

window.onload = function (): void {
    const inputDateOfBirth: HTMLInputElement = document.getElementById("date-of-birth") as HTMLInputElement
    inputDateOfBirth.max = new Date().toISOString().split("T")[0];

    const currentYearLink = document.getElementById('current-year') as HTMLLinkElement;
    const currentYear = new Date().getFullYear();
    currentYearLink.href = `#year${currentYear}`;
    currentYearLink.textContent = `${currentYear}`

    const storedDOB: string | null = localStorage.getItem('dob');
    if (storedDOB) {
        inputDateOfBirth.value = storedDOB;
        handleDobChange();
    }
};