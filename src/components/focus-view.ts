import { addWeeks, format } from "date-fns";
import { getWeekNote } from "../utils/storage.ts";
import { YearWeeks } from "../utils/date-calculation.ts";

export class FocusView extends HTMLElement {
  private clockInterval: ReturnType<typeof setInterval> | null = null;
  private cachedYearsAndWeeks: YearWeeks[] = [];
  private cachedNowDate: Date = new Date();
  private cachedDateOfBirth: Date | null = null;

  connectedCallback(): void {
    this.setAttribute("role", "dialog");
    this.setAttribute("aria-modal", "true");
    this.setAttribute("aria-label", "Year focus view");
  }

  get isOpen(): boolean {
    return this.hasAttribute("data-open");
  }

  open(yearsAndWeeks: YearWeeks[], nowDate: Date, dateOfBirth: Date | null): void {
    this.cachedYearsAndWeeks = yearsAndWeeks;
    this.cachedNowDate = nowDate;
    this.cachedDateOfBirth = dateOfBirth;
    this.render();
    this.setAttribute("data-open", "");
    document.body.style.overflow = "hidden";
    this.startClock();
    this.querySelector<HTMLButtonElement>("#focus-close")?.focus();
  }

  close(): void {
    this.removeAttribute("data-open");
    document.body.style.overflow = "";
    this.stopClock();
    this.innerHTML = "";
  }

  refresh(yearsAndWeeks: YearWeeks[], nowDate: Date, dateOfBirth: Date | null): void {
    if (!this.isOpen) return;
    this.cachedYearsAndWeeks = yearsAndWeeks;
    this.cachedNowDate = nowDate;
    this.cachedDateOfBirth = dateOfBirth;
    this.stopClock();
    this.render();
    this.startClock();
  }

  refreshNotes(): void {
    if (!this.isOpen) return;
    const currentYear = this.cachedNowDate.getFullYear();
    const yearData = this.cachedYearsAndWeeks.find((yw) => yw.year === currentYear);
    const weeksCount = yearData?.weeksCount ?? 52;
    const notes = this.getYearNotes(currentYear, weeksCount);
    const listEl = this.querySelector<HTMLElement>(".focus-notes-list");
    if (listEl) this.populateNotesList(listEl, notes, currentYear);
    this.updateDotNoteStatuses(currentYear, weeksCount);
  }

  private startClock(): void {
    this.stopClock();
    this.updateClock();
    this.clockInterval = setInterval((): void => this.updateClock(), 1000);
  }

  private stopClock(): void {
    if (this.clockInterval !== null) {
      clearInterval(this.clockInterval);
      this.clockInterval = null;
    }
  }

  private updateClock(): void {
    const timeEl = this.querySelector<HTMLElement>("#focus-time");
    const dateEl = this.querySelector<HTMLElement>("#focus-date");
    if (!timeEl || !dateEl) return;
    const now = new Date();
    timeEl.textContent = format(now, "HH:mm:ss");
    dateEl.textContent = format(now, "EEEE, MMMM d, yyyy");
  }

  private getYearNotes(year: number, weeksCount: number): Array<{ week: number; text: string }> {
    const notes: Array<{ week: number; text: string }> = [];
    for (let i = 1; i <= weeksCount; i++) {
      const text = getWeekNote(`week-${year}-${i}`);
      if (text.trim()) notes.push({ week: i, text });
    }
    return notes;
  }

  private populateNotesList(
    listEl: HTMLElement,
    notes: Array<{ week: number; text: string }>,
    year: number,
  ): void {
    listEl.innerHTML = "";

    if (notes.length === 0) {
      const empty = document.createElement("p");
      empty.className = "focus-no-notes";
      empty.textContent = "No notes yet. Click any week dot to add a note.";
      listEl.appendChild(empty);
      return;
    }

    const frag = document.createDocumentFragment();
    for (const n of notes) {
      const item = document.createElement("div");
      item.className = "focus-note-item";
      item.setAttribute("role", "listitem");

      const weekSpan = document.createElement("span");
      weekSpan.className = "focus-note-week";
      weekSpan.textContent = `Week ${n.week} · ${year}`;

      const textSpan = document.createElement("span");
      textSpan.className = "focus-note-text";
      textSpan.textContent = n.text;

      item.append(weekSpan, textSpan);
      frag.appendChild(item);
    }
    listEl.appendChild(frag);
  }

