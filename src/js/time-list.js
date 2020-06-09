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
            totalHours: {type: Number}
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
    }

    render() {
        return html`
      <section>
        <details open>
          <summary>
            Eingetragene Zeiten:
          </summary>
          <ol>
            <li class="row">
                <input type="time"><span>-</span><input type="time"><button><img src="../src/icons/delete_forever-24px.svg"></button>
            </li>
          </ol>
          <div>+</div>
        </details>
      </section>
    `;
    }
}

customElements.define("time-list", TimeList);
