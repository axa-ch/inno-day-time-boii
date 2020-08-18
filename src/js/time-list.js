import Persistence from "./persistence.js";
import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element/lit-element.js?module";

class TimeList extends LitElement {
  static get properties() {
    return {
      date: { type: String },
      startStop: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: sans-serif;
        color: #333;
      }

      details,
      summary {
        outline: none;
        font-size: 16px;
      }

      section {
        margin: 20px 20px 90px;
      }

      .rowpause {
        display: flex;
        justify-content: center;
      }

      .rowplus {
        display: flex;
      }

      .row {
        display: flex;
        align-items: center;
      }

      .row > button > img {
        width: 30px;
        height: 30px;
      }

      .row > input {
        width: 80px;
        height: 30px;
        font-size: 15px;
      }

      .row > span {
        margin: 20px;
      }

      .row > button {
        margin-left: auto;
        margin-right: 50px;
        height: 36px;
      }

      .add {
        font-family: -webkit-pictograph, monospace;
        font-size: 32px;
        line-height: 1;
        padding-bottom: 4px;
        background: #00008f;
        color: #fff;
        width: 46px;
        border-radius: 5px;
        border: none;
      }

      .rowpause {
        color: #999;
      }
    `;
  }

  constructor() {
    super();
    this.store = Persistence.getInstance();
    //this.store2.add('08:20',0, 'newindex')
    console.log(this.store.getItems());

    this.items = [
      {
        start: "08:20",
        end: "09:22",
      },
      {
        start: "10:20",
        end: "11:22",
      },
    ];
  }

  handleClickDelete(ev) {
    console.log(ev.target.parentElement);
  }

  handleClickAdd(ev) {
    console.log(ev.target.parentElement);
  }

  render() {
    const { items, handleClickAdd, handleClickDelete } = this;

    return html`
      <section>
        <details open>
          <summary>
            Eingetragene Zeiten:
          </summary>
          <ol>
            ${items.map(
              ({ start, end, pause = "1:20" }) => html`
                <li class="row">
                  <input type="time" value="${start}" /><span>-</span
                  ><input type="time" value="${end}" /><button
                    @click="${handleClickDelete}"
                  >
                    <img src="icons/delete-24px.svg" />
                  </button>
                </li>
                <li class="rowpause">
                  ${pause} Abwesenheit
                </li>
              `
            )}
            <li class="row">
              <button @click="${handleClickAdd}" class="add">+</button>
            </li>
          </ol>
        </details>
      </section>
    `;
  }
}

customElements.define("time-list", TimeList);
