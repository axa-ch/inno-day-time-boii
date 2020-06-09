import "./src/js/date-stepper.js";
import "./src/js/checkin-toggle.js";
import "./src/js/time-manager.js";
import "./src/js/time-list.js";
// Library Bootstrap
import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element/lit-element.js?module";

class TimeTracker extends LitElement {
  static get properties() {
    return {
      date: { type: String, reflect: true }
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: sans-serif;
      }

      h1 {
        display: inline;
        margin-left: 1rem;
      }

      .logo {
        height: 2rem;
      }

      date-stepper {
        margin-top: 1rem;
      }
    `;
  }

  handleChange = ({ detail: { date } }) => {
    this.date = date.toString();
  };

  render() {
    return html`
      <header>
        
        <h1>Time Tracker</h1>
        <date-stepper @change=${this.handleChange}></date-stepper>
      </header>
      <article>
        <time-manager date=${this.date}></time-manager>
        <time-list date=${this.date}></time-list>
        <checkin-toggle></checkin-toggle>
      </article>
    `;
  }
}

customElements.define("time-tracker", TimeTracker);
