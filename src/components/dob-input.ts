/**
 * Date of Birth Input Component
 * Handles user input for date of birth with delete functionality
 */

export class DOBInput extends HTMLElement {
  private inputElement: HTMLInputElement | null = null;
  private deleteButton: HTMLButtonElement | null = null;

  constructor() {
    super();
  }

  connectedCallback(): void {
    this.render();
    this.setupEventListeners();
  }

  private render(): void {
    this.innerHTML = `
            <form class="flex flex-col gap-1 w-full max-w-sm" aria-label="Date of birth input">
                <div class="relative w-full">
                    <input type="date"
                           id="date-of-birth"
                           name="date-of-birth"
                           placeholder="Select your date of birth"
                           class="input-glass w-full pr-10 text-sm"
                           aria-label="Enter your date of birth"
                           required>

                    <button id="delete-dob"
                            type="button"
                            class="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:opacity-70 transition-opacity"
                            aria-label="Clear date of birth"
                            title="Clear date">
                        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round"
                               stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"
                                      fill="currentColor"></path>
                            </g>
                        </svg>
                    </button>
                </div>
            </form>
        `;

    this.inputElement = this.querySelector("#date-of-birth") as HTMLInputElement;
    this.deleteButton = this.querySelector("#delete-dob") as HTMLButtonElement;
  }

  private setupEventListeners(): void {
    if (this.inputElement) {
      this.inputElement.addEventListener("change", () => this.dispatchChangeEvent());
    }

    if (this.deleteButton) {
      this.deleteButton.addEventListener("click", () => this.dispatchDeleteEvent());
    }
  }

  private dispatchChangeEvent(): void {
    this.dispatchEvent(
      new CustomEvent("dob-change", {
        detail: { value: this.inputElement?.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private dispatchDeleteEvent(): void {
    this.dispatchEvent(
      new CustomEvent("dob-delete", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  getValue(): string {
    return this.inputElement?.value || "";
  }

  setValue(value: string): void {
    if (this.inputElement) {
      this.inputElement.value = value;
    }
  }

  setMax(maxDate: string): void {
    if (this.inputElement) {
      this.inputElement.max = maxDate;
    }
  }

  clear(): void {
    if (this.inputElement) {
      this.inputElement.value = "";
    }
  }
}

customElements.define("dob-input", DOBInput);
