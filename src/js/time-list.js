import Persistence from "./persistence.js";
import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element/lit-element.js?module";

class TimeList extends LitElement {
  static get properties() {
    return {
      date: { type: String }
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
        font-weight: bold;
        font-size: 20px;
        background: #00008f;
        color: #fff;
        width: 46px;
        border-radius: 5px;
      }

      .rowpause {
        color: #999;
      }
    `;
  }

  static totalHours = 8.4;

  constructor() {
    super();
    this.store2 = Persistence.getInstance();
    //this.store2.add('08:20',0, 'newindex')
    console.log(this.store2.getItems());

    this.items = [
      {
        start: "08:20",
        end: "09:22"
      },
      {
        start: "10:20",
        end: "11:22"
      }
    ];
  }

  handleClickDelete = ev => {
    console.log(ev.target.parentElement);
  };

  handleClickAdd = ev => {
    console.log(ev.target.parentElement);
  };

  render() {
    return html`
      <section>
        <details open>
          <summary>
            Eingetragene Zeiten:
          </summary>
          <ol>
            ${this.items.map(
              item => html`
                <li class="row">
                  <input type="time" value="${item.start}" /><span>-</span
                  ><input type="time" value="${item.end}" /><button
                    @click="${this.handleClickDelete}"
                  >
                    <img src="../src/icons/delete_forever-24px.svg" />
                  </button>
                </li>
                <li class="rowpause">
                  1:20 Abwesenheit
                </li>
              `
            )}
            <li class="row">
              <button @click="${this.handleClickAdd}" class="add">+</button>
            </li>
          </ol>
        </details>
      </section>
    `;
  }
}

customElements.define("time-list", TimeList);
