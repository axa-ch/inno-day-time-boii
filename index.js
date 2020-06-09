import "./src/js/date-stepper.js";
import "./src/js/checkin-toggle.js";
import "./src/js/time-manager.js";
import "./src/js/time-list.js";
// Library Bootstrap
import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element/lit-element.js?module";

class TimeTracker extends LitElement {
  static get properties() {
    return {
      date: { type: String, reflect: true }
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: sans-serif;
      }

      h1 {
        display: inline;
        margin-left: 1rem;
      }

      .logo {
        height: 2rem;
      }

      date-stepper {
        margin-top: 1rem;
      }
    `;
  }

  handleChange = ({ detail: { date } }) => {
    this.date = date.toString();
  };

  render() {
    return html`
      <header>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 283.467 283.467"
          class="logo"
        >
          <path fill="#00008f" d="M.003.003h283.464v283.464H.003z" />
          <path
            fill="#ff1721"
            d="M175.659 139.99L283.467 0h-15.923L159.38 139.99h16.279z"
          />
          <path
            fill="#fff"
            d="M216.597 202.461c4.941 13.823 15.122 49.795 19.17 52.661h-26.729a44.571 44.571 0 0 0-1.254-9.434c-1.153-4.111-10.821-35.214-10.821-35.214h-42.456l-6.675 9.463s8.018 25.097 8.515 26.327c.865 2.217 4.693 8.858 4.693 8.858h-25.615s-.664-3.833-.913-5.43c-.2-1.289-2.427-8.349-2.427-8.349s-5.806 6.362-7.388 9.312c-1.596 2.943-2.304 4.467-2.304 4.467h-20.04s-.668-3.833-.917-5.43c-.196-1.289-2.647-8.916-2.647-8.916s-5.61 6.812-7.207 9.756c-1.587 2.95-2.27 4.59-2.27 4.59h-19.82s5.601-5.332 7.559-7.622c3.3-3.882 15.6-19.956 15.6-19.956l-4.931-17.07H45.586s-24.023 31.567-24.97 32.543c-.957.962-7.96 11.011-8.116 12.105H0v-7.949a5.987 5.987 0 0 1 .493-.479c.386-.283 18.213-22.412 34.59-44.233 14.717-19.029 28.526-37.535 29.737-39.297 2.934-4.263 7.163-13.467 7.163-13.467h21.781s.675 8.467 1.31 10.522c.565 1.817 13.837 45.362 14.15 45.831l7.338-9.385-12.543-38.614s-2.94-7.265-3.897-8.354h25.445a22.166 22.166 0 0 0 .83 6.919c1.034 3.184 6.489 22.866 6.489 22.866s17.354-21.753 18.369-23.315a14.1 14.1 0 0 0 2.143-6.47H174.6s-3.881 2.837-10.683 11.44c-2.285 2.896-24.673 31.348-24.673 31.348s1.953 6.66 2.905 9.976c.26.952.44 1.597.44 1.665 0 .03.493-.576 1.343-1.665 5.776-7.32 32.05-41.772 33.643-44.722 1.284-2.382 3.173-5.092 4.282-8.041h20.683s.478 6.176 1.109 7.885zm-31.475-32.612c-3.037 6.533-20.913 28.296-20.913 28.296h28.31s-5.488-16.9-6.445-20.709a30.233 30.233 0 0 1-.557-7.402c0-.346-.063-.908-.395-.185zm-108.775 0c-3.036 6.533-20.912 28.296-20.912 28.296h28.31s-5.483-16.9-6.44-20.709a30.233 30.233 0 0 1-.557-7.402c0-.346-.068-.908-.4-.185zm42.623 65.986l7.793-10.703c-.718-.772-5.107-14.082-5.107-14.082l-7.535 9.775z"
          />
        </svg>
        <h1>Time Tracker</h1>
        <date-stepper @change=${this.handleChange}></date-stepper>
      </header>
      <article>
        <time-manager date=${this.date}></time-manager>
        <time-list date=${this.date}></time-list>
        <checkin-toggle></checkin-toggle>
      </article>
    `;
  }
}

customElements.define("time-tracker", TimeTracker);
