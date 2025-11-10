# Helpdesk Ticket Board (Next.js Project)

This is a solution for the Helpdesk Ticket Board project, built with Next.js, Tailwind CSS, and the App Router.

## 🚀 How to Run This Project

1.  Clone the repository.
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✅ Feature Checklist

This project implements all the core requirements from the assignment.

* **Project Setup:** Uses Next.js App Router, Tailwind, and ESLint with a `src/` directory.
* **API Route:** A `GET` route at `/api/tickets` serves mock JSON ticket data.
* **Components & Props:** The app is broken down into modular components (e.g., `Board`, `TicketList`, `TicketCard`) that pass props correctly.
* **State Management:** All state (tickets, filters, queue) is lifted to the parent `Board` component.
* **Controlled Inputs:** All filters (Status, Priority) and the search bar are fully controlled components.
* **Data Fetching:** Tickets are fetched from the API on component mount using `useEffect`.
* **Live Updates:** A `useEffect` hook with a `setInterval` simulates live ticket updates (status/priority changes) every 6-10 seconds.
* **Effect Cleanup:** The interval for live updates is properly cleaned up on component unmount.
* **Derived State:** `useMemo` is used to efficiently calculate `visibleTickets` and `queuedTickets` without storing derived data in state.
* **Queue Feature:** Users can add/remove tickets to/from "My Queue," and the UI reflects this (e.g., disabled buttons, summary list).
* **UX / Conditional Rendering:** The app correctly displays "Loading," "Error," and "No tickets match..." messages.