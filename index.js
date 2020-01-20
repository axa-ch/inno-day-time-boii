import "./src/js/date-stepper.js";

const { LitElement, html } = window;

class TimeTracker extends LitElement {
  render() {
    return html`
      <header>
        <date-stepper mood="great"></date-stepper>
      </header>
      <article>
        TODO
      </article>
    `;
  }
}

customElements.define("time-tracker", TimeTracker);
