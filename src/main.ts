import MiniReact from "./lib/miniReact/index.ts";
import "./style.css";
import { GameCanvas } from "./components/game/Game.ts";
import { Chat } from "./components/chat/chat.ts";

// Define custom elements with the CLASS, not an instance
customElements.define("game-canvas", GameCanvas); 
customElements.define("chat-box", Chat);  // Pass the class, not new Chat()

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <game-canvas></game-canvas>
    <chat-box text="THis is test text!"></chat-box>
`;

const gameCanvas = document.querySelector("game-canvas") as GameCanvas;
gameCanvas.render();