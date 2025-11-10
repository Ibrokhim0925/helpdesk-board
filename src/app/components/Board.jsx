'use client';

import { useState, useEffect, useMemo } from 'react';
import TicketList from './TicketList';
import StatusFilter from './StatusFilter';
import PriorityFilter from './PriorityFilter';
import SearchBox from './SearchBox';
import MyQueueSummary from './MyQueueSummary';
import StatusMessage from './StatusMessage';
import {
  statusTransitions,
  priorityTransitions,
} from '../lib/severity';

// Helper functions
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function Board() {
  // --- All your state (tickets, loading, etc.) ---
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ status: 'All', priority: 'All' });
  const [search, setSearch] = useState('');
  const [queue, setQueue] = useState({});

  // --- Effect 1: Fetch tickets ---
  useEffect(() => {
    async function fetchTickets() {
      try {
        setLoading(true);
        const res = await fetch('/api/tickets');
        if (!res.ok) {
          throw new Error('Failed to fetch ticket data.');
        }
        const data = await res.json();
        setTickets(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  // --- Effect 2: Simulate live updates ---
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTickets((currentTickets) => {
        if (currentTickets.length === 0) return currentTickets;
        const ticketIndex = Math.floor(Math.random() * currentTickets.length);
        const ticketToUpdate = currentTickets[ticketIndex];
        const newTickets = [...currentTickets];
        let updatedTicket = { ...ticketToUpdate };

        if (Math.random() > 0.5) {
          const possibleNewStatuses =
            statusTransitions[updatedTicket.status] || [];
          if (possibleNewStatuses.length > 0) {
            updatedTicket.status = getRandomItem(possibleNewStatuses);
          }
        } else {
          const possibleNewPriorities =
            priorityTransitions[updatedTicket.priority] || [];
          if (possibleNewPriorities.length > 0) {
            updatedTicket.priority = getRandomItem(possibleNewPriorities);
          }
        }
        updatedTicket.updatedAt = new Date().toISOString();
        newTickets[ticketIndex] = updatedTicket;
        return newTickets;
      });
    }, getRandomInt(6000, 10000));
    return () => clearInterval(intervalId);
  }, []);

  // --- All your handlers (filter, search, queue) ---
  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
  };
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const handleAddToQueue = (ticketId) => {
    setQueue((prev) => ({ ...prev, [ticketId]: true }));
  };
  const handleRemoveFromQueue = (ticketId) => {
    setQueue((prev) => {
      const newQueue = { ...prev };
      delete newQueue[ticketId];
      return newQueue;
    });
  };
  const handleClearQueue = () => {
    setQueue({});
  };

  // --- All your derived state (visibleTickets, queuedTickets) ---
  const visibleTickets = useMemo(() => {
    const searchLower = search.toLowerCase();
    return tickets.filter((ticket) => {
      if (filters.status !== 'All' && ticket.status !== filters.status) {
        return false;
      }
      if (
        filters.priority !== 'All' &&
        ticket.priority !== filters.priority
      ) {
        return false;
      }
      if (
        searchLower &&
        !ticket.title.toLowerCase().includes(searchLower) &&
        !ticket.description.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
      return true;
    });
  }, [tickets, filters, search]);

  const queuedTickets = useMemo(() => {
    return tickets.filter((ticket) => queue[ticket.id]);
  }, [tickets, queue]);

  // --- NEW RENDER LAYOUT ---
  return (
    <div className="flex flex-col space-y-6">
      
      {/* --- Filter & Search Bar --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-zinc-800 rounded-lg shadow-lg">
        <StatusFilter
          value={filters.status}
          onChange={(value) => handleFilterChange('status', value)}
        />
        <PriorityFilter
          value={filters.priority}
          onChange={(value) => handleFilterChange('priority', value)}
        />
        <div className="md:col-span-1">
          <SearchBox value={search} onChange={handleSearchChange} />
        </div>
      </div>

      {/* --- Main Content: Tickets --- */}
      <main>
        <StatusMessage
          loading={loading}
          error={error}
          isEmpty={!loading && !error && visibleTickets.length === 0}
        />
        <TicketList
          tickets={visibleTickets}
          queue={queue}
          onAddToQueue={handleAddToQueue}
        />
      </main>

      {/* --- Bottom: My Queue --- */}
      <aside>
        <MyQueueSummary
          queuedTickets={queuedTickets}
          onRemove={handleRemoveFromQueue}
          onClear={handleClearQueue}
        />
      </aside>
    </div>
  );
}