export const priorityOrder = { Low: 1, Medium: 2, High: 3, Critical: 4 };
export const statusOrder = {
  Open: 1,
  'In Progress': 2,
  'On Hold': 3,
  Resolved: 4,
};

// --- Helper arrays for live update simulation ---

export const allStatuses = ['Open', 'In Progress', 'On Hold', 'Resolved'];
export const allPriorities = ['Low', 'Medium', 'High', 'Critical'];

// Realistic state transitions
export const statusTransitions = {
  Open: ['In Progress', 'On Hold'],
  'In Progress': ['On Hold', 'Resolved'],
  'On Hold': ['In Progress', 'Open'],
  Resolved: [], // Resolved is a final state in this simple model
};

export const priorityTransitions = {
  Low: ['Medium'],
  Medium: ['High', 'Low'],
  High: ['Critical', 'Medium'],
  Critical: ['High'], // Can be demoted
};