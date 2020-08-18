import {
  css,
  html,
  LitElement,
} from 'https://unpkg.com/lit-element/lit-element.js?module';
import Persistence from './persistence.js';

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

      section {
        margin: 20px 20px 0;
      }

      details,
      summary {
        outline: none;
        font-size: 16px;
        font-weight: bold;
      }

      ol {
        margin: 20px 0 0;
        padding: 10px;
        background: #f2f2f2;
        border-radius: 2px;
      }

      .row {
        display: flex;
        margin: 10px;
        align-items: center;
      }

      .row input {
        flex: 1;
        padding: 10px;
        box-sizing: border-box;
        border: 1px solid #cccccc;
        font-size: 14px;
      }

      .row span {
        margin: 0 20px;
        font-weight: bold;
      }

      .delete {
        margin-left: 15px;
        padding: 0;
        border: none;
        background: none;
        cursor: pointer;
      }

      .delete img {
        width: 25px;
        vertical-align: middle;
      }

      .rowplus {
        display: flex;
        justify-content: center;
        padding: 10px;
      }

      .add {
        height: 40px;
        width: 40px;
        padding: 0;
        border-radius: 50%;
        border: none;
        background: #00008f;
        cursor: pointer;
      }

      .add img {
        vertical-align: middle;
      }
    `;
  }

  constructor() {
    super();

    this.store = Persistence.getInstance();
    console.log(this.store.getItems());

    this.items = [
      {
        start: '08:20',
        stop: '09:22',
      },
      {
        start: '10:20',
        stop: '11:22',
      },
    ];
  }

  update(changedProperties) {
    super.update(changedProperties);

    if (changedProperties.has('startStop')) {
      const date = new Date();

      const currentTime = `${date
        .getHours()
        .toString()
        .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

      if (this.startStop === 'start') {
        this.saveItem(undefined, {
          start: currentTime,
          stop: '',
        });
      } else if (this.items.length > 0) {
        this.handleChange(this.items.length - 1, 'stop', currentTime);
      }
    }
  }

  render() {
    const { items, handleClickAdd, handleClickDelete, handleChange } = this;

    return html`
      <section>
        <details open>
          <summary>
            Eingetragene Zeiten
          </summary>
          <ol>
            ${items.map(
              ({ start, stop, pause = '1:20' }, index) => html`
                <li class="row">
                  <input
                    type="time"
                    .value="${start}"
                    @change="${(event) =>
                      handleChange(index, 'start', event.target.value)}"
                  /><span>-</span
                  ><input
                    type="time"
                    .value="${stop}"
                    @change="${(event) =>
                      handleChange(index, 'stop', event.target.value)}"
                  /><button
                    @click="${() => handleClickDelete(index)}"
                    class="delete"
                  >
                    <img src="icons/delete-24px.svg" />
                  </button>
                </li>
              `
            )}
            <li class="rowplus">
              <button @click="${handleClickAdd}" class="add">
                <img src="icons/add-24dp.svg" />
              </button>
            </li>
          </ol>
        </details>
      </section>
    `;
  }

  handleClickDelete = (index) => {
    this.items.splice(index, 1);
    this.requestUpdate();

    // delete from db
  };

  handleClickAdd() {
    this.saveItem(undefined, { start: '', stop: '' });
  }

  handleChange = (index, which, text) => {
    if (which === 'start') {
      this.items[index].start = text;
    } else {
      this.items[index].stop = text;
    }

    this.saveItem(index, this.items[index]);
  };

  saveItem(index, item) {
    if (index === undefined) {
      this.items.push(item);
    }

    this.requestUpdate();
    // save to db
  }
}

customElements.define('time-list', TimeList);
