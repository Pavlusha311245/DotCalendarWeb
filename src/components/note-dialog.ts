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
                <label class="text-white text-xl">
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
                <button id="save-note" class="btn-glass">Save Note</button>
            </div>
        `;

        this.textarea = this.querySelector('textarea')!;

        this.querySelector('#save-note')!
            .addEventListener('click', () => this.save());
    }

    openNote(weekId: string) {
        this.currentWeekId = weekId;
        this.textarea.value = getWeekNote(weekId) ?? '';
        this.showModal();
    }

    private save() {
        if (!this.currentWeekId) return;

        setWeekNote(this.currentWeekId, this.textarea.value);
        this.close();
    }
}

customElements.define(
    'note-dialog',
    NoteDialog,
    { extends: 'dialog' }
);
