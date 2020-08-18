import {
  css,
  html,
  LitElement,
} from 'https://unpkg.com/lit-element/lit-element.js?module';

import fireEvent from './custom-event.js';
import { dailyHours } from './date-manipulation.js';

class SettingsDialog extends LitElement {
  static get properties() {
    return {
      hoursPerDay: { type: Number },
      open: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.open = false;
    (async () => {
      this.hoursPerDay = await dailyHours();
    })();
    this.close = this.close.bind(this);
  }

  static get styles() {
    return css`
      div {
        display: flex;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, 0.4);
      }

      article {
        width: 100%;
        max-width: 400px;
        margin: 20px;
        padding: 20px;
        background: #ffffff;
        box-shadow: 0px 0 4px rgba(0, 0, 0, 0.25);
        border-radius: 2px;
      }

      label {
        display: block;
        font-size: 14px;
        font-weight: bold;
      }

      input {
        width: 100%;
        margin: 10px 0 15px;
        padding: 10px 20px;
        box-sizing: border-box;
        border: 1px solid #cccccc;
        font-size: 14px;
      }

      button {
        margin: 0 5px 0 0;
        padding: 10px 20px;
        background: #00008f;
        border: none;
        outline: none;
        text-transform: uppercase;
        color: #ffffff;
        cursor: pointer;
        border-radius: 2px;
      }

      .close {
        opacity: 0.5;
      }
    `;
  }

  render() {
    const { hoursPerDay, open, storeHoursPerDay, close } = this;

    return open
      ? html`
          <div>
            <article>
              <label>
                Sollarbeitszeit (h/Tag)
                <input type="text" class="daily" value=${hoursPerDay} />
              </label>
              <button class="close" @click="${close}">
                Abbrechen
              </button>
              <button class="store" @click="${storeHoursPerDay}">
                Speichern
              </button>
            </article>
          </div>
        `
      : html``;
  }

  close() {
    fireEvent('close', null, this);
  }

  async storeHoursPerDay() {
    const { store, close, hoursPerDay } = this;
    const dailyString = this.shadowRoot.querySelector('.daily').value;
    const newDaily = parseFloat(dailyString);
    if (isFinite(newDaily) && hoursPerDay !== newDaily) {
      this.hoursPerDay = await dailyHours(newDaily);
      close();
    }
  }
}

customElements.define('settings-dialog', SettingsDialog);
