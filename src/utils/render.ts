import {addWeeks} from "date-fns";
import {YearWeeks} from "./date-calculation.ts";

export const renderCurrentYearLink = (): void => {
    const currentYear = new Date().getFullYear();

    const currentYearLink = document.getElementById('current-year') as HTMLAnchorElement | null;
    if (!currentYearLink) return;
    currentYearLink.href = `#year${currentYear}`;
    currentYearLink.textContent = `${currentYear}`;
}

/**
 * Renders a list of years with their corresponding weeks as dot elements.
 * Each year is displayed with a heading and a flex container of dot elements representing weeks.
 *
 * @param yearsAndWeeks
 * @param startDate
 * @param dob
 * @param showPastYears - If false, only render years from current year onwards
 */
export const renderYearsList = (yearsAndWeeks: YearWeeks[], startDate: Date, dob: Date | null, showPastYears: boolean = false): void => {
    const yearsList = document.getElementById('yearsList');
    if (!yearsList) return;
    yearsList.innerHTML = '';

    const fragment: DocumentFragment = document.createDocumentFragment();
    const currentYear = startDate.getFullYear();

    const yearsToRender = showPastYears
        ? yearsAndWeeks
        : yearsAndWeeks.filter(({year}) => year >= currentYear);

    // Add "Show Previous Years" button if past years are hidden and there are past years
    if (!showPastYears && yearsAndWeeks.some(({year}) => year < currentYear)) {
        const buttonContainer = createElementWithClass('div', 'flex justify-center mb-8', '');
        const button = document.createElement('button');
        button.className = 'btn-glass flex items-center gap-2 px-4 py-2';
        button.innerHTML = `
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor" aria-hidden="true">
                <path d="M342.6 81.4C330.1 68.9 309.8 68.9 297.3 81.4L137.3 241.4C124.8 253.9 124.8 274.2 137.3 286.7C149.8 299.2 170.1 299.2 182.6 286.7L288 181.3L288 552C288 569.7 302.3 584 320 584C337.7 584 352 569.7 352 552L352 181.3L457.4 286.7C469.9 299.2 490.2 299.2 502.7 286.7C515.2 274.2 515.2 253.9 502.7 241.4L342.7 81.4z"/>
            </svg>
            <span>Show Previous Years</span>
        `;
        button.id = 'show-past-years-btn';
        buttonContainer.appendChild(button);
        fragment.appendChild(buttonContainer);
    }

    yearsToRender.forEach(({year, weeksCount}: YearWeeks) => {
        const yearElement: HTMLElement = createElementWithClass('h2', 'text-slate-50 text-xl font-bold text-center w-12', year.toString());
        yearElement.setAttribute('aria-label', `Year ${year}`);
        if (year === startDate.getFullYear()) {
            yearElement.style.color = 'var(--color-bright-blue)';
        } else {
            yearElement.style.color = 'var(--color-text-light)';
        }
        const flexDivElement: HTMLElement = renderDotsWeek({year, weeksCount}, dob, startDate);
        const outerDivElement: HTMLElement = createElementWithClass('div', 'flex gap-5 items-center', '');
        outerDivElement.setAttribute('role', 'group');
        outerDivElement.setAttribute('aria-label', `Year ${year}`);
        outerDivElement.append(yearElement, flexDivElement);
        outerDivElement.id = `year${year}`;

        fragment.appendChild(outerDivElement);
    });

    yearsList.appendChild(fragment);
};

const renderDotsWeek = (
    yearWeeks: YearWeeks,
    dob: Date | null,
    currentDate: Date
): HTMLElement => {
    const divElement: HTMLElement = createElementWithClass('div', 'mt-2 flex w-full flex-wrap gap-1', '');
    divElement.setAttribute('role', 'list');
    divElement.setAttribute('aria-label', `Weeks of ${yearWeeks.year}`);

    for (let i: number = 0; i < yearWeeks.weeksCount; i++) {
        const calendarDotElement = document.createElement('calendar-dot');
        const weekLabel = `week-${yearWeeks.year}-${i + 1}`;
        calendarDotElement.setAttribute('week', weekLabel);
        calendarDotElement.setAttribute('aria-label', `Week ${i + 1} of ${yearWeeks.year}`);

        const weekDate: Date = addWeeks(new Date(yearWeeks.year, 0, 1), i);

        if (dob && weekDate < dob) {
            calendarDotElement.setAttribute('color', 'gray');
        } else if (weekDate <= currentDate) {
            calendarDotElement.setAttribute('color', 'red');
        } else {
            calendarDotElement.setAttribute('color', 'green');
        }

        divElement.appendChild(calendarDotElement);
    }
    return divElement;
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
