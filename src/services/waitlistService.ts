// =====================================================
// PROJECT SKY WAITLIST & CMS SERVICE (MySQL & Serverless Bridge)
// =====================================================

export interface Subscriber {
  id: number;
  ticket_number: number;
  email: string;
  status: 'pending' | 'approved' | 'invited';
  source: string;
  created_at: string;
}

const STORAGE_KEY = 'sky_waitlist_subscribers_v1';

// Seed initial demo subscribers if empty
const getInitialSubscribers = (): Subscriber[] => {
  return [
    { id: 1, ticket_number: 1001, email: 'alex.dev@sky.ai', status: 'approved', source: 'website', created_at: '2026-07-25T10:00:00Z' },
    { id: 2, ticket_number: 1002, email: 'sarah.engineer@gmail.com', status: 'invited', source: 'website', created_at: '2026-07-26T14:30:00Z' },
    { id: 3, ticket_number: 1003, email: 'rohit.mehta@tech.in', status: 'pending', source: 'modal', created_at: '2026-07-27T09:15:00Z' },
  ];
};

export const getSubscribersFromStorage = (): Subscriber[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      const initial = getInitialSubscribers();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  } catch (e) {
    return getInitialSubscribers();
  }
};

export const saveSubscribersToStorage = (list: Subscriber[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save subscribers to localStorage', e);
  }
};

// ─── PUBLIC WAITLIST REGISTRATION ───
export const registerWaitlistEmail = async (email: string, source = 'website'): Promise<{ success: boolean; ticket_number: number; isDuplicate?: boolean; position?: number }> => {
  const cleanEmail = email.trim().toLowerCase();

  // Try Serverless MySQL API endpoint first if available
  try {
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, source })
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, ticket_number: data.ticket_number, position: data.position };
    }
  } catch (err) {
    // API endpoint not available in local Vite dev mode without serverless backend, fallback to client store
  }

  // Client-side local persistence fallback
  const list = getSubscribersFromStorage();
  const existing = list.find(s => s.email.toLowerCase() === cleanEmail);
  
  if (existing) {
    return { success: true, ticket_number: existing.ticket_number, isDuplicate: true, position: existing.id };
  }

  const maxTicket = list.reduce((max, s) => Math.max(max, s.ticket_number), 1000);
  const newTicket = maxTicket + 1;
  const newSubscriber: Subscriber = {
    id: list.length + 1,
    ticket_number: newTicket,
    email: cleanEmail,
    status: 'pending',
    source,
    created_at: new Date().toISOString()
  };

  const updated = [newSubscriber, ...list];
  saveSubscribersToStorage(updated);

  return { success: true, ticket_number: newTicket, position: updated.length };
};

// ─── ADMIN DASHBOARD CMS FUNCTIONS ───
export const fetchAllSubscribers = async (adminKey: string): Promise<Subscriber[]> => {
  try {
    const res = await fetch('/api/admin', {
      headers: { 'x-admin-key': adminKey }
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Fallback to local storage
  }
  return getSubscribersFromStorage();
};

export const updateSubscriberStatus = async (id: number, status: 'pending' | 'approved' | 'invited', adminKey: string): Promise<boolean> => {
  try {
    const res = await fetch('/api/admin', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify({ id, status })
    });
    if (res.ok) return true;
  } catch (err) {
    // Fallback
  }

  const list = getSubscribersFromStorage();
  const idx = list.findIndex(s => s.id === id);
  if (idx !== -1) {
    list[idx].status = status;
    saveSubscribersToStorage(list);
    return true;
  }
  return false;
};

export const deleteSubscriber = async (id: number, adminKey: string): Promise<boolean> => {
  try {
    const res = await fetch('/api/admin', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify({ id })
    });
    if (res.ok) return true;
  } catch (err) {
    // Fallback
  }

  const list = getSubscribersFromStorage();
  const filtered = list.filter(s => s.id !== id);
  saveSubscribersToStorage(filtered);
  return true;
};

// Export Mailing List to CSV format
export const exportSubscribersToCSV = (subscribers: Subscriber[]) => {
  const headers = ['ID', 'Ticket Number', 'Email', 'Status', 'Source', 'Registered At'];
  const rows = subscribers.map(s => [
    s.id,
    s.ticket_number,
    `"${s.email}"`,
    s.status,
    s.source,
    `"${new Date(s.created_at).toLocaleString()}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `SKY_Waitlist_Subscribers_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
