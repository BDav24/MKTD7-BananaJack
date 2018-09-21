import { html, render } from 'lit-html';

import BackendApi from './api';

const style = `
  .rooms {
      padding: 1rem .5rem;
      list-style: none;
      display: grid;
      margin: 0 auto;
      grid-template-columns: repeat(auto-fill, minmax(16em, 1fr));
      grid-auto-rows: minmax(3em, auto);
      grid-gap: .25em .5em;
  }

  .rooms li,
  .rooms .room {
      height: 100%;
      box-sizing: border-box;
  }

  .rooms .room {
      padding: .5rem;
      border: thin solid rgba(0, 0, 0, .25);
      min-width: 16ch;
      display: flex;
      align-items: center;
      background: rgba(0, 0, 0, .25);
  }

  .rooms .room .name {
      font-family: 'Fascinate', sans-serif;
  }

  .rooms .room .status {
      flex-grow: 1;
      text-align: center;
  }
`

class Rooms extends HTMLElement {
  private rooms = []

  constructor() {
    super();
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.rooms = JSON.parse(this.getAttribute('rooms'))
    render(this.template(), this.shadowRoot)
  }

  joinRoom = (roomId) => {
    this.dispatchEvent(new CustomEvent('join', { detail: { roomId } }))
  }

  template() {
    return html`
      <style>${style}</style>
      <ul class="rooms">
        ${this.rooms.map(({ id, name, players }) => html`
          <li>
            <div class="room">
              <div class="name">
                <h2>${name}</h2>
                <div class="players">${players.map(({player: {name}}) => name).join(', ')}</div>
              </div>
              <div class="status">${players.length} / 4</div>
              <div class="action">
                <button type="button" class="join" @click=${() => this.joinRoom(id)}>
                  Join
                </button>
              </div>
            </div>
          </li>
        `)}
      </ul>
    `;
  }
}

customElements.define('bj-rooms', Rooms);
