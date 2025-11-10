'use client';

// Helper objects for styling badges
const priorityColors = {
  Low: 'bg-green-600',
  Medium: 'bg-yellow-600',
  High: 'bg-orange-600',
  Critical: 'bg-red-600',
};

const statusColors = {
  Open: 'bg-blue-500',
  'In Progress': 'bg-purple-500',
  'On Hold': 'bg-zinc-500',
  Resolved: 'bg-green-700',
};

// Helper function to format date
function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return date.toLocaleDateString(); // Over a year, show date
  interval = seconds / 2592000;
  if (interval > 1) return date.toLocaleDateString(); // Over a month, show date
  interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)}d ago`;
  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)}h ago`;
  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)}m ago`;
  return 'Just now';
}

export default function TicketCard({ ticket, isInQueue, onAddToQueue }) {
  const { id, title, priority, status, assignee, updatedAt, description } =
    ticket;

  const priorityColor = priorityColors[priority] || 'bg-zinc-400';
  const statusColor = statusColors[status] || 'bg-zinc-400';

  return (
    <div className="bg-zinc-800 rounded-lg shadow-lg p-4 flex flex-col justify-between space-y-4 border border-zinc-700">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <span
            className={`text-xs font-bold px-2 py-1 rounded-full ${priorityColor}`}
          >
            {priority}
          </span>
        </div>
        <p className="text-sm text-zinc-400 mb-3">{description}</p>
      </div>

      <div>
        <div className="flex justify-between items-center text-sm mb-4">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor}`}
          >
            {status}
          </span>
          <span className="text-zinc-400">
            {assignee}
          </span>
        </div>
        
        <div className="flex justify-between items-center text-xs text-zinc-500 mb-4">
          <span>{id}</span>
          <span>Updated: {formatRelativeTime(updatedAt)}</span>
        </div>

        <button
          onClick={() => onAddToQueue(id)}
          disabled={isInQueue}
          className="btn-primary"
        >
          {isInQueue ? 'In My Queue' : 'Add to My Queue'}
        </button>
      </div>
    </div>
  );
}