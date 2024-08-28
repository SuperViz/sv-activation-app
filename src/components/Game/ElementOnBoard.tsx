import { IElement, IElementOnBoard } from '../../../types.game';
import { useState } from 'react';

export interface IElementOnBoardProps {
	element: IElementOnBoard;
	onContextMenu: (element: IElement) => void;
}

export function ElementOnBoard({ element, onContextMenu }: IElementOnBoardProps) {
	const [loading, setLoading] = useState(false);



	const classList: string[] = ["element", "dragging"];
	if (loading) classList.push("loading");

	const handleContextMenu = (event: React.MouseEvent<HTMLElement>) => {
		if (loading) return;

		event.preventDefault();

		if (onContextMenu)
			onContextMenu(element);
	}

	return (

		<div className={classList.join(" ")}
			id={element.id}
			data-element={element.name}
			onContextMenu={handleContextMenu}
			onDoubleClick={handleContextMenu}
		// style={{
		// 	left: element.position.x,
		// 	top: element.position.y
		// }}
		>
			<span>{element.emoji}</span>
			<span>{element.name}</span>
		</div>
	)
}