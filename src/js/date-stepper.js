import Persistence from "./persistence.js";
import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element/lit-element.js?module";

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
    return css`
      :host {
        display: flex;
        justify-content: space-between;
        width: 100;
        font-family: sans-serif;
        color: #333;
      }

      p {
        margin: 0;
      }

      .small {
        font-size: 14px;
      }

      button {
        background: #fff;
        border: none;
        font-size: 2rem;
        box-shadow: 1px 2px 3px #ddd;
        text-align: center;
        padding: 0 1rem 0 0;
        outline: none;
        cursor: pointer;
      }

      .next {
        padding: 0 0 0 1rem;
      }

      .date-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    `;
  }

  constructor() {
    super();
    if (this.value) {
      this.date = new Date(this.value);
    } else {
      this.date = new Date();
    }
    this.store = Persistence.getInstance();
    console.log(this.store);
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
    // const {
    //   store: { previous, next }
    // } = this;
    // const date = (mode === PREV ? previous : next)();
    //
    // this.date = date;

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
      <button @click="${() => this.handleClick(PREV)}">〈</button>
      <div class="date-wrapper">
        <p>${this.getDate()}</p>
        <p class="small">
          ${this.getHelpText()}
        </p>
      </div>
      <button class="next" @click="${() => this.handleClick(NEXT)}">〉</button>
    `;
  }
}

customElements.define("date-stepper", DateStepper);
