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
        margin: 20px;
      }

      details,
      summary {
        outline: none;
        font-size: 16px;
      }

      ol {
        margin: 20px 0;
        padding: 0;
      }

      .row {
        display: flex;
        align-items: center;
      }

      .row input {
        flex: 1;
        height: 30px;
        font-size: 15px;
      }

      .row span {
        margin: 0 20px;
        font-weight: bold;
      }

      .delete {
        margin-left: 20px;
        padding: 0;
        border: none;
        background: none;
      }

      .delete img {
        width: 25px;
        vertical-align: middle;
      }

      .rowpause {
        display: flex;
        justify-content: center;
        margin: 10px 0 20px;
        color: #999;
      }

      .rowplus {
        display: flex;
      }

      .add {
        width: 40px;
        padding: 0;
        border-radius: 50%;
        border: none;
        background: #00008f;
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
            Eingetragene Zeiten:
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
                <li class="rowpause">
                  ${pause} Abwesenheit
                </li>
              `
            )}
            <li class="row">
              <button @click="${handleClickAdd}" class="add">
                <img src="icons/add-24px.svg" />
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
