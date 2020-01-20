const { LitElement, html, css } = window;

class CheckinToggle extends LitElement {
  static get properties() {
    return {
      mood: { type: String },
      activeButton: { type: String }
    };
  }
  constructor() {
    super();
    this.activeButton = "from";
  }
  static get styles() {
    return css`
      .container {
        border: 1px solid grey;
      }
      .active {
        box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.5);
      }
      .toggle-button {
        height: 40px;
      }
    `;
  }

  render() {
    return html`
      <div class="container">
        <button class="toggle-button active">Ein</button>
        <button class="toggle-button">Aus</button>
      </div>
    `;
  }
}

customElements.define("checkin-toggle", CheckinToggle);
