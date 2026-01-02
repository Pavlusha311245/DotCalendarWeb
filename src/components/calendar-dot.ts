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

        this.addEventListener('click', this.onClick);
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.onClick);
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
