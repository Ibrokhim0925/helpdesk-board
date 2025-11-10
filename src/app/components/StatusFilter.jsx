'use client';

export default function StatusFilter({ value, onChange }) {
  const statuses = ['All', 'Open', 'In Progress', 'On Hold', 'Resolved'];
  return (
    <div>
      <label
        htmlFor="status-filter"
        className="block text-sm font-medium text-zinc-300 mb-1"
      >
        Status
      </label>
      <select
        id="status-filter"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-select-dark"
      >
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
}