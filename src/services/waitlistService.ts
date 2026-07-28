// =====================================================
// PROJECT SKY WAITLIST & CMS SERVICE (Supabase + Local Storage Fallback)
// =====================================================

import { supabase } from './supabaseClient';

export interface Subscriber {
  id: number;
  ticket_number: number;
  email: string;
  status: 'pending' | 'approved' | 'invited';
  source: string;
  created_at: string;
}

const STORAGE_KEY = 'sky_waitlist_subscribers_v1';

// ─── DISPOSABLE / TEMP EMAIL DOMAIN BLACKLIST ───
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  '10minutemail.com',
  'tempmail.com',
  'temp-mail.org',
  'guerrillamail.com',
  'trashmail.com',
  'yopmail.com',
  'dispostable.com',
  'sharklasers.com',
  'getairmail.com',
  'throwawaymail.com',
  'fakeinbox.com',
  'tempmail.net',
  'maildrop.cc',
  'nada.ltd',
  'mohmal.com',
  'tempail.com',
  'byom.de',
  'crazymailing.com',
  'disposablemail.com',
  'dropmail.me',
  'mailnesia.com',
  'mytrashmail.com',
  'spambox.us',
  'trashmail.net',
  'binkmail.com',
  'safetymail.info',
  '0815.ru',
  '10minutemail.co.uk',
  'getnada.com'
]);

// Block obvious test/fake emails
const FAKE_PATTERNS = [
  'test@test.com',
  'a@b.com',
  'asdf@asdf.com',
  'foo@bar.com',
  'admin@admin.com',
  'xyz@xyz.com',
  '123@123.com'
];

export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
}

// ─── STRICT REAL EMAIL VALIDATION ENGINE ───
export const validateRealEmail = (email: string): EmailValidationResult => {
  const clean = email.trim().toLowerCase();

  // Basic regex check
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!clean || !emailRegex.test(clean)) {
    return { isValid: false, error: 'Please enter a valid email address (e.g., name@gmail.com).' };
  }

  // Check pattern blacklists
  if (FAKE_PATTERNS.includes(clean)) {
    return { isValid: false, error: 'Please provide a valid personal or work email address.' };
  }

  // Domain extraction
  const domain = clean.split('@')[1];
  if (!domain) {
    return { isValid: false, error: 'Invalid email domain.' };
  }

  // Check disposable domain blacklist
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { isValid: false, error: 'Temporary or disposable email addresses are not allowed.' };
  }

  return { isValid: true };
};

export const getSubscribersFromStorage = (): Subscriber[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    return [];
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
export const registerWaitlistEmail = async (
  email: string, 
  source = 'website'
): Promise<{ success: boolean; ticket_number: number; isDuplicate?: boolean; position?: number; error?: string }> => {
  const cleanEmail = email.trim().toLowerCase();

  // 1. Run real email verification
  const validation = validateRealEmail(cleanEmail);
  if (!validation.isValid) {
    return { success: false, ticket_number: 0, error: validation.error };
  }

  // 2. Direct Supabase Database Integration
  try {
    // Check if email already registered in Supabase
    const { data: existing, error: checkError } = await supabase
      .from('waitlist_subscribers')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (!checkError && existing) {
      return { 
        success: true, 
        ticket_number: existing.ticket_number, 
        isDuplicate: true, 
        position: existing.id 
      };
    }

    // Get current max ticket number
    const { data: lastTicket } = await supabase
      .from('waitlist_subscribers')
      .select('ticket_number')
      .order('ticket_number', { ascending: false })
      .limit(1)
      .maybeSingle();

    const maxTicket = lastTicket?.ticket_number || 1000;
    const newTicket = maxTicket + 1;

    // Insert subscriber into Supabase
    const { data: inserted, error: insertError } = await supabase
      .from('waitlist_subscribers')
      .insert([
        {
          ticket_number: newTicket,
          email: cleanEmail,
          status: 'pending',
          source
        }
      ])
      .select()
      .single();

    if (!insertError && inserted) {
      return { 
        success: true, 
        ticket_number: inserted.ticket_number, 
        position: inserted.id 
      };
    }
  } catch (err) {
    console.warn('Supabase request failed, trying client local storage fallback', err);
  }

  // 3. Fallback to Local Storage if offline or Supabase unreachable
  const list = getSubscribersFromStorage();
  const existingLocal = list.find(s => s.email.toLowerCase() === cleanEmail);
  
  if (existingLocal) {
    return { success: true, ticket_number: existingLocal.ticket_number, isDuplicate: true, position: existingLocal.id };
  }

  const maxTicketLocal = list.reduce((max, s) => Math.max(max, s.ticket_number), 1000);
  const newTicketLocal = maxTicketLocal + 1;
  const newSubscriber: Subscriber = {
    id: list.length + 1,
    ticket_number: newTicketLocal,
    email: cleanEmail,
    status: 'pending',
    source,
    created_at: new Date().toISOString()
  };

  const updated = [newSubscriber, ...list];
  saveSubscribersToStorage(updated);

  return { success: true, ticket_number: newTicketLocal, position: updated.length };
};

// ─── ADMIN DASHBOARD CMS FUNCTIONS ───
export const fetchAllSubscribers = async (_adminKey: string): Promise<Subscriber[]> => {
  try {
    const { data, error } = await supabase
      .from('waitlist_subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data as Subscriber[];
    }
  } catch (err) {
    console.warn('Supabase fetch failed, falling back to local storage', err);
  }
  return getSubscribersFromStorage();
};

export const updateSubscriberStatus = async (id: number, status: 'pending' | 'approved' | 'invited', _adminKey: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('waitlist_subscribers')
      .update({ status })
      .eq('id', id);

    if (!error) return true;
  } catch (err) {
    console.warn('Supabase update failed', err);
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

export const deleteSubscriber = async (id: number, _adminKey: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('waitlist_subscribers')
      .delete()
      .eq('id', id);

    if (!error) return true;
  } catch (err) {
    console.warn('Supabase delete failed', err);
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
