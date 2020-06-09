// Library Bootstrap
import {
  css,
  html,
  LitElement
} from "https://unpkg.com/lit-element/lit-element.js?module";

import "./src/js/checkin-toggle.js";
import "./src/js/date-stepper.js";
import "./src/js/settings-dialog.js";
import "./src/js/time-list.js";
import "./src/js/time-manager.js";

class TimeTracker extends LitElement {
  static get properties() {
    return {
      date: { type: String, reflect: true },
      settingsVisible: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.settingsVisible = false;
  }

  static get styles() {
    return css`
      :host {
        font-family: sans-serif;
      }

      header {
        display: flex;
        height: 60px;
        padding: 0 20px;
        align-items: center;
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
      }

      img {
        height: 2.5rem;
      }

      h1 {
        flex: 1;
        margin: 3px 0 0 1rem;
        font-size: 20px;
        font-weight: normal;
      }

      button {
        margin-left: 1.2rem;
        padding: 0;
        background: none;
        border: none;
        cursor: pointer;
      }

      button img {
        height: 25px;
      }
    `;
  }

  render() {
    const { handleChange, date, settingsVisible } = this;

    const settings = settingsVisible
      ? html`
          <settings-dialog></settings-dialog>
        `
      : "";

    return html`
      <header>
        <img src="icons/axaLogo.svg" alt="logo" />
        <h1>TimeTracker</h1>
        <button>
          <img src="icons/exit_to_app-24px.svg" alt="exportieren" />
        </button>
        <button @click=${this.showSettings}>
          <img src="icons/settings-24px.svg" alt="Einstellungen" />
        </button>
      </header>
      <article>
        <date-stepper @change=${handleChange}></date-stepper>
        <time-manager date=${date}></time-manager>
        <time-list date=${date}></time-list>
        <checkin-toggle></checkin-toggle>
        ${settings}
      </article>
    `;
  }

  handleChange({ detail: { date } }) {
    this.date = date.toString();
  }

  showSettings() {
    this.settingsVisible = !this.settingsVisible;
  }
}

customElements.define("time-tracker", TimeTracker);
