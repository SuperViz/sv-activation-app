import { IElement } from '../../../types.game';

export interface IElementProps {
	element: IElement;
	itemDragged: (element: IElement) => void;
}

export function Element({ element, itemDragged }: IElementProps) {
	const handleMouseDown = (event: React.MouseEvent<HTMLElement>) => {
		itemDragged(element);
	};

	return (
		<div className="element" data-element={element.name} onMouseDown={handleMouseDown}>
			<span>{element.emoji}</span>
			<span>{element.name}</span>
		</div>
	)
}