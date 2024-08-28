'use client';
import { v4 as uuidv4 } from 'uuid';
import React, { useEffect, useState } from 'react';
import { IElement } from '../../../types.game';
import { Element } from '@/components/Game';
import { DragDropContext, Droppable, Draggable, resetServerContext } from 'react-beautiful-dnd';
import './game.scss';

export default function Jogo() {
  const [elements, setElements] = useState<IElement[]>([]);

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
            name: "Water",
            id: uuidv4(),
          },
          {
            emoji: "🏆",
            name: "Wind",
            id: uuidv4(),
          },
          {
            emoji: "🔥",
            name: "Fire",
            id: uuidv4(),
          },
          {
            emoji: "🌎",
            name: "Earth",
            id: uuidv4(),
          }
        ]
      ));
    }
  }

  const saveNewElements = (elementsToSave: IElement[]) => {
    // TODO: salvar no localStorage
    // localStorage.setItem("saved_game", JSON.stringify(elementsToSave));
  }

  const combineElements = (elementA: IElement, elementB: IElement) => {
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

    const indexB = elements.findIndex(el => el.id === elementB.id);

    const newElements = [...elements];
    newElements.splice(indexB + 1, 0, newElement);

    setElements(newElements);
    saveNewElements(newElements);
  }

  function removeElementFromBoard(element: IElement) {
    const newElements = elements.filter(el => el.id !== element.id);
    setElements(newElements);
  }

  function onDragEnd(result: any) {
    if (result.combine) {
      console.log(elements)
      console.log(result);
      const elementA = elements.find(el => el.id === result.draggableId);
      const elementB = elements.find(el => el.id === result.combine.draggableId);

      if (!elementA || !elementB) return;
      combineElements(elementA, elementB);
    }
  }

  const renderElement = (element: IElement, index: number, provided: any) => {
    return (
      <Draggable key={element.id} index={index} draggableId={element.id}>
        {(provided: any) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Element
              element={element}
              onContextMenu={removeElementFromBoard} />
          </div>
        )}
      </Draggable>
    )
  }

  resetServerContext();

  useEffect(() => {
    getSavedElements();
  }, []);

  return (
    <div className='game'>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="elements" isCombineEnabled>
          {(provided: any) => (
            <div className="elements" {...provided.droppableProps} ref={provided.innerRef} >
              {elements.map((element, index) => renderElement(element, index, provided))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
