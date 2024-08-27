export interface IElement {
	emoji: string
	name: string
	id?: string
}

export interface IElementOnBoard {
	name: string;
	emoji: string;
	id: string;
	position: {
		x: number;
		y: number;
	}
}