import { Customer, FollowUpStatus, User } from '../types';
import { INITIAL_CUSTOMERS, MOCK_USERS } from '../constants';

// --- CONFIGURATION ---
// 1. Deploy your Google Apps Script (instructions provided in chat).
// 2. Paste the 'Web App URL' inside the quotes below.
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw6SN3x-donXMSsIRNZB-guxW2ErgcCRNdYood9Bj403NF7xYr-cNiDCycC3zu9GHa02w/exec'; 

const STORAGE_KEY = 'clinic_crm_data';

// Helper to safely get property regardless of case (e.g., 'email', 'Email', 'EMAIL')
const getVal = (obj: any, key: string) => {
  if (!obj) return undefined;
  const foundKey = Object.keys(obj).find(k => k.toLowerCase() === key.toLowerCase());
  return foundKey ? obj[foundKey] : undefined;
};

export const getCustomers = async (): Promise<Customer[]> => {
  // If URL is provided, try to fetch from Sheet
  if (GOOGLE_SCRIPT_URL) {
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getCustomers`);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const rawData = await response.json();
      
      // Safety: Ensure it's an array
      if (Array.isArray(rawData)) {
        // Map data safely to ensure keys match our Customer interface
        const data: Customer[] = rawData.map((c: any) => ({
          id: String(getVal(c, 'id') || Math.random().toString(36).substr(2, 9)),
          name: String(getVal(c, 'name') || 'Unknown'),
          phone: String(getVal(c, 'phone') || ''),
          branch: String(getVal(c, 'branch') || 'Siam'),
          lastTreatment: String(getVal(c, 'lastTreatment') || ''),
          serviceDate: String(getVal(c, 'serviceDate') || ''),
          status: (getVal(c, 'status') as FollowUpStatus) || FollowUpStatus.Pending,
          notes: String(getVal(c, 'notes') || '')
        }));
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
      } else {
        console.warn("API did not return an array for customers:", rawData);
      }
    } catch (error) {
      console.error("Failed to fetch from Sheet, falling back to local:", error);
    }
  }

  // Local Mock Logic (Fallback)
  await new Promise(resolve => setTimeout(resolve, 500));
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CUSTOMERS));
  return INITIAL_CUSTOMERS;
};

export const updateCustomerStatus = async (id: string, status: FollowUpStatus, notes: string): Promise<Customer[]> => {
  
  // 1. Optimistic Update (Update Local First)
  const stored = localStorage.getItem(STORAGE_KEY);
  let customers: Customer[] = stored ? JSON.parse(stored) : INITIAL_CUSTOMERS;

  customers = customers.map(c => {
    if (String(c.id) === String(id)) {
      return { ...c, status, notes };
    }
    return c;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));

  // 2. Send to Google Sheet if URL exists
  if (GOOGLE_SCRIPT_URL) {
    try {
       await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action: 'updateCustomer', id, status, notes })
      });
    } catch (error) {
      console.error("Failed to update Sheet:", error);
    }
  } else {
    await new Promise(resolve => setTimeout(resolve, 600));
  }

  return customers;
};

export const syncFromSheets = async (): Promise<Customer[]> => {
    if (!GOOGLE_SCRIPT_URL) {
       console.log("No Google Script URL provided. Resetting to mock data.");
       await new Promise(resolve => setTimeout(resolve, 1000));
       localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CUSTOMERS));
       return INITIAL_CUSTOMERS;
    }

    return getCustomers();
};

export const login = async (email: string, password: string): Promise<User | null> => {
  // 1. Try to fetch Users from Google Sheet
  if (GOOGLE_SCRIPT_URL) {
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getUsers`);
      if (response.ok) {
        const rawUsers = await response.json();
        
        // Safety Check: Ensure response is an array
        if (Array.isArray(rawUsers)) {
          const found = rawUsers.find((u: any) => {
             // Robustly get email/password even if header case differs (e.g. Email vs email)
             const uEmail = getVal(u, 'email') || '';
             const uPass = getVal(u, 'password') || '';
             
             return String(uEmail).trim().toLowerCase() === email.trim().toLowerCase() && 
                    String(uPass).trim() === password.trim();
          });

          if (found) {
            return {
              email: String(getVal(found, 'email') || email),
              name: String(getVal(found, 'name') || 'Staff'),
              branch: String(getVal(found, 'branch') || 'Siam') // Ensure branch string is passed
            } as User;
          }
        } else {
          console.warn("Sheet returned invalid user data (not an array):", rawUsers);
        }
      }
    } catch (error) {
      console.error("Failed to fetch users from Sheet:", error);
    }
  }

  // 2. Fallback to Mock Users
  await new Promise(resolve => setTimeout(resolve, 800));
  const mockFound = MOCK_USERS.find(u => 
    u.email.toLowerCase() === email.trim().toLowerCase() && 
    u.password === password.trim()
  );
  
  if (mockFound) {
     const { password, ...safeUser } = mockFound;
     return safeUser as User;
  }

  return null;
};