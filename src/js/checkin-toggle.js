import {
  css,
  html,
  LitElement,
} from 'https://unpkg.com/lit-element/lit-element.js?module';
import fireEvent from './custom-event.js';

const START = 'start';
const STOP = 'stop';

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
        padding: 15px;
        background: #ffffff;
        color: #fff;
      }

      button {
        display: flex;
        flex: 1;
        height: 45px;
        margin: 5px;
        align-items: center;
        justify-content: center;
        border: none;
        background-color: #f2f2f2;
        font-size: 16px;
        color: #fff;
        outline: none;
        cursor: pointer;
        border-radius: 2px;
      }

      button[disabled] {
        cursor: unset;
        opacity: 0.2;
      }

      .start {
        background: #1a0082;
      }

      .stop {
        background: #f9205c;
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
          Kommen
          <img src="icons/play_arrow-24px.svg" alt="einschalten" />
        </button>
        <button
          class="stop"
          @click="${handleClick}"
          ?disabled=${activeButton === START}
        >
          Gehen
          <img src="icons/stop-24px.svg" alt="ausschalten" />
        </button>
      </div>
    `;
  }

  handleClick(event) {
    const { target } = event;

    const oldState = target.classList.contains(START) ? START : STOP;
    // toggle state
    const newState = oldState === START ? STOP : START;
    this.activeButton = newState;
    // notify parent(s)
    fireEvent('change', oldState, this);
  }
}

customElements.define('checkin-toggle', CheckinToggle);
