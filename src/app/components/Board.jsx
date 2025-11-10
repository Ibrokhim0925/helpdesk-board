'use client';

import { useState, useEffect, useMemo } from 'react';
import TicketList from './TicketList';
import StatusFilter from './StatusFilter';
import PriorityFilter from './PriorityFilter';
import SearchBox from './SearchBox';
import MyQueueSummary from './MyQueueSummary';
import StatusMessage from './StatusMessage';
// --- NEW IMPORT ---
import {
  statusTransitions,
  priorityTransitions,
} from '../lib/severity';

// --- NEW HELPER FUNCTIONS ---
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// ----------------------------

export default function Board() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ status: 'All', priority: 'All' });
  const [search, setSearch] = useState('');
  const [queue, setQueue] = useState({});

  // Effect 1: Fetch tickets on mount
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

  // --- NEW EFFECT #2: Simulate live updates ---
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTickets((currentTickets) => {
        if (currentTickets.length === 0) return currentTickets;

        // Pick a random ticket to update
        const ticketIndex = Math.floor(Math.random() * currentTickets.length);
        const ticketToUpdate = currentTickets[ticketIndex];

        // Create an immutable copy
        const newTickets = [...currentTickets];
        let updatedTicket = { ...ticketToUpdate };

        // Randomly decide to update status or priority
        if (Math.random() > 0.5) {
          // Update Status
          const possibleNewStatuses =
            statusTransitions[updatedTicket.status] || [];
          if (possibleNewStatuses.length > 0) {
            updatedTicket.status = getRandomItem(possibleNewStatuses);
          }
        } else {
          // Update Priority
          const possibleNewPriorities =
            priorityTransitions[updatedTicket.priority] || [];
          if (possibleNewPriorities.length > 0) {
            updatedTicket.priority = getRandomItem(possibleNewPriorities);
          }
        }

        // Always update the timestamp
        updatedTicket.updatedAt = new Date().toISOString();

        // Replace the old ticket with the updated one
        newTickets[ticketIndex] = updatedTicket;

        return newTickets;
      });
    }, getRandomInt(6000, 10000)); // Every 6-10 seconds

    // CRITICAL: Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this runs once on mount
  // ------------------------------------------------

  // --- State Handlers (no changes) ---
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

  // --- Derived State (no changes) ---
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

  // --- Render (no changes) ---
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <aside className="lg:col-span-1 space-y-6">
        <div className="bg-zinc-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="space-y-4">
            <StatusFilter
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
            />
            <PriorityFilter
              value={filters.priority}
              onChange={(value) => handleFilterChange('priority', value)}
            />
            <SearchBox value={search} onChange={handleSearchChange} />
          </div>
        </div>

        <MyQueueSummary
          queuedTickets={queuedTickets}
          onRemove={handleRemoveFromQueue}
          onClear={handleClearQueue}
        />
      </aside>

      <main className="lg:col-span-3">
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
    </div>
  );
}