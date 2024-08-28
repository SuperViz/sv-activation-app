'use client';
import { v4 as uuidv4 } from 'uuid';
import React, { useEffect, useState } from 'react';
import { IElement, IElementOnBoard } from '../../../types.game';
import { Element, ElementOnBoard } from '@/components/Game';
import { DragDropContext, Droppable, Draggable, resetServerContext } from 'react-beautiful-dnd';
import './game.scss';

export default function Jogo() {
  const [elements, setElements] = useState<IElement[]>([]);
  const [elementsOnBoard, setElementsOnBoard] = useState<IElementOnBoard[]>([]);

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

  const saveNewElements = (elementsToSave: IElement[]) => {
    // TODO: salvar no localStorage
    // localStorage.setItem("saved_game", JSON.stringify(elementsToSave));
  }

  const combineElements = (elementA: IElementOnBoard, elementB: IElementOnBoard) => {
    const newElements = elementsOnBoard.filter(el => el.id !== elementA?.id && el.id !== elementB?.id);

    // TODO: buscar na API a combinação dos elementos
    const newElement = {
      emoji: '👀',
      name: 'test',
      id: uuidv4(),
      position: {
        x: 0,
        y: 0
      }
    }
    newElements.push(newElement);

    setElementsOnBoard(newElements);
    const newElementsList = [...elements, {
      emoji: '👀',
      name: 'test',
      id: uuidv4()
    }]
    setElements(newElementsList);
    saveNewElements(newElementsList);
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
  }

  function removeElementFromBoard(element: IElement) {
    const newElements = elementsOnBoard.filter(el => el.id !== element.id);
    setElementsOnBoard(newElements);
  }

  function onDragEnd(result: any) {
    if (result.combine) {
      const elementA = elementsOnBoard.find(el => el.id === result.draggableId);
      const elementB = elementsOnBoard.find(el => el.id === result.combine.draggableId);

      if (!elementA || !elementB) return;
      combineElements(elementA, elementB);
    }
  }

  resetServerContext();

  useEffect(() => {
    getSavedElements();
  }, []);

  return (
    <div className='game'>
      <main>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="elements" isCombineEnabled>
            {(provided: any) => (
              <div className="elements" {...provided.droppableProps} ref={provided.innerRef} >
                {elementsOnBoard.map((element, index) =>
                  <Draggable key={element.id} index={index} draggableId={element.id}>
                    {(provided: any) => (
                      <div className='temp' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <ElementOnBoard
                          element={element}
                          onContextMenu={removeElementFromBoard} />
                      </div>
                    )}
                  </Draggable>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
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
