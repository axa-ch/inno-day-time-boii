const { LitElement, html, css } = window;

const PREV = "prev";
const NEXT = "next";
const DEFAULT_LOCALE = "de-CH";

const sameDay = (d1, d2) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

class DateStepper extends LitElement {
  static get properties() {
    return {
      value: { type: String, reflect: true }
    };
  }

  static get styles() {
    return css``;
  }

  constructor() {
    super();
    if (this.value) {
      this.date = new Date(this.value);
    } else {
      this.date = new Date();
    }
  }

  fireEvent() {
    // fire up change
    const event = new CustomEvent("change", {
      detail: {
        date: this.date
      }
    });
    this.dispatchEvent(event);
  }

  handleClick = (mode = NEXT) => {
    this.date.setDate(this.date.getDate() + (mode === PREV ? -1 : 1));
    this.value = this.date.toString();
    this.fireEvent();
  };

  getDate = () => {
    return this.date.toLocaleDateString(DEFAULT_LOCALE, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  getHelpText = () => {
    const today = new Date();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (sameDay(this.date, today)) {
      return "Heute";
    }
    if (sameDay(this.date, yesterday)) {
      return "Gestern";
    }
    if (sameDay(this.date, tomorrow)) {
      return "Morgen";
    }

    return this.date.toLocaleDateString(DEFAULT_LOCALE, {
      month: "numeric",
      day: "numeric"
    });
  };

  // fire the inital date so that the other components know
  firstUpdated() {
    this.fireEvent();
  }

  render() {
    return html`
      <div>
        <button @click="${() => this.handleClick(PREV)}">〈</button>
        <div>
          <p>${this.getDate()}</p>
          <p>
            ${this.getHelpText()}
          </p>
        </div>
        <button @click="${() => this.handleClick(NEXT)}">〉</button>
      </div>
    `;
  }
}

customElements.define("date-stepper", DateStepper);
