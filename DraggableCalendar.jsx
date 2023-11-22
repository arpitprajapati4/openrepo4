'use client';
import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { DndContext, useDraggable, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

const localizer = momentLocalizer(moment);

const eventss = [
  {
    title: 'Event 1',
    start: new Date(2023, 10, 15, 10, 0),
    end: new Date(2023, 10, 15, 12, 0),
  },
  {
    title: 'Event 2',
    start: new Date(2023, 10, 17, 14, 0),
    end: new Date(2023, 10, 17, 16, 0),
  },
  {
    title: 'Event 3',
    start: new Date(2023, 10, 12, 10, 0),
    end: new Date(2023, 10, 12, 12, 0),
  },
  
  // Add more events as needed
];

const DraggableCalendar = () => {
  const [eventsState, setEventsState] = useState(eventss);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: 'draggable-calendar-event',
  });

  const handleDragEnd = ({ active }) => {

    // Check if active is defined before proceeding
    if (!active) {
      return;
    }
    const over = active.over;

    if (over && over.data.current) {
      const updatedEvents = eventsState.map((event) => {
        if (event.title === active.data.current.title) {
          const { start, end } = over.data.current;
          return { ...event, start, end };
        }
        return event;
      });

      setEventsState(updatedEvents);
      console.log('Event dropped:', active.data.current.title);
    }
  };

  const handleDragStart = (event) => {
    // Handle drag start event
    console.log('Drag Start:', event);

  };

  const handleDragMove = (event) => {
    // Handle drag move event
    console.log('Drag Move:', event);
  };

  const handleDragOver = (event) => {
    // Handle drag over event
    console.log('Drag Over:', event);
  };

  const handleDragCancel = (event) => {
    // Handle drag cancel event
    console.log('Drag Cancel:', event);
  };

  return (
    <DndContext 
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div ref={setNodeRef}>
        <Calendar
          localizer={localizer}
          events={eventsState}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '500px' }}
          views={['month', 'day', 'agenda']}
          components={{
            event: (eventProps) => (
              <EventComponent
                {...eventProps}
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
              />
            ),
          }}
        />
      </div>
    </DndContext>
  );
};

const EventComponent = ({ event, onDragStart, onDragMove, onDragOver, onDragEnd, onDragCancel }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: event.title,
    data: { title: event.title },
    onDragStart,
    onDragMove,
    onDragOver,
    onDragEnd,
    onDragCancel,
  });

  const style = {
    backgroundColor: 'gray',
    cursor: 'move',
    padding: '5px',
    borderRadius: '4px',
    zIndex: isDragging ? 1 : 0,
    transform: `translate(${transform?.x || 0}px, ${transform?.y || 0}px)`,
  };


  return (
    <div
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      style={style}
    >
      {event.title}
    </div>
  );
};


export default DraggableCalendar;
