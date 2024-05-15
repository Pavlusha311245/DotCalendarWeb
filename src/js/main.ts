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

const calculateYearWeeks = (year: number): YearWeeks => {
    const startOfYear = startOfWeek(new Date(year, 0, 1));
    const endOfYear = endOfWeek(new Date(year, 11, 31));
    const weeksCount = differenceInWeeks(endOfYear, startOfYear);
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
    const element = document.createElement(tagName);
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
    const divElement = createElementWithClass('div', 'mt-5 flex flex-wrap gap-3', '');
    divElement.id = `year${year}`;
    for (let i = 0; i < weeksCount; i++) {
        const weekDiv = createElementWithClass('div', 'w-4 h-4 border-4 border-black rounded', '');
        const weekDate = addWeeks(new Date(year, 0, 1), i);
        if (weekDate < dob) {
            weekDiv.classList.add('bg-gray-400');
        } else {
            weekDiv.classList.add((weekDate <= currentDate) ? 'bg-red-500' : 'bg-green-600');
        }
        divElement.appendChild(weekDiv);
    }
    return divElement;
};

const generateYearsList = (yearsAndWeeks: YearWeeks[], nowDate: Date, dob: Date): void => {
    const yearsList = document.getElementById('yearsList') as HTMLElement;
    yearsList.innerHTML = '';
    yearsAndWeeks.forEach(({year, weeksCount}) => {
        const yearElement = createElementWithClass('h2', 'text-xl font-bold text-center', year.toString());
        const flexDivElement = generateDivElement(year, weeksCount, dob, nowDate);
        const outerDivElement = createElementWithClass('div', '', '');
        outerDivElement.append(yearElement, flexDivElement);
        yearsList.appendChild(outerDivElement);
    });
};

type WeeksInfo = {
    totalWeeks: number;
    passedWeeks: number;
    remainingWeeks: number;
}

const calculatePassedAndRemainingWeeks = (yearsAndWeeks: YearWeeks[], currentDate: Date): WeeksInfo => {
    let totalWeeks = 0;
    let passedWeeks = 0;
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
    const inputDOB = (document.getElementById("dob") as HTMLInputElement).value;
    const startDate = new Date(inputDOB);
    localStorage.setItem('dob', inputDOB);
    const endDate = addYears(startDate, 100);
    const nowDate = new Date();
    const yearsAndWeeks = calculateWeeksInYears(startDate, endDate);

    generateYearsList(yearsAndWeeks, nowDate, startDate);

    const weeksInfo = calculatePassedAndRemainingWeeks(yearsAndWeeks, nowDate);
    let infoPassedElement = document.getElementById('infoPassed') as HTMLElement;
    let infoRemainingElement = document.getElementById('infoRemaining') as HTMLElement;

    infoPassedElement.textContent = `Passed weeks: ${weeksInfo.passedWeeks}`;
    infoRemainingElement.textContent = `Remaining weeks: ${weeksInfo.remainingWeeks}`;
};

(document.querySelector('#dob') as HTMLInputElement).addEventListener('change', handleDobChange);

window.onload = function (): void {
    const storedDOB = localStorage.getItem('dob');
    if (storedDOB) {
        (document.getElementById("dob") as HTMLInputElement).value = storedDOB;
        handleDobChange();
    }
};