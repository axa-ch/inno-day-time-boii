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
                  /><button @click="${() => handleClickDelete(index)}">
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
