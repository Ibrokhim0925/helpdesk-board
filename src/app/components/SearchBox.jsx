'use client';

export default function SearchBox({ value, onChange }) {
  return (
    <div>
      <label
        htmlFor="search-box"
        className="block text-sm font-medium text-zinc-300 mb-1"
      >
        Search
      </label>
      <input
        id="search-box"
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search title or description..."
        className="form-input-dark"
      />
    </div>
  );
}