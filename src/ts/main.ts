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
    const years = Array.from(
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
        const weekDiv: HTMLElement = createElementWithClass('div', 'w-full max-w-4 h-4 border-4 border-black rounded-sm', '');
        const weekDate: Date = addWeeks(new Date(year, 0, 1), i);
        if (weekDate < dob) {
            weekDiv.classList.add('bg-gray-400', 'hover:bg-gray-600');
        } else if (weekDate <= currentDate) {
            weekDiv.classList.add('bg-red-500', 'hover:bg-red-800');
        } else {
            weekDiv.classList.add('bg-green-600', 'hover:bg-green-500');
        }
        divElement.appendChild(weekDiv);
    }
    return divElement;
};

const generateYearsList = (yearsAndWeeks: YearWeeks[], nowDate: Date, dob: Date): void => {
    const yearsList: HTMLElement = document.getElementById('yearsList') as HTMLElement;
    yearsList.innerHTML = '';
    yearsAndWeeks.forEach(({year, weeksCount}) => {
        const yearElement: HTMLElement = createElementWithClass('h2', 'text-xl font-bold text-center', year.toString());
        yearElement.id = `year${year}`;
        const flexDivElement: HTMLElement = generateDivElement(year, weeksCount, dob, nowDate);
        const outerDivElement: HTMLElement = createElementWithClass('div', 'flex gap-5 items-center', '');
        outerDivElement.append(yearElement, flexDivElement);
        yearsList.appendChild(outerDivElement);
    });
};

const calculatePassedAndRemainingWeeks = (yearsAndWeeks: YearWeeks[], currentDate: Date): WeeksInfo => {
    let totalWeeks: number = 0;
    let passedWeeks: number = 0;
    for (let yearData of yearsAndWeeks) {
        totalWeeks += yearData.weeksCount;
        if (yearData.year < currentDate.getFullYear()) {
            passedWeeks += yearData.weeksCount;
        } else if (yearData.year == currentDate.getFullYear()) {
            let startOfYear = startOfWeek(new Date(yearData.year, 0, 1));
            passedWeeks += differenceInWeeks(currentDate, startOfYear);
        }
    }
    return {totalWeeks, passedWeeks, remainingWeeks: totalWeeks - passedWeeks};
};

const handleDobChange = (): void => {
    const inputDOB: string = (document.getElementById("dob") as HTMLInputElement).value;
    const startDate: Date = new Date(inputDOB);
    localStorage.setItem('dob', inputDOB);
    const endDate: Date = addYears(startDate, 100);
    const nowDate: Date = new Date();
    const yearsAndWeeks: YearWeeks[] = calculateWeeksInYears(startDate, endDate);

    generateYearsList(yearsAndWeeks, nowDate, startDate);

    const weeksInfo: WeeksInfo = calculatePassedAndRemainingWeeks(yearsAndWeeks, nowDate);
    let infoPassedElement: HTMLElement = document.getElementById('infoPassed') as HTMLElement;
    let infoRemainingElement: HTMLElement = document.getElementById('infoRemaining') as HTMLElement;

    infoPassedElement.textContent = `Passed weeks: ${weeksInfo.passedWeeks}`;
    infoRemainingElement.textContent = `Remaining weeks: ${weeksInfo.remainingWeeks}`;
};

(document.querySelector('#dob') as HTMLInputElement).addEventListener('change', handleDobChange);

window.onload = function (): void {
    const storedDOB: string | null = localStorage.getItem('dob');
    if (storedDOB) {
        (document.getElementById("dob") as HTMLInputElement).value = storedDOB;
        handleDobChange();
    }
};