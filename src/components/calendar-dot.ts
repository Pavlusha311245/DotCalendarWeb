import { hasWeekNote } from "../utils/storage.ts";

export class CalendarDot extends HTMLElement {
  connectedCallback() {
    this.classList.add("dot");

    const color = this.getAttribute("color");
    if (color) {
      this.classList.add(`dot-${color}`);
    }

    const week = this.getAttribute("week");
    if (week) {
      this.dataset.week = week;
    }

    this.setAttribute("role", "listitem");
    this.setAttribute("tabindex", "0");

    this.checkForNotes();

    this.addEventListener("click", this.onClick);
    this.addEventListener("keydown", this.onKeyDown);
    this.addEventListener("keyup", this.onKeyUp);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.onClick);
    this.removeEventListener("keydown", this.onKeyDown);
    this.removeEventListener("keyup", this.onKeyUp);
  }

  private checkForNotes(): void {
    const week = this.dataset.week;
    if (!week) return;

    if (hasWeekNote(week)) {
      this.classList.add("dot-has-notes");
    }
  }

  updateNoteStatus(): void {
    const week = this.dataset.week;
    if (!week) return;

    if (hasWeekNote(week)) {
      this.classList.add("dot-has-notes");
    } else {
      this.classList.remove("dot-has-notes");
    }
  }

  private onClick = () => {
    this.dispatchEvent(
      new CustomEvent("dot:click", {
        bubbles: true,
        detail: {
          week: this.dataset.week,
        },
      }),
    );
  };

  private onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      this.onClick();
    }
    if (event.key === " ") {
      event.preventDefault(); // prevent page scroll on Space keydown
    }
  };

  private onKeyUp = (event: KeyboardEvent) => {
    if (event.key === " ") {
      this.onClick();
    }
  };
}

if (!customElements.get("calendar-dot")) {
  customElements.define("calendar-dot", CalendarDot);
}
