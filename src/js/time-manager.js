import Persistence from "./persistence.js";
import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element/lit-element.js?module";

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
      .overtime {
        font-size: 14px;
        margin-top: 2rem;
        background-color: #f2f2f2;
        padding: 1rem;
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
    this.totalHours = TimeManager.totalHours;
    if (this.date) {
      this.currentDate = new Date(this.date);
    } else {
      this.currentDate = new Date();
    }

    this.store = Persistence.getInstance();
  }

  getWorkedHours() {
    return 0;
  }

  getOvertime = () => {
    return -1 * (this.totalHours - this.getWorkedHours());
  };

  changeShouldHours = ev => {
    this.totalHours = +ev.target.value || TimeManager.totalHours;
  };

  handleAdd = () => {
    const currentDate = new Date();
    this.currentDate.setHours(currentDate.getHours());
    this.currentDate.setMinutes(currentDate.getMinutes());
    this.currentDate.setSeconds(currentDate.getSeconds());

    this.store.add(
      `${currentDate.getHours()}:${currentDate.getMinutes()}`,
      Persistence.FROM
    );
  };

  render() {
    return html`
      <section>
        <p class="overtime">
          Überstunden: ${this.getOvertime()} | Soll:
          <input
            maxlength="4"
            type="text"
            @input="${this.changeShouldHours}"
            value="${this.totalHours}"
          />
        </p>
        <details>
          <summary @click="${this.handleAdd}">
            Eintragen
          </summary>
        </details>
      </section>
    `;
  }
}

customElements.define("time-manager", TimeManager);
