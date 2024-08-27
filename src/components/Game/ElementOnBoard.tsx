import { IElement, IElementOnBoard } from '../../../types.game';
import { DragEventHandler, useState } from 'react';

export interface IElementOnBoardProps {
	element: IElementOnBoard;
	itemDragged: (element: IElementOnBoard) => void;
	onContextMenu: (element: IElement) => void;
	setCurrentHoverElement: (element: IElementOnBoard | null) => void;
	handleDragElement: (element: IElementOnBoard, event: any) => void;
}

export function ElementOnBoard({ element, itemDragged, onContextMenu, setCurrentHoverElement, handleDragElement }: IElementOnBoardProps) {
	const [loading, setLoading] = useState(false);

	const classList: string[] = ["element", "moveable", "dragging"];
	if (loading) classList.push("loading");

	const handleMouseDown = (event: any) => {
		classList.push("dragging");
		itemDragged(element);
	};

	const handleContextMenu = (event: React.MouseEvent<HTMLElement>) => {
		if (loading) return;

		event.preventDefault();

		if (onContextMenu)
			onContextMenu(element);
	}

	const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
		if (loading) return;
		setCurrentHoverElement(element);
	}

	const handleMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
		if (loading) return;
		setCurrentHoverElement(null);
	}

	const handleDrag = (event: any

	) => {
		if (loading) return;
		handleDragElement(element, event);
	}

	return (
		<div className={classList.join(" ")}
			id={element.id}
			data-element={element.name}
			style={{
				top: element.position.y,
				left: element.position.x
			}}
		// onMouseDown={handleMouseDown}
		// // onDrag={handleDrag}
		// onTouchStart={handleMouseDown}
		// onContextMenu={handleContextMenu}
		// onMouseEnter={handleMouseEnter}
		// onMouseLeave={handleMouseLeave}
		>
			<span>{element.emoji}</span>
			<span>{element.name}</span>
		</div>
	)
}