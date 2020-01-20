const { LitElement, html, css } = window;

const START = "start";
const STOP = "stop";

class CheckinToggle extends LitElement {
  static get properties() {
    return {
      mood: { type: String },
      activeButton: { type: String }
    };
  }
  constructor() {
    super();
    this.activeButton = START;
  }
  static get styles() {
    return css`
      .container {
        padding: 5px;
        display: flex;
        flex-wrap: nowrap;
        position: fixed;
        right: 0;
        left: 0;
        bottom: 0;
        color: #fff;
        box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.5);
        align-items: center;
      }
      .not-active {
        height: 70px;
        background-color: #f2f2f2;
        color: #000;
        border: 2px solid #9e9e9e;
      }
      .active {
        height: 80px;
        box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.5);
        background-color: #00008f;
        border-color: #00008f;
        color: #fff;
        cursor: pointer;
      }
      .toggle-button {
        flex: 1;
        font-size: 28px;
        margin: 5px;
      }
    `;
  }
  handleClick = modus => {
    // this.fireEvent();
    console.log(modus, "modus");
    if (this.activeButton === modus) {
      if (modus === START) {
        this.activeButton = STOP;
      } else {
        this.activeButton = START;
      }
    }
  };
  render() {
    let event = new CustomEvent("cat", {
      which: {
        hazcheeseburger: true
      }
    });

    return html`
      <div class="container">
        ${this.activeButton === START
          ? html`
              <button
                @click="${() => this.handleClick(START)}"
                class="toggle-button active"
              >
                Ein
              </button>
              <button
                @click="${() => this.handleClick(STOP)}"
                class="toggle-button not-active"
              >
                Aus
              </button>
            `
          : html`
              <button
                @click="${() => this.handleClick(START)}"
                class="toggle-button not-active"
              >
                Ein
              </button>
              <button
                @click="${() => this.handleClick(STOP)}"
                class="toggle-button active"
              >
                Aus
              </button>
            `}
      </div>
    `;
  }
}

customElements.define("checkin-toggle", CheckinToggle);
