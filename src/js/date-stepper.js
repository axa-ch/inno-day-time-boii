const { LitElement, html, css } = window;

class DateStepper extends LitElement {
  static get properties() {
    return {
      mood: { type: String }
    };
  }

  static get styles() {
    return css`
      .mood {
        color: green;
      }
    `;
  }

  render() {
    return html`
      <div>
        <button>〈</button>
        <button>〉</button>
      </div>
      Web Components are <span class="mood">${this.mood}</span>!
    `;
  }
}

customElements.define("date-stepper", DateStepper);