  private updateDotNoteStatuses(year: number, weeksCount: number): void {
    for (let i = 1; i <= weeksCount; i++) {
      const weekId = `week-${year}-${i}`;
      const dot = this.querySelector<HTMLElement & { updateNoteStatus?: () => void }>(
        `[data-week="${weekId}"]`,
      );
      dot?.updateNoteStatus?.();
    }
  }

  private render(): void {
    const nowDate = this.cachedNowDate;
    const currentYear = nowDate.getFullYear();
    const yearData = this.cachedYearsAndWeeks.find((yw) => yw.year === currentYear);
    const weeksCount = yearData?.weeksCount ?? 52;
    const notes = this.getYearNotes(currentYear, weeksCount);

    this.innerHTML = `
      <div class="focus-overlay">
        <button id="focus-close" class="focus-close-btn btn-glass" aria-label="Close focus view" type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div class="focus-layout">
          <!-- Left Panel -->
          <div class="focus-left">
            <div class="focus-clock-panel glass">
              <time id="focus-time" class="focus-time" aria-label="Current time">00:00:00</time>
              <p id="focus-date" class="focus-date" aria-label="Current date"></p>
            </div>

            <div class="focus-notes-panel glass">
              <h3 class="focus-notes-title">Notes · ${currentYear}</h3>
              <div class="focus-notes-list" role="list" aria-label="Notes for ${currentYear}"></div>
            </div>
          </div>

          <!-- Right Panel -->
          <div class="focus-right">
            <div class="focus-year-header">
              <span class="focus-year-number">${currentYear}</span>
              <span class="focus-week-count">${weeksCount} weeks</span>
            </div>
            <div class="focus-dots" role="list" aria-label="Weeks of ${currentYear}"></div>
          </div>
        </div>
      </div>
    `;

    // Populate notes list
    const listEl = this.querySelector<HTMLElement>(".focus-notes-list");
    if (listEl) this.populateNotesList(listEl, notes, currentYear);

    // Render week dots
    const dotsContainer = this.querySelector<HTMLElement>(".focus-dots");
    if (dotsContainer) {
      const dateOfBirth = this.cachedDateOfBirth;
      const frag = document.createDocumentFragment();
      for (let i = 0; i < weeksCount; i++) {
        const weekDate = addWeeks(new Date(currentYear, 0, 1), i);
        const weekLabel = `week-${currentYear}-${i + 1}`;
        let color = "green";
        if (dateOfBirth && weekDate < dateOfBirth) {
          color = "gray";
        } else if (weekDate <= nowDate) {
          color = "red";
        }
        const dot = document.createElement("calendar-dot");
        dot.setAttribute("week", weekLabel);
        dot.setAttribute("color", color);
        dot.setAttribute("aria-label", `Week ${i + 1} of ${currentYear}`);
        frag.appendChild(dot);
      }
      dotsContainer.appendChild(frag);
    }

    // Wire close button
    this.querySelector("#focus-close")?.addEventListener("click", (): void => {
      this.close();
      this.dispatchEvent(new CustomEvent("focus-close", { bubbles: true }));
    });

    // Close on Escape key
    this.addEventListener("keydown", (e: Event): void => {
      if ((e as KeyboardEvent).key === "Escape") {
        this.close();
        this.dispatchEvent(new CustomEvent("focus-close", { bubbles: true }));
      }
    });
  }
}

if (!customElements.get("focus-view")) {
  customElements.define("focus-view", FocusView);
}
