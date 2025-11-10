'use client';

export default function PriorityFilter({ value, onChange }) {
  const priorities = ['All', 'Low', 'Medium', 'High', 'Critical'];
  return (
    <div>
      <label
        htmlFor="priority-filter"
        className="block text-sm font-medium text-zinc-300 mb-1"
      >
        Priority
      </label>
      <select
        id="priority-filter"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-select-dark"
      >
        {priorities.map((priority) => (
          <option key={priority} value={priority}>
            {priority}
          </option>
        ))}
      </select>
    </div>
  );
}