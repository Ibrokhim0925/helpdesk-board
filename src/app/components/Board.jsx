'use client';

import { useState, useEffect } from 'react';
import TicketList from './TicketList';
import StatusMessage from './StatusMessage';

export default function Board() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // We will add visibleTickets logic here later
  const visibleTickets = tickets;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Column 1: Filters & Queue (Sidebar) - We will add this later */}
      <aside className="lg:col-span-1 space-y-6">
        <div className="bg-zinc-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          {/* Filter components will go here */}
        </div>
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
          tickets={visibleTickets}
          queue={{}} // We will pass the real queue later
          onAddToQueue={() => {}} // We will pass the real handler later
        />
      </main>
    </div>
  );
}