import {
  css,
  html,
  LitElement,
} from 'https://unpkg.com/lit-element/lit-element.js?module';

import fireEvent from './custom-event.js';
import Persistence from './persistence.js';

class SettingsDialog extends LitElement {
  static get properties() {
    return {
      hoursPerDay: { type: Number },
      open: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.store = Persistence.getInstance();
    this.open = false;
    (async () => {
      this.hoursPerDay = await this.store.daily();
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
      }

      label {
        display: block;
        margin: 0 0 1rem;
        font-size: 14px;
        font-weight: bold;
      }

      input {
        width: 100%;
        margin-top: 6px;
        padding: 0.6rem;
        box-sizing: border-box;
        border: 1px solid #cccccc;
        font-size: 14px;
      }

      button {
        margin-right: 0.6rem;
        padding: 0.6rem 1.2rem;
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
      this.hoursPerDay = await store.daily(newDaily);
      close();
    }
  }
}

customElements.define('settings-dialog', SettingsDialog);
