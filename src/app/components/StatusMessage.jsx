'use client';

export default function StatusMessage({ loading, error, isEmpty }) {
  const messageStyle =
    'flex items-center justify-center h-40 bg-zinc-800 rounded-lg text-zinc-400 text-lg';

  if (loading) {
    return <div className={messageStyle}>Loading tickets...</div>;
  }
  if (error) {
    return (
      <div className={`${messageStyle} text-red-400`}>
        Error: {error}
      </div>
    );
  }
  if (isEmpty) {
    return (
      <div className={messageStyle}>
        No tickets match your filters.
      </div>
    );
  }
  return null;
}