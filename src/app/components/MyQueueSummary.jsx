'use client';

export default function MyQueueSummary({ queuedTickets, onRemove, onClear }) {
  const count = queuedTickets.length;

  return (
    <div className="bg-zinc-800 p-4 rounded-lg shadow-lg sticky top-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          My Queue
        </h2>
        <span className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">
          {count}
        </span>
      </div>

      {count === 0 ? (
        <p className="text-zinc-400 text-sm">No tickets added to your queue.</p>
      ) : (
        <div className="space-y-3">
          <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {queuedTickets.map((ticket) => (
              <li
                key={ticket.id}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-zinc-200 truncate" title={ticket.title}>
                  {ticket.title}
                </span>
                <button
                  onClick={() => onRemove(ticket.id)}
                  className="text-red-400 hover:text-red-300 font-medium ml-2 flex-shrink-0"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <hr className="border-zinc-700" />
          <button
            onClick={onClear}
            className="w-full btn-secondary"
          >
            Clear Queue
          </button>
        </div>
      )}
    </div>
  );
}