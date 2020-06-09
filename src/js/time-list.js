import Persistence from "./persistence.js";
import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element/lit-element.js?module";

class TimeList extends LitElement {
  static get properties() {
    return {
      date: { type: String },
      totalHours: { type: Number }
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: sans-serif;
        color: #333;
      }
      .overtime {
        font-size: 14px;
        margin-top: 2rem;
        background-color: #f2f2f2;
        padding: 1rem;
        white-space: nowrap;
      }

      details,
      summary {
        outline: none;
        font-size: 2rem;
      }
    `;
  }

  static totalHours = 8.4;

  constructor() {
    super();
  }

  render() {
    return html`
      <section>
        <details>
          <summary @click="${this.handleAdd}">
            Eintragen
          </summary>
        </details>
      </section>
    `;
  }
}

customElements.define("time-list", TimeList);
