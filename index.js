import "./src/js/date-stepper.js";
import "./src/js/checkin-toggle.js";
const { LitElement, html } = window;

class TimeTracker extends LitElement {
  render() {
    return html`
      <header>
        <date-stepper mood="great"></date-stepper>
      </header>
      <article>
        <checkin-toggle></checkin-toggle>
      </article>
    `;
  }
}

customElements.define("time-tracker", TimeTracker);
