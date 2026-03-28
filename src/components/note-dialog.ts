import { getWeekNote, setWeekNote } from "../utils/storage.ts";
import { CalendarDot } from "./calendar-dot.ts";

export class NoteDialog extends HTMLDialogElement {
  private currentWeekId: string | null = null;
  private textarea: HTMLTextAreaElement | null = null;

  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";

    this.id = "note-dialog";
    this.className = "w-full max-w-lg mx-auto px-5";
    this.setAttribute("aria-modal", "true");
    this.setAttribute("aria-labelledby", "note-dialog-label");

    this.innerHTML = `
            <div class="flex flex-col gap-1">
                <label id="note-dialog-label" class="text-xl" style="color: var(--color-text-light);">
                    Write your week-note here...
                </label>
                <textarea
                    class="mt-3 note-textarea"
                    rows="10"
                    aria-label="Week note"
                ></textarea>
            </div>

            <div class="flex justify-end items-center gap-3 mt-3">
                <form method="dialog">
                    <button class="btn-glass btn-danger">Cancel</button>
                </form>
                <button id="save-note" class="btn-glass btn-success">Save Note</button>
            </div>
        `;

    this.textarea = this.querySelector("textarea");

    const saveButton = this.querySelector("#save-note");
    if (saveButton) {
      saveButton.addEventListener("click", () => this.save());
    }
  }

  openNote(weekId: string) {
    this.currentWeekId = weekId;
    this.loadNote();
    this.showModal();
    this.textarea?.focus();
  }

  setWeek(weekId: string): void {
    this.currentWeekId = weekId;
  }

  loadNote(): void {
    if (!this.currentWeekId || !this.textarea) return;
    this.textarea.value = getWeekNote(this.currentWeekId);
  }

  private save() {
    if (!this.currentWeekId || !this.textarea) return;

    setWeekNote(this.currentWeekId, this.textarea.value);

    const dot = document.querySelector(`[data-week="${this.currentWeekId}"]`);
    if (dot instanceof CalendarDot) {
      dot.updateNoteStatus();
    }

    this.close();
  }
}

customElements.define("note-dialog", NoteDialog, { extends: "dialog" });
