import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element/lit-element.js?module";

import { classMap } from "https://unpkg.com/lit-html/directives/class-map.js?module";

const START = "start";
const STOP = "stop";

class CheckinToggle extends LitElement {
  static get properties() {
    return {
      activeButton: { type: String }
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

      button {
        flex: 1;
        font-size: 28px;
        margin: 0;
        height: 70px;
        background-color: #f2f2f2;
        color: #000;
        border: none;
        outline: none;
      }

      .container.start button.start,
      .container.stop button.stop {
        height: 80px;
        box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.5);
        background-color: #00008f;
        border-color: #00008f;
        color: #fff;
        cursor: pointer;
      }
    `;
  }

  fireEvent(modus) {
    // fire up change
    const event = new CustomEvent("change", {
      detail: {
        modus: modus
      }
    });
    this.dispatchEvent(event);
  }

  handleClick = event => {
    const { target } = event;
    const type = target.classList.contains("start") ? START : STOP;
    const newMode = type === START ? STOP : START;
    this.activeButton = newMode;
    this.fireEvent(newMode);
  };

  render() {
    const { activeButton, handleClick } = this;
    const classes = {
      container: true,
      start: activeButton === START,
      stop: activeButton === STOP
    };
    return html`
      <div class="${classMap(classes)}">
        <button class="start" @click="${handleClick}" class="toggle-button">
          Kommen
        </button>
        <button class="stop" @click="${handleClick}" class="toggle-button">
          Gehen
        </button>
      </div>
    `;
  }
}

customElements.define("checkin-toggle", CheckinToggle);
