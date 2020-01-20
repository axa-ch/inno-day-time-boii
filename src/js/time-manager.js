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
          <button>➕</button>
        </div>
      </section>
    `;
  }
}

customElements.define("time-manager", TimeManager);
