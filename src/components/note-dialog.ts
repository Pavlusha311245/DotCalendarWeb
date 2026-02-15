import {getWeekNote, setWeekNote} from "../utils/storage.ts";

export class NoteDialog extends HTMLDialogElement {
    private currentWeekId: string | null = null;
    private textarea!: HTMLTextAreaElement;

    connectedCallback() {
        if (this.dataset.ready) return;
        this.dataset.ready = 'true';

        this.id = 'note-dialog';
        this.className = 'w-full max-w-lg mx-auto px-5';

        this.innerHTML = `
            <div class="flex flex-col gap-1">
                <label class="text-xl" style="color: var(--color-text-light);">
                    Write your week-note here...
                </label>
                <textarea
                    class="mt-3 note-textarea"
                    rows="10"
                ></textarea>
            </div>

            <div class="flex justify-end items-center gap-3 mt-3">
                <form method="dialog">
                    <button class="btn-glass btn-danger">Cancel</button>
                </form>
                <button id="save-note" class="btn-glass btn-success">Save Note</button>
            </div>
        `;

        this.textarea = this.querySelector('textarea')!;

        this.querySelector('#save-note')!
            .addEventListener('click', () => this.save());
    }

    openNote(weekId: string) {
        this.currentWeekId = weekId;
        this.loadNote();
        this.showModal();
    }

    // Public method to set the week ID
    setWeek(weekId: string): void {
        this.currentWeekId = weekId;
    }

    // Public method to load note for current week
    loadNote(): void {
        if (!this.currentWeekId) return;
        this.textarea.value = getWeekNote(this.currentWeekId) ?? '';
    }

    private save() {
        if (!this.currentWeekId) return;

        const noteValue = this.textarea.value;
        setWeekNote(this.currentWeekId, noteValue);

        // Update the dot's note indicator
        const dot = document.querySelector(`[data-week="${this.currentWeekId}"]`);
        if (dot && 'updateNoteStatus' in dot && typeof (dot as { updateNoteStatus: () => void }).updateNoteStatus === 'function') {
            (dot as { updateNoteStatus: () => void }).updateNoteStatus();
        }

        this.close();
    }
}

customElements.define(
    'note-dialog',
    NoteDialog,
    { extends: 'dialog' }
);
