import "./src/js/date-stepper.js";

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
      </article>
    `;
  }
}

customElements.define("time-tracker", TimeTracker);
