'use client';
import React, { useEffect, useState } from 'react';
import { Element } from '@/components/Game';
import { DragDropContext, Droppable, Draggable, resetServerContext } from 'react-beautiful-dnd';
import './GameActivationPlayLayout.scss';
import { IElement } from '../../../types.game';
import { ActivationTypePage } from '@/global/global.types';
import ActivationLayout from './ActivationLayout';
import { useRealtime } from '@superviz/react-sdk';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function GameActivationPlayLayout({ setPage }: { setPage: (page: ActivationTypePage) => void }) {
  const USERDATA_KEY = process.env.NEXT_PUBLIC_USERDATA_KEY as string;

  const gameOverAt = 9;

  const [elements, setElements] = useState<IElement[]>([]);
  const [gameOver, setGameOver] = useState(false);

  const { subscribe } = useRealtime('game');


  const getSavedElements = () => {
    let existingSave = localStorage.getItem("saved_game");
    if (existingSave) {
      const savedElements = JSON.parse(existingSave) as IElement[];
      setElements(savedElements);
    }

    if (elements.filter(el => el.isNew).length === gameOverAt) {
      setGameOver(true);
    }
  }

  const saveNewElements = (elementsToSave: IElement[]) => {
    localStorage.setItem("saved_game", JSON.stringify(elementsToSave));
  }

  const addNewElement = (index: number, element: IElement, isNew: boolean) => {
    if (elements.find(el => el.name === element.name)) return;

    const newElements = [...elements];
    newElements.splice(index + 1, 0, {
      emoji: element.emoji,
      name: element.name,
      id: element.id,
      isNew: isNew,
    });

    setElements(newElements);
    saveNewElements(newElements);

    if (elements.filter(el => el.isNew).length === gameOverAt) {
      setGameOver(true);
    }
  }

  const combineElements = (elementA: IElement, elementB: IElement) => {
    console.log('combineElements', elementA, elementB);
    const indexB = elements.findIndex(el => el.id === elementB.id);

    fetch('/api/game', {
      method: 'POST',
      body: JSON.stringify({
        elementA: elementA.name,
        elementB: elementB.name,
        email: JSON.parse(localStorage.getItem(USERDATA_KEY) as string),
      })
    }).then(res => res.json()).then(data => {
      addNewElement(indexB, data.element, data.isNew);
    }).catch(err => {
      console.error(err);
    });
  }

  function onDragEnd(result: any) {
    console.log('onDragEnd', result);
    if (result.combine) {
      const elementA = elements.find(el => el.id === result.draggableId);
      const elementB = elements.find(el => el.id === result.combine.draggableId);

      if (!elementA || !elementB) return;
      combineElements(elementA, elementB);
    }
  }

  const renderElement = (element: IElement, index: number, provided: any) => {
    return (
      <Draggable isDragDisabled={gameOver} key={element.id} index={index} draggableId={element.id}>
        {(provided: any) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Element
              element={element}
              onContextMenu={() => console.log('juntar elemento com ele mesmo?')} />
          </div>
        )}
      </Draggable>
    )
  }

  const handleGameUpdate = (message: any) => {
    const userFromMessage = message.data.user;
    const element = message.data.element;

    if (userFromMessage.email === JSON.parse(localStorage.getItem(USERDATA_KEY) as string)) return;

    toast(`${element.emoji} ${userFromMessage?.name} acabou de descobrir ${element.name.toUpperCase()} e tem mais chance de ganhar!`, {
      position: 'bottom-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      closeButton: false,
      progress: undefined,
      theme: "dark",
    });
  };

  resetServerContext();

  useEffect(() => {
    subscribe("new.element", handleGameUpdate);

    getSavedElements();
  }, []);

  function mapAndInvoke(onDragEnd: (result: any) => void) {
    return function (result: any): void {
      onDragEnd(result);
    };
  }

  return (
    <ActivationLayout setPage={setPage}>
      <div className='game'>
        <DragDropContext onDragEnd={mapAndInvoke(onDragEnd)}>
          <Droppable droppableId="elements" isCombineEnabled direction={'horizontal'}>
            {(provided: any) => (
              <div
                className="elements"
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }} >
                {elements.map((element, index) => renderElement(element, index, provided))}
                {/* {provided.placeholder} */}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <ToastContainer />
    </ActivationLayout>
  );
};
