import Persistence from "./persistence.js";

const { LitElement, html, css } = window;

class TimeManager extends LitElement {
  static get properties() {
    return {
      date: { type: String },
      totalHours: { type: Number }
    };
  }

  static get styles() {
    return css``;
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
        <p>
          Überstunden: ${this.getOvertime()} | Soll Stunden:
          <input
            maxlength="4"
            type="text"
            @input="${this.changeShouldHours}"
            value="${this.totalHours}"
          />
        </p>
        <div>
          <span>Eintragen</span>
          <button @click="${this.handleAdd}">➕</button>
        </div>
      </section>
    `;
  }
}

customElements.define("time-manager", TimeManager);
