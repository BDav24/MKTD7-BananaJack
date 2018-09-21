import './base.css';
import { html, render } from 'lit-html';

import BackendApi from './api';
import './login';
import './room';
import './rooms';
import './user';

class BananaJack extends HTMLElement {
  private page = 'login'
  private user
  private rooms = []
  private roomId

  constructor() {
    super();
    this.attachShadow({ mode: 'open' })
    this.init()
  }

  async init() {
    this.rooms = await BackendApi.getRooms()
    // this.page = 'rooms' // XXX
    this.update()
  }

  static get observedAttributes() {
    return ['page'];
  }

  connectedCallback() {
    this.update()
  }

  onLogin = (e: CustomEvent) => {
    this.user = e.detail.user
    this.page = 'rooms'
    this.update()
  }

  joinRoom = (e: CustomEvent) => {
    this.roomId = e.detail.roomId
    this.page = 'room'
    this.update()
  }

  update() {
    render(this.template(), this.shadowRoot)
  }

  findRoom = (roomId) => {
    return this.rooms.find(({id}) => id === this.roomId)
  }

  template() {
    return html`
      ${this.user ? html`<bj-user user=${JSON.stringify(this.user)}></bj-user>` : ''}
      ${
        this.page === 'rooms' ? html`<bj-rooms rooms=${JSON.stringify(this.rooms)} @join=${this.joinRoom}></bj-rooms>`
          : this.page === 'room' ? html`<bj-room room=${JSON.stringify(this.findRoom(this.roomId))} user=${JSON.stringify(this.user)}></bj-room>`
          : html`<bj-login @login=${this.onLogin}></bj-login>`
      }
    `
  }
}

customElements.define('banana-jack', BananaJack);
