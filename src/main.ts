import './style.css';
import { GameCanvas } from './components/Game.ts';

customElements.define('game-canvas', GameCanvas);  // Register once

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="container">
    <game-canvas></game-canvas>
  </div>
`;

const gameCanvas = document.querySelector('game-canvas') as GameCanvas;
gameCanvas.render();  // Starts the render loop
