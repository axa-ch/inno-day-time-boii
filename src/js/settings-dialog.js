import { css, html, LitElement } from "https://unpkg.com/lit-element/lit-element.js?module";

class SettingsDialog extends LitElement {
  static get properties() {
    return {
      hoursPerDay: { type: Number },
    };
  }

  constructor() {
    super();
    this.hoursPerDay = 8.4;
  }

  static get styles() {
    return css`
      div {
        display: flex;
        position: fixed;
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
      }
    `;
  }

  render() {
    const { hoursPerDay } = this;

    return html`
      <div>
        <article>
          <label>
            Sollarbeitszeit:
            <input type="text" value=${hoursPerDay} />
          </label>
          <button>Abbrechen</button>
          <button>Speichern</button>
        </article>
      </div>
    `;
  }
}

customElements.define("settings-dialog", SettingsDialog);
