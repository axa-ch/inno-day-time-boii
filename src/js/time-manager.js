import Persistence from "./persistence.js";
import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element/lit-element.js?module";

const decimalTime2HoursMinutes = decimal =>
  `${Math.floor(decimal)}:${((decimal - Math.floor(decimal)) / 60).toFixed(0)}`;

class TimeManager extends LitElement {
  static get properties() {
    return {
      date: { type: String },
      totalHours: { type: Number }
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: sans-serif;
        color: #333;
      }
      .info {
        display: flex;
        justify-content: space-between;
        width: 90%;
        padding: 1rem 42px;
        font-size: 20px;
        margin-top: 2rem;
        background-color: #f2f2f2;
        white-space: nowrap;
      }

      details,
      summary {
        outline: none;
        font-size: 2rem;
      }
    `;
  }

  static totalHours = 8.4;

  constructor() {
    super();
    this.store = Persistence.getInstance();
    const { date, store } = this;
    this.currentDate = date ? new Date(date) : new Date();
    (async () => {
      this.totalHours = await store.daily();
    })();
  }

  getWorkedHours() {
    return 0;
  }

  getOvertime() {
    return -1 * (this.totalHours - this.getWorkedHours());
  }

  getEndtime() {
    const { date, store } = this;
    //const nowDecimal = store.add();
    return "18:15"; //decimalTime2HoursMinutes(nowDecimal + this.getWorkedHours());
  }

  changeShouldHours = ev => {
    this.totalHours = +ev.target.value || TimeManager.totalHours;
  };

  render() {
    return html`
      <section>
        <p class="info">
          <span>Feierabend: &nbsp; ${this.getEndtime()}</span>
          <label
            >Stunden:&nbsp;
            <input maxlength="4" type="time" value="${"08:24"}" readonly />
          </label>
        </p>
      </section>
    `;
  }
}

customElements.define("time-manager", TimeManager);
