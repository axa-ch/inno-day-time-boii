import "./src/js/date-stepper.js";
import "./src/js/checkin-toggle.js";
const { LitElement, html } = window;

class TimeTracker extends LitElement {
  static get properties() {
    return {
      date: { type: String, reflect: true }
    };
  }

  handleChange = ({ detail: { date } }) => {
    this.date = date.toString();
  };

  render() {
    return html`
      <header>
        <date-stepper @change=${this.handleChange}></date-stepper>
      </header>
      <article>
        <time-manager date=${this.date}></time-manager>
        <checkin-toggle></checkin-toggle>
      </article>
    `;
  }
}

customElements.define("time-tracker", TimeTracker);
