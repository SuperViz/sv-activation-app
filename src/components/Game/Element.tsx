import { IElement } from '../../../types.game';
import { useEffect, useState } from 'react';

export interface IElementOnBoardProps {
	element: IElement;
	onContextMenu: (element: IElement) => void;
}

export function Element({ element, onContextMenu }: IElementOnBoardProps) {
	const [loading, setLoading] = useState(false);
	const [classList, setClassList] = useState<string[]>(["element", "dragging"]);

	useEffect(() => {
		let updatedClassList = ["element", "dragging"];
		if (element.isNew) updatedClassList.push("isNew");
		if (loading) updatedClassList.push("loading");
		setClassList(updatedClassList);
	}, [element.isNew, loading]);

	const handleContextMenu = (event: React.MouseEvent<HTMLElement>) => {
		if (loading) return;

		event.preventDefault();

		setClassList(prevClassList => [...prevClassList, "selected"]);

		if (onContextMenu) onContextMenu(element);
	}

	return (
		<div className='element-wrapper'>
			{element.isNew && (<div className="new-element"></div>)}
			<div className={classList.join(" ")}
				id={element.id}
				data-element={element.name}
				onContextMenu={handleContextMenu}
				onDoubleClick={handleContextMenu}
				onClick={handleContextMenu}
			>
				<span>{element.emoji}</span>
				<span>
					{element.name}
					{element.isNew && (<span className='points'>+1</span>)}
				</span>
			</div>
		</div>
	)
}