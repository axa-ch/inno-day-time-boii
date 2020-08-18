import {
  css,
  html,
  LitElement,
} from 'https://unpkg.com/lit-element/lit-element.js?module';
import Persistence from './persistence.js';

// const decimalTime2HoursMinutes = (decimal) =>
// `${Math.floor(decimal)}:${((decimal - Math.floor(decimal)) / 60).toFixed(0)}`;

class TimeManager extends LitElement {
  static get properties() {
    return {
      date: { type: String },
      totalHours: { type: Number },
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
        align-items: center;
        margin: 0 1rem;
        padding: 1rem;
        font-size: 16px;
        background-color: #f2f2f2;
        white-space: nowrap;
      }
    `;
  }

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
    return '18:15'; //decimalTime2HoursMinutes(nowDecimal + this.getWorkedHours());
  }

  changeShouldHours(ev) {
    this.totalHours = +ev.target.value || TimeManager.totalHours;
  }

  render() {
    return html`
      <section>
        <p class="info">
          <span>Feierabend: &nbsp; ${this.getEndtime()}</span>
          <label>
            Stunden:
            <input maxlength="4" type="time" value="${'08:24'}" readonly />
          </label>
        </p>
      </section>
    `;
  }
}

customElements.define('time-manager', TimeManager);
