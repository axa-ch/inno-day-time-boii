import {
  css,
  html,
  LitElement,
} from 'https://unpkg.com/lit-element/lit-element.js?module';

import { nextDay, previousDay } from './date-manipulation.js';

const DEFAULT_LOCALE = 'de-CH';

const sameDay = (d1, d2) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

class DateStepper extends LitElement {
  static get properties() {
    return {
      value: { type: String, reflect: true },
    };
  }

  constructor() {
    super();

    if (this.value) {
      this.date = new Date(this.value);
    } else {
      this.date = new Date();
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .container {
        display: flex;
        height: 75px;
        padding: 0 20px;
        justify-content: space-between;
        align-items: center;
        font-family: sans-serif;
        color: #333;
      }

      .date-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      p {
        margin: 0;
      }

      .helpText {
        margin-bottom: 3px;
        font-size: 14px;
        font-weight: bold;
      }

      .date {
        font-size: 16px;
      }

      button {
        padding: 0;
        background: none;
        border: none;
        outline: none;
        cursor: pointer;
      }

      button img {
        vertical-align: middle;
      }
    `;
  }

  render() {
    const helpText = this.getHelpText()
      ? html` <p class="helpText">${this.getHelpText()}</p> `
      : '';

    return html`
      <div class="container">
        <button data-navigate="-1" @click="${this.handleClick}">
          <img src="icons/keyboard_arrow_left-24px.svg" alt="zurück" />
        </button>
        <div class="date-wrapper">
          ${helpText}
          <p class="date">${this.getDate()}</p>
        </div>
        <button data-navigate="+1" @click="${this.handleClick}">
          <img src="icons/keyboard_arrow_right-24px.svg" alt="weiter" />
        </button>
      </div>
    `;
  }

  // fire the initial date so that the other components know
  firstUpdated() {
    this.fireEvent();
  }

  handleClick({ target }) {
    const direction = parseInt(target.dataset.navigate, 10) || 0;
    this.date.setDate(this.date.getDate() + direction);
    this.value = this.date.toString();
    if (direction < 0) {
      previousDay();
    } else {
      nextDay();
    }
    this.fireEvent();
  }

  fireEvent() {
    // fire up change
    const event = new CustomEvent('change', {
      detail: {
        date: this.date,
      },
    });

    this.dispatchEvent(event);
  }

  getHelpText() {
    const today = new Date();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (sameDay(this.date, today)) {
      return 'Heute';
    }

    if (sameDay(this.date, yesterday)) {
      return 'Gestern';
    }

    if (sameDay(this.date, tomorrow)) {
      return 'Morgen';
    }

    return;
  }

  getDate() {
    return this.date.toLocaleDateString(DEFAULT_LOCALE, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}

customElements.define('date-stepper', DateStepper);
