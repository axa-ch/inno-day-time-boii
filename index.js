// Library Bootstrap
import { css, html, LitElement } from "https://unpkg.com/lit-element/lit-element.js?module";
import "./src/js/checkin-toggle.js";
import "./src/js/date-stepper.js";
import "./src/js/time-list.js";
import "./src/js/time-manager.js";

class TimeTracker extends LitElement {
  static get properties() {
    return {
      date: { type: String, reflect: true },
    };
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
        margin-left: 1rem;
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
    return html`
      <header>
        <img src="icons/axaLogo.svg" alt="logo" />
        <h1>TimeTracker</h1>
        <button>
          <img src="icons/exit_to_app-24px.svg" alt="exportieren" />
        </button>
        <button>
          <img src="icons/settings-24px.svg" alt="Einstellungen" />
        </button>
      </header>
      <article>
        <date-stepper @change=${this.handleChange}></date-stepper>
        <time-manager date=${this.date}></time-manager>
        <time-list date=${this.date}></time-list>
        <checkin-toggle></checkin-toggle>
      </article>
    `;
  }

  handleChange = ({ detail: { date } }) => {
    this.date = date.toString();
  };
}

customElements.define("time-tracker", TimeTracker);
