import { ChatMessage } from "../../types/chat";

export class Chat extends HTMLElement {
	private styles = document.createElement('style');

	private ChatIcon : HTMLElement | null = null;
	private ChatPanel: HTMLElement | null = null;

	constructor () {
		super();
		/*html*/ 
		this.innerHTML = `
			<div class="Chat">
				<img src="/icons/chat.svg"/>
			</div>
			<div class="ChatPanel">HH</div>
		`

		this.ChatPanel = this.querySelector('.ChatPanel');
		this.ChatIcon = this.querySelector('.Chat');

		this.ChatIcon?.addEventListener('click', () => {
			console.log('Chat Icon Clicked');
			this.ChatPanel?.classList.toggle('active');
		})
		this.setStyles();
	}

	setStyles() {
		/*css*/
		this.styles.textContent = `
			.Chat {
				background-color: red;
				width : 40px;
				height: 40px;
				display: flex;
				justify-content: center;
				align-items: center;
				position : absolute;
				top : 5px;
				right : 50px;
				border-radius: 5px;
				cursor: pointer;

				img {
					height : 70%;
				}
		  	}
			.ChatPanel {
				background-color : white;
				height : 90vh;
				width : 30%;
				position : fixed;
				right : 5px;
				top : 70px;
				border-radius : 4px;
				color : black;
				display : none;
				&.active {
					display : block;
				}
			}
		`

		this.appendChild(this.styles);
	}

	private CreateMessage ()
	{
		
	}
}
