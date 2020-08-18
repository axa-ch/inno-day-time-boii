import {
  css,
  html,
  LitElement,
} from 'https://unpkg.com/lit-element/lit-element.js?module';
import { dailyHours } from './date-manipulation.js';

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
        margin: 0 20px;
        padding: 15px 20px;
        font-size: 20px;
        background-color: #f2f2f2;
        white-space: nowrap;
        border-radius: 2px;
      }

      img {
        width: 25px;
        vertical-align: bottom;
      }
    `;
  }

  constructor() {
    super();

    (async () => {
      this.totalHours = await dailyHours();
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
    return '18:15'; //decimalTime2HoursMinutes(nowDecimal + this.getWorkedHours());
  }

  render() {
    return html`
      <section>
        <p class="info">
          <span>
            <img src="icons/hourglass_bottom-24px.svg" />
            08:24
          </span>
          <span
            ><img src="icons/directions_run-24px.svg" />
            ${this.getEndtime()}</span
          >
        </p>
      </section>
    `;
  }
}

customElements.define('time-manager', TimeManager);
