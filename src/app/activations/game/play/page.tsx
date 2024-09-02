'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Element } from '@/components/Game';
import { DragDropContext, Droppable, Draggable, resetServerContext } from 'react-beautiful-dnd';
import './game.scss';
import { InitialElements } from '@/data/elementsData';
import { IElement } from '../../../../../types.game';
import { useRealtime } from '@superviz/react-sdk';

export default function Jogo() {
  const [elements, setElements] = useState<IElement[]>([]);
  const USERDATA_KEY = process.env.NEXT_PUBLIC_USERDATA_KEY as string;

  // const { subscribe } = useRealtime('game');

  const getSavedElements = () => {
    let existingSave = localStorage.getItem("saved_game");
    if (existingSave) {
      const savedElements = JSON.parse(existingSave) as IElement[];
      setElements(savedElements);
    } else {
      localStorage.setItem("saved_game", JSON.stringify(InitialElements));
    }
  }

  const saveNewElements = (elementsToSave: IElement[]) => {
    localStorage.setItem("saved_game", JSON.stringify(elementsToSave));
  }

  const combineElements = (elementA: IElement, elementB: IElement) => {
    const indexB = elements.findIndex(el => el.id === elementB.id);

    fetch('/api/game', {
      method: 'POST',
      body: JSON.stringify({
        elementA: elementA.name,
        elementB: elementB.name,
        email: JSON.parse(localStorage.getItem(USERDATA_KEY) as string),
      })
    }).then(res => res.json()).then(data => {
      const newElements = [...elements];
      newElements.splice(indexB + 1, 0, {
        emoji: data.element.emoji,
        name: data.element.name,
        id: data.element.id,
        isNew: data.isNew,
      });

      setElements(newElements);
      saveNewElements(newElements);
    }).catch(err => {
      console.error(err);
    });
  }

  function removeElementFromBoard(element: IElement) {
    const newElements = elements.filter(el => el.id !== element.id);
    setElements(newElements);
  }

  function onDragEnd(result: any) {
    if (result.combine) {
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

  const handleGameUpdate = useCallback((message: any) => {

  }, []);

  resetServerContext();

  useEffect(() => {
    // subscribe("new.element", handleGameUpdate);

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
