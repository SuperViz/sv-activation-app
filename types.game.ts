export interface IElement {
	emoji: string
	name: string
	id: string
}

export interface IElementOnBoard {
	name: string;
	emoji: string;
	id: string;
	isNew?: boolean;
	position: {
		x: number;
		y: number;
	}
	style?: React.CSSProperties;
}