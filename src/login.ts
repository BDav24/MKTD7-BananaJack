import { html, render } from 'lit-html';

import BackendApi from './api';

const style = `
  form[name=login] {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 1.2em;
      margin: 1em;
  }

  form label,
  form button {
      width: 50%;
  }

  form label {
      display: flex;
      align-items: center;
  }

  form label input {
      flex-grow: 1;
      margin: .5em;
      background: hsla(0, 100%, 100%, .5);
      border: .125em solid rgba(0, 0, 0, .25);
      border-radius: .125em;
      padding: .125em;
      font-size: 1em;
      color: var(--green, green);
      transition: all .4s;
      outline: thin currentColor;
  }

  form label input:focus {
      background: hsla(0, 100%, 100%, .75);
  }
`

class Login extends HTMLElement {

  private username = ''

  constructor() {
    super();
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    render(this.template(), this.shadowRoot)
  }

  login = async (event) => {
    event.preventDefault()
    const user = await BackendApi.login(this.username)
    this.dispatchEvent(new CustomEvent('login', { detail: { user } }))
  }

  template() {
    return html`
      <style>${style}</style>
      <form name="login">
        <label>
          Name
          <input name="name" value="${this.username}"
            @change="${(e) => this.username = e.target.value}"
            required="" placeholder="Enter your name">
        </label>
        <button @click=${this.login}>Login</button>
      </form>
    `;
  }

}

customElements.define('bj-login', Login);
