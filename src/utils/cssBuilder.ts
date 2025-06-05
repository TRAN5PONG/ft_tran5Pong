type StyleFunction = (props: Record<string, any>) => string;
type CSSRule = string | StyleFunction;

export class CSSBuilder {
	private cssTemplate: CSSRule;
	private generatedCSS: string = "";
	private className: string;


	constructor(className: string, cssTemplate: CSSRule) {
		this.className = className;
		this.cssTemplate = cssTemplate;
	}

	generate () : string {
		this.generatedCSS = typeof this.cssTemplate === "function"
			? this.cssTemplate({})
			: this.cssTemplate;
		return `.${this.className} { ${this.generatedCSS} }`;
	}
}


export function css(strings: TemplateStringsArray, ...values: any[]): StyleFunction {
  return (props: Record<string, any>) => {
    return strings.reduce((result, string, i) => {
      const value = values[i];
      const interpolated = typeof value === 'function' ? value(props) : value || '';
      return result + string + interpolated;
    }, '');
  };
}
