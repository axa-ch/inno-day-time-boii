import Persistence from "./persistence.js";
import {
    LitElement,
    html,
    css
} from "https://unpkg.com/lit-element/lit-element.js?module";

class TimeList extends LitElement {
    static get properties() {
        return {
            date: {type: String},
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
        font-size: 2rem;
      }
      
     .row {
        display: flex;
        align-items: center;   
     }
     
     .row > button > img {
         width: 50px;
         height: 50px;
         
     }
     
     .row > input {
            width: 100px;
            height: 50px;
        
     }
     
     .row > span {
        margin: 20px;
     }
     
     .row > button {
        margin-left: 50px;
        height: 50px;
     }
    `;
    }

    static totalHours = 8.4;

    constructor() {
        super();
        this.store2 = Persistence.getInstance();
        //this.store2.add('08:20',0, 'newindex')
        console.log(this.store2.getItems())

        this.items = [
            {
                start: '08:20',
                end: '09:22'
            },
            {
                start: '10:20',
                end: '11:22'
            },
        ]
    }

    handleClickDelete = ev => {
        console.log(ev.target.parentElement)
    };

    render() {
        return html`
      <section>
        <details open>
          <summary>
            Eingetragene Zeiten:
          </summary>
          <ol>
              ${ this.items.map(item => html`
                <li class="row">
                    <input type="time" value="${item.start}"><span>-</span><input type="time" value="${item.end}"><button @click="${this.handleClickDelete}"><img src="../src/icons/delete_forever-24px.svg"></button>
                </li>
              `) 
                }
            
          </ol>
          <div class="row">+</div>
        </details>
      </section>
    `;
    }
}

customElements.define("time-list", TimeList);
