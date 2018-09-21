import './base.css';
import { html, render } from 'lit-html';

import './login';

class BananaJack extends HTMLElement {
  private page = 'login'

  constructor() {
    super();
    this.attachShadow({ mode: 'open' })
  }

  static get observedAttributes() {
      return ['page'];
  }

  connectedCallback() {
    render(this.template(), this.shadowRoot)
  }

  onLogin() {
    this.page = 'rooms'
  }

  template() {
    console.log(this.page)
    return html`
      <bj-login @login=${this.onLogin}></bj-login>
    `;
  }

}

customElements.define('banana-jack', BananaJack);
