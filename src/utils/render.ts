import {addWeeks} from "date-fns";
import {YearWeeks} from "./date-calculation.ts";
import {NoteDialog} from "../components/note-dialog.ts";

/**
 * Generates a link element that points to the current year section of the page.
 * The link's text content is set to the current year.
 */
export const renderCurrentYearLink = (): void => {
    const currentYear = new Date().getFullYear();

    const currentYearLink = document.getElementById('current-year') as HTMLLinkElement;
    currentYearLink.href = `#year${currentYear}`;
    currentYearLink.textContent = `${currentYear}`
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
    const yearsList: HTMLElement = document.getElementById('yearsList') as HTMLElement;
    yearsList.innerHTML = '';

    const fragment: DocumentFragment = document.createDocumentFragment();
    const currentYear = startDate.getFullYear();
    
    // Filter years if showPastYears is false
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
        if (year === startDate.getFullYear()) {
            yearElement.style.color = 'var(--color-bright-blue)';
        } else {
            yearElement.style.color = 'var(--color-text-light)';
        }
        const flexDivElement: HTMLElement = renderDotsWeek({year, weeksCount}, dob, startDate);
        const outerDivElement: HTMLElement = createElementWithClass('div', 'flex gap-5 items-center', '');
        outerDivElement.append(yearElement, flexDivElement);
        outerDivElement.id = `year${year}`;

        fragment.appendChild(outerDivElement)
    });

    yearsList.appendChild(fragment)
};

/**
 * Renders a flex container of dot elements representing weeks for a given year.
 * Each dot element is color-coded based on whether the week is in the past or future
 * relative to the current date and date of birth.
 *
 * @param yearWeeks
 * @param dob
 * @param currentDate
 */
const renderDotsWeek = (
    yearWeeks: YearWeeks,
    dob: Date | null,
    currentDate: Date
): HTMLElement => {
    const divElement: HTMLElement = createElementWithClass('div', 'mt-2 flex w-full flex-wrap gap-1', '');

    for (let i: number = 0; i < yearWeeks.weeksCount; i++) {
        const calendarDotElement = document.createElement('calendar-dot');
        calendarDotElement.setAttribute('week', `week-${yearWeeks.year}-${i + 1}`);

        const weekDate: Date = addWeeks(new Date(yearWeeks.year, 0, 1), i);

        if (dob && weekDate < dob) {
            calendarDotElement.setAttribute('color', 'gray');
        } else if (weekDate <= currentDate) {
            calendarDotElement.setAttribute('color', 'red');
        } else {
            calendarDotElement.setAttribute('color', 'green');
            calendarDotElement.addEventListener('click', () =>
                (document.getElementById('note-dialog') as NoteDialog)
                    .openNote(calendarDotElement.getAttribute('week') as string)
            );
        }

        divElement.appendChild(calendarDotElement);
    }
    return divElement;
};


/**
 * Creates an HTML element with the specified tag name, class name, and text content.
 *
 * @param tagName
 * @param className
 * @param textContent
 */
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