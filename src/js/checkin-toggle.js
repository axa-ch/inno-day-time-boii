import { css, html, LitElement } from "https://unpkg.com/lit-element/lit-element.js?module";

const START = "start";
const STOP = "stop";

class CheckinToggle extends LitElement {
  static get properties() {
    return {
      activeButton: { type: String },
    };
  }

  constructor() {
    super();

    this.activeButton = START;
    this.handleClick = this.handleClick.bind(this);
  }

  static get styles() {
    return css`
      .container {
        display: flex;
        position: fixed;
        right: 0;
        left: 0;
        bottom: 0;
        padding: 10px;
        color: #fff;
      }

      button {
        flex: 1;
        height: 45px;
        margin: 10px;
        font-size: 28px;
        border: none;
        background-color: #f2f2f2;
        color: #000;
        outline: none;
        cursor: pointer;
      }

      button[disabled] {
        cursor: unset;
      }

      .start {
        background: #1cc54e;
      }

      .start[disabled] {
        background: #9fd9b4;
      }

      .stop {
        background: #c91432;
      }

      .stop[disabled] {
        background: #e196aa;
      }
    `;
  }

  render() {
    const { activeButton, handleClick } = this;

    return html`
      <div class="container">
        <button
          class="start"
          @click="${handleClick}"
          ?disabled=${activeButton === STOP}
        >
          <img src="icons/play_arrow-24px.svg" alt="einschalten" />
        </button>
        <button
          class="stop"
          @click="${handleClick}"
          ?disabled=${activeButton === START}
        >
          <img src="icons/stop-24px.svg" alt="einschalten" />
        </button>
      </div>
    `;
  }

  handleClick = (event) => {
    const { target } = event;

    const oldMode = target.classList.contains("start") ? START : STOP;
    const newMode = oldMode === START ? STOP : START;

    this.activeButton = newMode;
    this.fireEvent(oldMode);
  };

  fireEvent(modus) {
    // fire up change
    const event = new CustomEvent("change", {
      detail: {
        modus,
      },
    });

    this.dispatchEvent(event);
  }
}

customElements.define("checkin-toggle", CheckinToggle);
