// src/Pages/Calendar/CalendarPage.tsx

import React, { useEffect, useState } from 'react';
import { useDataProvider, Title } from 'react-admin';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { Project } from '../../interfaces/Project';
import { useNavigate } from 'react-router-dom';

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: string;
}

export const CalendarPage = () => {
  const dataProvider = useDataProvider();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await dataProvider.getList<Project>('projects', {
          pagination: { page: 1, perPage: 1000 },
          sort: { field: 'fechaInicio', order: 'ASC' },
          filter: {},
        });

        // Filter out projects with estado 'finalizado'
        const activeProjects = data.filter((project) => project.estado !== 'finalizado');

        // Define event colors based on theme mode
        const eventColors =
          theme.palette.mode === 'dark'
            ? [
                theme.palette.secondary.light,
                theme.palette.info.light,
                theme.palette.success.light,
                theme.palette.warning.light,
                theme.palette.error.light,
              ]
            : [
                theme.palette.secondary.main,
                theme.palette.info.main,
                theme.palette.success.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ];

        // Map active projects to events
        const mappedEvents = activeProjects.map((project) => ({
          id: project.id,
          title: project.nombre,
          start: new Date(project.fechaInicio),
          end: new Date(project.fechaFinEstimada),
          allDay: true,
        }));

        // Assign colors to events to avoid adjacent events having the same color
        const eventsWithColors = assignColorsToEvents(mappedEvents, eventColors);

        setEvents(eventsWithColors);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [dataProvider, theme.palette.mode]);

  // Function to assign colors to events
  const assignColorsToEvents = (events: CalendarEvent[], eventColors: string[]) => {
    const assignedEvents: CalendarEvent[] = [];
    for (const event of events) {
      // Find overlapping events
      const overlappingEvents = assignedEvents.filter(
        (e) => event.start <= e.end && event.end >= e.start
      );
      // Get colors already used by overlapping events
      const usedColors = overlappingEvents.map((e) => e.color);
      // Assign the first available color
      const availableColors = eventColors.filter((color) => !usedColors.includes(color));
      const color = availableColors[0] || eventColors[0];
      assignedEvents.push({ ...event, color });
    }
    return assignedEvents;
  };

  // Custom event style
  const eventStyleGetter = (
    event: CalendarEvent,
    start: Date,
    end: Date,
    isSelected: boolean
  ) => {
    const backgroundColor = event.color || theme.palette.primary.main;
    const textColor = theme.palette.getContrastText(backgroundColor);
    const style = {
      backgroundColor,
      borderRadius: '5px',
      opacity: 0.9,
      color: textColor,
      border: '0px',
      display: 'block',
      cursor: 'pointer',
      padding: '2px 5px',
    };
    return {
      style,
    };
  };

  // Event click handler
  const onSelectEvent = (event: CalendarEvent) => {
    navigate(`/projects/${event.id}/show`);
  };

  return (
    <Box m="20px">
      <Title title="Calendario de Proyectos" />
      <Box
        sx={{
          height: 'calc(100vh - 120px)',
          '& .rbc-toolbar': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.getContrastText(theme.palette.primary.main),
          },
          '& .rbc-toolbar button': {
            backgroundColor: 'transparent',
            color: theme.palette.getContrastText(theme.palette.primary.main),
            border: 'none',
            boxShadow: 'none',
          },
          '& .rbc-toolbar button:hover': {
            backgroundColor: theme.palette.action.hover,
            color: theme.palette.text.primary,
          },
          '& .rbc-toolbar button:focus': {
            outline: 'none',
          },
          '& .rbc-header': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.getContrastText(theme.palette.primary.main),
          },
          // Style for days from other months
          '& .rbc-month-view .rbc-date-cell .rbc-off-range': {
            color: theme.palette.text.disabled,
          },
          '& .rbc-month-view .rbc-off-range-bg': {
            backgroundColor: theme.palette.action.selected,
          },
          // Style for "+N more" label
          '& .rbc-month-view .rbc-show-more': {
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.main,
            borderRadius: '5px',
            padding: '2px 4px',
            cursor: 'pointer',
          },
          // Style for current date marker
          '& .rbc-today': {
            backgroundColor: theme.palette.error.light,
          },
        }}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={onSelectEvent}
        />
      </Box>
    </Box>
  );
};