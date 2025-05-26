import './style.css';
import { GameCanvas } from './components/Game.ts';
import {Chat} from './components/chat/chat.ts';

customElements.define('game-canvas', GameCanvas);  // Register once
customElements.define('chat-box', Chat);


document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="container">
    <game-canvas/>
    <chat-box/>
  </div>
`;

const gameCanvas = document.querySelector('game-canvas') as GameCanvas;
gameCanvas.render();  // Starts the render loop
