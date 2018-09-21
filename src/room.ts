import { html, render } from 'lit-html';

import { RoomEvent } from './model';
import BackendApi from './api';

const style = `
  .room-current header {
      display: flex;
      justify-content: space-between;
      font-size: 1.2em;
      border-bottom: .125em solid rgba(0, 0, 0, .25);
      text-shadow: 1px 1px 2px black;
      background: rgba(0, 0, 0, .25);
      box-shadow: 0 0 0 .25em rgba(0, 0, 0, .25);
      align-items: center;
  }

  .room-current header .name {
      font-family: 'Fascinate', cursive;
      font-size: 1.5em;
  }

  /*room winner*/
  .room-current .winner {
      color: var(--yellow, yellow);
  }

  .room-current .winner::before,
  .room-current .winner::after {
      content: '🎊';
      margin: 0 .5em;
  }

  .room-current .winner::before {
      content: 'Winner: ';
  }

  /*room players*/
  .room-current .players {
      display: grid;
      margin: .5em 0;
      grid-template-columns: repeat(auto-fill, minmax(24em, 1fr));
      grid-gap: 1em;
  }

  .room-current .player {
      padding: .25rem;
      border: thin solid currentColor;
      display: inline-block;
  }

  .room-current .player.bank {
      background: hsla(0, 100%, 100%, .25);
      border-color: hsla(0, 100%, 100%, .25);
  }

  .room-current .player.me {
      background: rgba(0, 0, 0, .25);
      border-color: rgba(0, 0, 0, .25);
  }

  .room-current .player.me {
      grid-column: 1;
  }

  .room-current .player .move {
      text-align: right;
  }

  .room-current .player.timeout {
      opacity: .25;
  }

  .room-current .player.timeout .move::before {
      content: '💤';
  }

  .room-current .player.draw .move::before {
      content: '▶️';
  }

  .room-current .player.stay .move::before {
      content: '⏹';
  }

  .room-current .player.burst .move::before {
      content: '💣';
  }

  .room-current .player.burst {
      color: var(--red, red);
  }

  .room-current .player.wait .move::before {
      content: '😴';
  }

  .room-current .player.in-game .move::before {
      content: '⏰';
  }

  .room-current .player {
      border: thin solid transparent;
      overflow: hidden;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      grid-template-rows: 2em 1fr 2.5em;
      grid-auto-flow: dense;
  }

  .room-current .player .cards {
      grid-column: 1 / 4;
      display: flex;
      align-items: center;
  }

  .room-current .player .cards .card {
      flex: 1 2 3em;
      max-width: 3em;
  }

  .room-current .player .cards:first-child {
      box-shadow: 0 0 0 1px red;
  }

  .room-current .player .cards:nth-child(1+n) {
      margin-left: -6em;
  }

  .room-current .player .cards .card img {
      max-height: 12em;
  }

  .room-current .player .actions {
      grid-column: 1 / 4;
      display: flex;
      justify-content: space-around;
      border-top: .125em solid rgba(0, 0, 0, .25);
  }
`

class Room extends HTMLElement {
  private room = null
  private user = null

  constructor() {
    super();
    this.attachShadow({ mode: 'open' })
    BackendApi.setListener((event: RoomEvent) => {
      console.log(event)
    })
  }

  connectedCallback() {
    this.room = JSON.parse(this.getAttribute('room'))
    this.user = JSON.parse(this.getAttribute('user'))
    render(this.template(), this.shadowRoot)
    BackendApi.join(this.room.id, this.user.id)
  }

  template() {
    const {name} = this.room
    return html`
      <style>${style}</style>
      <div class="room-current">
          <header>
              <div class="name">${name}</div>
              <button type="button">Leave</button>
          </header>

          <div class="players">
              <!--bank-->
              <div class="player bank">
                  <div class="name">Bank</div>
                  <div class="score">16</div>
                  <div class="move"></div>
                  <div class="cards">
                      <div class="card">
                          <img src="http://ilaborie.org:9898/assets/0D.png" alt="0D">
                      </div>
                      <div class="card">
                          <img src="http://ilaborie.org:9898/assets/6C.png" alt="6C">
                      </div>
                  </div>
                  <div class="actions"></div>
              </div>

              <!-- me -->
              <div class="player me in-game">
                  <div class="name">toto</div>
                  <div class="score">10</div>
                  <div class="move"></div>
                  <div class="cards">
                      <div class="card">
                          <img src="http://ilaborie.org:9898/assets/4S.png" alt="4S">
                      </div>
                      <div class="card">
                          <img src="http://ilaborie.org:9898/assets/2C.png" alt="2C">
                      </div>
                      <div class="card">
                          <img src="http://ilaborie.org:9898/assets/4C.png" alt="4C">
                      </div>
                  </div>
                  <div class="actions">
                      <button type="button">Draw</button>
                      <button type="button">Stay</button>
                  </div>
              </div>

              <!--other players-->
              <div class="player in-game">
                  <div class="name">tata</div>
                  <div class="score">13</div>
                  <div class="move"></div>
                  <div class="cards">
                      <div class="card">
                          <img src="http://ilaborie.org:9898/assets/4H.png" alt="4H">
                      </div>
                      <div class="card">
                          <img src="http://ilaborie.org:9898/assets/AH.png" alt="AH">
                      </div>
                      <div class="card">
                          <img src="http://ilaborie.org:9898/assets/8C.png" alt="8C">
                      </div>
                  </div>
                  <div class="actions">
                      <span>draw</span><span>stay</span>
                  </div>
              </div>
          </div>
      </div>
    `;
  }
}

customElements.define('bj-room', Room);
