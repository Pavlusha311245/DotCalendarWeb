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
 */
export const renderYearsList = (yearsAndWeeks: YearWeeks[], startDate: Date, dob: Date | null): void => {
    const yearsList: HTMLElement = document.getElementById('yearsList') as HTMLElement;
    yearsList.innerHTML = '';

    const fragment: DocumentFragment = document.createDocumentFragment();

    yearsAndWeeks.forEach(({year, weeksCount}: YearWeeks) => {
        const yearElement: HTMLElement = createElementWithClass('h2', 'text-stale-50 text-xl font-bold text-center w-12', year.toString());
        if (year === startDate.getFullYear()) {
            yearElement.classList.add('text-emerald-400');
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