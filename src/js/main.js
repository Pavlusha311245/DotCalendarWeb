import {
    differenceInWeeks,
    addWeeks,
    addYears,
    startOfWeek,
    endOfWeek
} from 'https://cdn.jsdelivr.net/npm/date-fns@3.6.0/+esm';

const calculateYearWeeks = (year) => {
    const startOfYear = startOfWeek(new Date(year, 0, 1));
    const endOfYear = endOfWeek(new Date(year, 11, 31));
    const weeksCount = differenceInWeeks(endOfYear, startOfYear);
    return {year, weeksCount: weeksCount};
};

const calculateWeeksInYears = (startDate, endDate) => {
    const years = Array.from({length: endDate.getFullYear() - startDate.getFullYear() + 1}, (_, idx) => idx + startDate.getFullYear());
    return years.map(calculateYearWeeks);
};

const createElementWithClass = (tagName, className, textContent) => {
    const element = document.createElement(tagName);
    element.className = className;
    element.textContent = textContent;
    return element;
};

const generateDivElement = (year, weeksCount, dob, currentDate) => {
    const divElement = createElementWithClass('div', 'mt-5 flex flex-wrap gap-3');
    divElement.id = `year${year}`;
    for (let i = 0; i < weeksCount; i++) {
        const weekDiv = createElementWithClass('div', 'w-4 h-4 border-4 border-black rounded');
        const weekDate = addWeeks(new Date(year, 0, 1), i);
        if (weekDate < dob) {
            weekDiv.classList.add('bg-gray-400'); // Красим в серый цвет недели до даты рождения
        } else {
            weekDiv.classList.add((weekDate <= currentDate) ? 'bg-red-500' : 'bg-green-600');
        }
        divElement.appendChild(weekDiv);
    }
    return divElement;
};

const generateYearsList = (yearsAndWeeks, nowDate, dob) => {
    const yearsList = document.getElementById('yearsList');
    yearsList.innerHTML = ''; //This line will clear the yearsList
    yearsAndWeeks.forEach(({year, weeksCount}) => {
        const yearElement = createElementWithClass('h2', 'text-xl font-bold text-center', year.toString());
        const flexDivElement = generateDivElement(year, weeksCount, dob, nowDate);
        const outerDivElement = createElementWithClass('div', '', '');
        outerDivElement.append(yearElement, flexDivElement);
        yearsList.appendChild(outerDivElement);
    });
};

const calculatePassedAndRemainingWeeks = (yearsAndWeeks, currentDate) => {
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
}

const handleDobChange = () => {
    const inputDOB = document.getElementById("dob").value;
    const startDate = new Date(inputDOB);
    localStorage.setItem('dob', inputDOB);
    const endDate = addYears(startDate, 100);
    const nowDate = new Date();
    const yearsAndWeeks = calculateWeeksInYears(startDate, endDate);

    generateYearsList(yearsAndWeeks, nowDate, startDate);

    const weeksInfo = calculatePassedAndRemainingWeeks(yearsAndWeeks, nowDate);
    let infoPassedElement = document.getElementById('infoPassed');
    let infoRemainingElement = document.getElementById('infoRemaining');

    infoPassedElement.textContent = `Passed weeks: ${weeksInfo.passedWeeks}`;
    infoRemainingElement.textContent = `Remaining weeks: ${weeksInfo.remainingWeeks}`;
}

document.querySelector('#dob').addEventListener('change', handleDobChange)

window.onload = function () {
    const storedDOB = localStorage.getItem('dob');
    if (storedDOB) {
        document.getElementById("dob").value = storedDOB;
        handleDobChange();
    }
};