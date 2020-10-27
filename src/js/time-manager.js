import {
  css,
  html,
  LitElement,
} from 'https://unpkg.com/lit-element/lit-element.js?module';
import {dailyHours, decimal2HoursMinutes, getTimePairs, timeToDecimal} from './date-manipulation.js';

class TimeManager extends LitElement {
  static get properties() {
    return {
      date: { type: String },
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

  async setWorkedHours() {
    const storedTimes = await getTimePairs('time-pairs-only');
    const now = new Date();
    const nowDecimal = timeToDecimal(now.getHours(), now.getMinutes());
    this.workedHours = 0;

    storedTimes.forEach((value) => {
      if(!isNaN(value[0])) {
        let endTime;

        // no endTime is given and if given, the time is before now
        if(isNaN(value[1]) && value[0] <= nowDecimal) {
          //simulate endTime = now
          endTime = nowDecimal;
        } else {
          endTime = value[1];
        }
        this.workedHours = this.workedHours + (endTime - value[0]);
      }
    });
  }

  setEndtime() {
    dailyHours().then((hours) =>{
      const now = new Date();
      const hoursLeftDecimal = hours - this.workedHours;
      const nowAsDecimal = timeToDecimal(now.getHours(), now.getMinutes())

      this.endTime = nowAsDecimal + hoursLeftDecimal;
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
