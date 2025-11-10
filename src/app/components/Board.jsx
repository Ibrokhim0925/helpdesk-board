'use client';

import { useState, useEffect, useMemo } from 'react';
import TicketList from './TicketList';
import StatusFilter from './StatusFilter';
import PriorityFilter from './PriorityFilter';
import SearchBox from './SearchBox';
import StatusMessage from './StatusMessage';

export default function Board() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- NEW STATE ---
  const [filters, setFilters] = useState({ status: 'All', priority: 'All' });
  const [search, setSearch] = useState('');
  // -----------------

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
  }, []); // Empty dependency array runs this once on mount

  // --- NEW STATE HANDLERS ---
  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  // --------------------------

  // --- NEW DERIVED STATE (MEMOIZED) ---
  const visibleTickets = useMemo(() => {
    const searchLower = search.toLowerCase();

    return tickets.filter((ticket) => {
      // Filter by Status
      if (filters.status !== 'All' && ticket.status !== filters.status) {
        return false;
      }
      // Filter by Priority
      if (
        filters.priority !== 'All' &&
        ticket.priority !== filters.priority
      ) {
        return false;
      }
      // Filter by Search
      if (
        searchLower &&
        !ticket.title.toLowerCase().includes(searchLower) &&
        !ticket.description.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
      return true;
    });
  }, [tickets, filters, search]); // Re-runs only when these change
  // ------------------------------------

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Column 1: Filters & Queue (Sidebar) */}
      <aside className="lg:col-span-1 space-y-6">
        
        {/* --- UPDATED FILTERS SECTION --- */}
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
        {/* -------------------------------- */}

        <div className="bg-zinc-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">My Queue</h2>
          {/* Queue component will go here */}
        </div>
      </aside>

      {/* Column 2: Ticket List (Main) */}
      <main className="lg:col-span-3">
        <StatusMessage
          loading={loading}
          error={error}
          isEmpty={!loading && !error && visibleTickets.length === 0}
        />
        <TicketList
          tickets={visibleTickets} // Pass filtered tickets
          queue={{}} // We will pass the real queue later
          onAddToQueue={() => {}} // We will pass the real handler later
        />
      </main>
    </div>
  );
}