import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Link } from 'react-router-dom';
import { prospectService } from '../services/api';
import '../styles/KanbanBoard.css';

const KanbanBoard = () => {
  const [columns, setColumns] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProspects();
  }, []);

  const fetchProspects = async () => {
    try {
      setLoading(true);
      const prospects = await prospectService.getProspects();
      
      // Group prospects by status
      const boardColumns = {
        'new-lead': {
          id: 'new-lead',
          title: 'New Lead',
          prospects: []
        },
        'contacted': {
          id: 'contacted',
          title: 'Contacted',
          prospects: []
        },
        'qualified': {
          id: 'qualified',
          title: 'Qualified',
          prospects: []
        },
        'proposal': {
          id: 'proposal',
          title: 'Proposal',
          prospects: []
        },
        'negotiation': {
          id: 'negotiation',
          title: 'Negotiation',
          prospects: []
        },
        'contract-sent': {
          id: 'contract-sent',
          title: 'Contract Sent',
          prospects: []
        },
        'won-sold': {
          id: 'won-sold',
          title: 'Won/Sold',
          prospects: []
        },
        'lost': {
          id: 'lost',
          title: 'Lost',
          prospects: []
        },
        'inactive': {
          id: 'inactive',
          title: 'Inactive',
          prospects: []
        }
      };

      // Group prospects by status
      prospects.forEach(prospect => {
        const statusKey = prospect.status.toLowerCase().replace(/\s+/g, '-').replace('/', '-');
        if (boardColumns[statusKey]) {
          boardColumns[statusKey].prospects.push(prospect);
        } else {
          // Fallback for any unexpected status
          boardColumns['new-lead'].prospects.push(prospect);
        }
      });
      
      setColumns(boardColumns);
      setError(null);
    } catch (err) {
      setError('Failed to fetch prospects. Please try again later.');
      console.error('Error fetching prospects:', err);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Find the source and destination columns
    const sourceColumn = columns[source.droppableId];
    const destinationColumn = columns[destination.droppableId];

    // Moving within the same column
    if (sourceColumn === destinationColumn) {
      const newProspects = Array.from(sourceColumn.prospects);
      const [movedProspect] = newProspects.splice(source.index, 1);
      newProspects.splice(destination.index, 0, movedProspect);

      const newColumn = {
        ...sourceColumn,
        prospects: newProspects,
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });
      
      return;
    }

    // Moving from one column to another
    const sourceProspects = Array.from(sourceColumn.prospects);
    const [movedProspect] = sourceProspects.splice(source.index, 1);
    const newSourceColumn = {
      ...sourceColumn,
      prospects: sourceProspects,
    };

    const destinationProspects = Array.from(destinationColumn.prospects);
    destinationProspects.splice(destination.index, 0, movedProspect);
    const newDestinationColumn = {
      ...destinationColumn,
      prospects: destinationProspects,
    };

    // Update UI immediately for responsiveness
    setColumns({
      ...columns,
      [newSourceColumn.id]: newSourceColumn,
      [newDestinationColumn.id]: newDestinationColumn,
    });
    
    // Update the prospect's status in the backend
    try {
      const newStatus = destinationColumn.title;
      await prospectService.updateStatus(movedProspect._id, newStatus);
      console.log(`Updated prospect ${movedProspect._id} status to ${newStatus}`);
    } catch (err) {
      // If the API call fails, revert the UI change
      console.error('Error updating prospect status:', err);
      setError('Failed to update prospect status. Please try again.');
      
      // Revert the UI change
      setColumns({
        ...columns,
        [sourceColumn.id]: sourceColumn,
        [destinationColumn.id]: destinationColumn,
      });
    }
  };

  if (loading) {
    return <div className="loading">Loading pipeline data...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message card">{error}</div>
        <button 
          className="btn btn-primary" 
          onClick={fetchProspects}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="kanban-board">
      <h1>Pipeline</h1>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-columns">
          {Object.values(columns).map(column => (
            <div key={column.id} className="kanban-column">
              <div className="column-header">
                <h2>{column.title}</h2>
                <div className="prospect-count">{column.prospects.length}</div>
              </div>
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    className={`prospect-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {column.prospects.map((prospect, index) => (
                      <Draggable
                        key={prospect._id}
                        draggableId={prospect._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            className={`prospect-card ${snapshot.isDragging ? 'dragging' : ''}`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="prospect-name">{prospect.fullName}</div>
                            <div className="prospect-details">
                              <div className="prospect-email">{prospect.email}</div>
                              <div className="prospect-phone">{prospect.phoneNumber}</div>
                            </div>
                            <div className="prospect-actions">
                              <Link to={`/prospects/${prospect._id}`} className="view-link">
                                View Details
                              </Link>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard; 