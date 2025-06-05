export abstract class Component extends HTMLElement {
	protected props: Record<string, any>;

	constructor(props: Record<string, any> = {}) {
		super();
		this.props = props;
		this.appendChild(this.render());
	}

	abstract render(): HTMLElement;

	update(props: Record<string, any>): void {
		this.props = props;
		// Clear current content and re-render
		this.innerHTML = '';
		this.appendChild(this.render());
	}

	destroy(): void {
		if (this.parentNode) {
			this.parentNode.removeChild(this);
		}
	}

	getElement(): HTMLElement {
		return this;
	}
}