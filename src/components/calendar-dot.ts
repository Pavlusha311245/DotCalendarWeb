export class CalendarDot extends HTMLElement {
    connectedCallback() {
        this.classList.add('dot');

        const color = this.getAttribute('color');
        if (color) {
            this.classList.add(`dot-${color}`);
        }

        const week = this.getAttribute('week');
        if (week) {
            this.dataset.week = week;
        }

        // Check if this week has notes and add highlight class
        this.checkForNotes();

        this.addEventListener('click', this.onClick);
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.onClick);
    }

    private checkForNotes(): void {
        const week = this.dataset.week;
        if (!week) return;

        const notes = localStorage.getItem(`note-${week}`);
        if (notes && notes.trim()) {
            this.classList.add('dot-has-notes');
        }
    }

    // Public method to check and update note status
    updateNoteStatus(): void {
        const week = this.dataset.week;
        if (!week) return;

        const notes = localStorage.getItem(`note-${week}`);
        if (notes && notes.trim()) {
            this.classList.add('dot-has-notes');
        } else {
            this.classList.remove('dot-has-notes');
        }
    }

    private onClick = () => {
        this.dispatchEvent(new CustomEvent('dot:click', {
            bubbles: true,
            detail: {
                week: this.dataset.week
            }
        }));
    };
}

if (!customElements.get('calendar-dot')) {
    customElements.define('calendar-dot', CalendarDot);
}
