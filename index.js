// Library Bootstrap
import {
  css,
  html,
  LitElement,
} from 'https://unpkg.com/lit-element/lit-element.js?module';

import { export2Excel } from './src/js/export-util.js';

import './src/js/checkin-toggle.js';
import './src/js/date-stepper.js';
import './src/js/settings-dialog.js';
import './src/js/time-list.js';
import './src/js/time-manager.js';
import './src/js/sync-dialog.js';
import customEvent from './src/js/custom-event.js';

class TimeTracker extends LitElement {
  static get properties() {
    return {
      date: { type: String, reflect: true },
      settingsVisible: { type: Boolean },
      syncVisible: { type: Boolean },
      startStop: { type: String },
    };
  }

  constructor() {
    super();
    this.settingsVisible = false;
    this.syncVisible = false;
  }

  static get styles() {
    return css`
      :host {
        font-family: sans-serif;
      }

      header {
        display: flex;
        height: 60px;
        padding: 0 20px;
        align-items: center;
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
      }

      img {
        height: 2.5rem;
        vertical-align: middle;
      }

      h1 {
        flex: 1;
        margin: 3px 0 0 1rem;
        font-size: 20px;
        font-weight: normal;
        vertical-align: middle;
      }

      button {
        margin-left: 1.2rem;
        padding: 0;
        background: none;
        border: none;
        cursor: pointer;
      }

      button img {
        height: 25px;
      }
    `;
  }

  render() {
    const {
      handleDateChange,
      handleTimeListChange,
      handleStartStop,
      toggleSettings,
      toggleSync,
      date,
      startStop = '',
      settingsVisible,
      syncVisible,
    } = this;

    return html`
      <header>
        <img src="icons/axaLogo.svg" alt="logo" />
        <h1>TimeTracker</h1>
        <button @click=${toggleSync}>
          <img src="icons/sync_black_24dp.svg" alt="exportieren" />
        </button>
        <button @click=${export2Excel()}>
          <img src="icons/save_alt-24px.svg" alt="exportieren" />
        </button>
        <button @click=${toggleSettings}>
          <img src="icons/settings-24px.svg" alt="Einstellungen" />
        </button>
      </header>
      <article>
        <date-stepper @change=${handleDateChange}></date-stepper>
        <time-manager date=${date}></time-manager>
        <time-list
          .date=${date}
          .startStop="${startStop}"
          @change=${handleTimeListChange}
        ></time-list>
        <checkin-toggle
          @change="${handleStartStop}"
          date=${date}
        ></checkin-toggle>
        <settings-dialog
          @close="${toggleSettings}"
          .open="${settingsVisible}"
        ></settings-dialog>
        <sync-dialog
          @close="${toggleSync}"
          .open="${syncVisible}"
        ></sync-dialog>
      </article>
    `;
  }

  handleTimeListChange({ target }) {
    const timeManagerDomNode = target.previousElementSibling;
    customEvent('refresh', null, timeManagerDomNode);
  }

  handleStartStop({ detail }) {
    this.startStop = detail;
  }

  handleDateChange({ detail: { date } }) {
    this.date = new Date(date);
  }

  toggleSettings() {
    this.settingsVisible = !this.settingsVisible;
  }

  toggleSync() {
    this.syncVisible = !this.syncVisible;
  }
}

customElements.define('time-tracker', TimeTracker);
