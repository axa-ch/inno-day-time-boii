import {
  css,
  html,
  LitElement,
} from 'https://unpkg.com/lit-element/lit-element.js?module';

import {
  nextDay,
  previousDay,
  sameDay,
  today,
  yesterday,
  tomorrow,
  getDate,
  setDate,
  formatDate,
} from './date-manipulation.js';

import fireEvent from './custom-event.js';

class DateStepper extends LitElement {
  static get properties() {
    return {
      value: { type: String, reflect: true },
    };
  }

  constructor() {
    super();

    if (this.value) {
      this.date = setDate(this.value);
    } else {
      this.date = getDate();
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
        <button class="previous" @click="${this.navigate}">
          <img
            class="previous"
            src="icons/keyboard_arrow_left-24px.svg"
            alt="zurück"
          />
        </button>
        <div class="date-wrapper">
          ${helpText}
          <p class="date">${formatDate()}</p>
        </div>
        <button @click="${this.navigate}">
          <img src="icons/keyboard_arrow_right-24px.svg" alt="weiter" />
        </button>
      </div>
    `;
  }

  // fire the initial date so that the other components know
  firstUpdated() {
    fireEvent('change', { date: this.date }, this);
  }

  navigate({ target }) {
    if (target.classList.contains('previous')) {
      previousDay();
    } else {
      nextDay();
    }

    this.date = getDate();
    this.value = this.date.toString();
    fireEvent('change', { date: this.date }, this);
  }

  getHelpText() {
    if (sameDay(today)) {
      return 'Heute';
    }

    if (sameDay(yesterday)) {
      return 'Gestern';
    }

    if (sameDay(tomorrow)) {
      return 'Morgen';
    }

    return;
  }
}

customElements.define('date-stepper', DateStepper);
