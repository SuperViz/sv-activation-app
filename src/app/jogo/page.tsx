'use client';
import React, { DragEventHandler, useEffect, useState } from 'react';
import { IElement, IElementOnBoard } from '../../../types.game';
import { Element, ElementOnBoard } from '@/components/Game';
import { DragDropContext } from 'react-beautiful-dnd';
import './game.scss';
import { v4 as uuidv4 } from 'uuid';

export default function Jogo() {
  const [elements, setElements] = useState<IElement[]>([]);
  const [elementsOnBoard, setElementsOnBoard] = useState<IElementOnBoard[]>([]);
  const [draggingElement, setDraggingElement] = useState<IElementOnBoard | null>();
  const [currentHoverElement, setCurrentHoverElement] = useState<IElementOnBoard | null>();

  const getSavedElements = () => {
    let existingSave = localStorage.getItem("saved_game");
    if (existingSave) {
      const savedElements = JSON.parse(existingSave) as IElement[];
      setElements(savedElements);
    } else {
      localStorage.setItem("saved_game", JSON.stringify(
        [
          {
            emoji: "💧",
            name: "Water"
          },
          {
            emoji: "🏆",
            name: "Wind"
          },
          {
            emoji: "🔥",
            name: "Fire"
          },
          {
            emoji: "🌎",
            name: "Earth"
          }
        ]
      ));
    }
  }

  function addElementToBoard(element: IElement) {
    const newElement = {
      ...element,
      id: uuidv4(),
      position: {
        x: 0,
        y: 0
      }
    }
    setElementsOnBoard([...elementsOnBoard, newElement]);

    setDraggingElement(newElement);
  }

  function addDraggableElement(element: IElementOnBoard) {
    setDraggingElement(element);
  }

  function removeElementFromBoard(element: IElement) {
    const newElements = elementsOnBoard.filter(el => el.id !== element.id);
    setElementsOnBoard(newElements);
  }

  function handleDragElement(element: IElementOnBoard, event: DragEventHandler<HTMLDivElement>) {
    console.log('handleDragElement', element);
    // get position of thhe drag
    console.log('position', event);
    console.log(typeof event);

  }

  function handleMouseMove(event: any) {
    console.log('handleMouseMove');
    if (draggingElement) {
      setElementsOnBoard(elementsOnBoard.map(el => {
        if (el.id === draggingElement.id) {
          return {
            ...el,
            position: {
              x: event.clientX - 50,
              y: event.clientY - 50
            }
          }
        }
        return el;
      }));
    }
  }



  useEffect(() => {
    getSavedElements();
  }, []);

  return (
    <div className='game'>
      <main onMouseMove={handleMouseMove}>
        {elementsOnBoard.map((element, index) =>
          <ElementOnBoard
            key={index}
            element={element}
            itemDragged={addDraggableElement}
            onContextMenu={removeElementFromBoard}
            setCurrentHoverElement={setCurrentHoverElement}
            handleDragElement={handleDragElement} />
        )}
      </main>
      <aside>
        {elements.map((element, index) =>
          <Element key={index}
            element={element}
            itemDragged={addElementToBoard} />
        )}
      </aside>
    </div>
  );
};
