import Board from './components/Board';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">
        Helpdesk Ticket Board
      </h1>
      <Board />
    </main>
  );
}