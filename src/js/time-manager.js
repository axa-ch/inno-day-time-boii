import {
  css,
  html,
  LitElement,
} from 'https://unpkg.com/lit-element/lit-element.js?module';
import {dailyHours, decimal2HoursMinutes, getTimePairs, timeToDecimal, human2decimalTime} from './date-manipulation.js';

class TimeManager extends LitElement {
  static get properties() {
    return {
      date: { type: String },
      //internal props:
      workedHours: { type: Number },
      endTime: { type: Number },
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

    //init
    this.workedHours = 0;
    this.endTime = 0;
  }

  set date(dateString) {
    this._date = dateString;
    this.refresh();
  }

  get date() {
    return this._date;
  }

  async setWorkedHours() {
    const storedTimes = await getTimePairs('time-pairs-only');
    const nowDecimal = human2decimalTime();
    let newWorkedHours = 0

    storedTimes.forEach(([startTime, stopTime]) => {
      if(startTime) {
        const stopTimeIsNaN = isNaN(stopTime) || stopTime === undefined;

        if(stopTimeIsNaN) {
          //simulate endTime = now
          stopTime = nowDecimal;
        }

        // do not count if given startTime is before now
        if(startTime <= nowDecimal) {
          newWorkedHours += stopTime - startTime;
        }
      }
    });

    this.workedHours = newWorkedHours;
  }

  setEndtime() {
    dailyHours().then((hours) =>{
      const hoursLeftDecimal = hours - this.workedHours;
      const nowDecimal = human2decimalTime();

      this.endTime = nowDecimal + hoursLeftDecimal;
    } )
  }

  refresh() {
    this.setWorkedHours();
    this.setEndtime();
  }

  firstUpdated() {
    this.refresh();

    setInterval(() => {
      this.refresh();
    }, 29000); // refresh every half minute - 1 second
  }

  render() {
    return html`
      <section>
        <p class="info">
          <span>
            <img src="icons/hourglass_bottom-24px.svg" />
            ${ decimal2HoursMinutes(this.workedHours) }
          </span>
          <span
            ><img src="icons/directions_run-24px.svg" />
            ${ decimal2HoursMinutes(this.endTime) }</span
          >
        </p>
      </section>
    `;
  }
}

customElements.define('time-manager', TimeManager);
