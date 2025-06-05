import { Component } from "../BaseComponent";

export class Chat extends Component {
  constructor(props: Record<string, any>) 
  {
    super(props);
  }


  render() : HTMLElement {
    const el = document.createElement("div");
    el.textContent = this.props.text || "Chat Box2";
    el.className = "chat-container";
    return el;
  }
}