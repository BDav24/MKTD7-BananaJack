import { html, render } from 'lit-html';

import BackendApi from './api';

const style = `
  .logged {
      position: absolute;
      top: 0;
      right: 0;
  }
`

class User extends HTMLElement {
  private user = null

  constructor() {
    super();
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.user = JSON.parse(this.getAttribute('user'))
    render(this.template(), this.shadowRoot)
  }

  logout = async () => {
    await BackendApi.logout(this.user.id)
    // TODO: notify parent to display login page
  }

  template() {
    return html`
      <style>${style}</style>
      <div class="logged">
        <span class="name">${this.user.name}</span>
        <button type="button" @click=${this.logout}>Logout</button>
      </div>
    `;
  }
}

customElements.define('bj-user', User);
