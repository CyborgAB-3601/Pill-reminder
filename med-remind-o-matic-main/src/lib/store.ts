
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Reminder } from '@/types/reminder';
import { v4 as uuidv4 } from 'uuid';

interface ReminderState {
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id' | 'taken'>) => void;
  editReminder: (id: string, reminder: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  markAsTaken: (id: string, taken: boolean) => void;
  getNextReminder: () => Reminder | null;
}

export const useReminderStore = create<ReminderState>()(
  persist(
    (set, get) => ({
      reminders: [],
      
      addReminder: (reminderData) => {
        const newReminder: Reminder = {
          ...reminderData,
          id: uuidv4(),
          taken: false,
        };
        
        set((state) => ({
          reminders: [...state.reminders, newReminder],
        }));
      },
      
      editReminder: (id, reminderData) => {
        set((state) => ({
          reminders: state.reminders.map((reminder) => 
            reminder.id === id ? { ...reminder, ...reminderData } : reminder
          ),
        }));
      },
      
      deleteReminder: (id) => {
        set((state) => ({
          reminders: state.reminders.filter((reminder) => reminder.id !== id),
        }));
      },
      
      markAsTaken: (id, taken) => {
        set((state) => ({
          reminders: state.reminders.map((reminder) => 
            reminder.id === id ? { ...reminder, taken } : reminder
          ),
        }));
      },
      
      getNextReminder: () => {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        // First, look for today's reminders that are upcoming
        const todaysReminders = get().reminders
          .filter(r => !r.taken && r.date === today && r.time > currentTime)
          .sort((a, b) => a.time.localeCompare(b.time));
        
        if (todaysReminders.length > 0) {
          return todaysReminders[0];
        }
        
        // If no reminders for today, look for the next upcoming day
        const upcomingReminders = get().reminders
          .filter(r => !r.taken && r.date > today)
          .sort((a, b) => {
            const dateCompare = a.date.localeCompare(b.date);
            return dateCompare !== 0 ? dateCompare : a.time.localeCompare(b.time);
          });
        
        return upcomingReminders.length > 0 ? upcomingReminders[0] : null;
      },
    }),
    {
      name: 'pill-reminder-storage',
    }
  )
);
