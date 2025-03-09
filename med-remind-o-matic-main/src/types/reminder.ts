
export interface Reminder {
  id: string;
  medicineName: string;
  description: string;
  dosage: string;
  time: string; // Format: "HH:MM"
  date: string; // Format: "YYYY-MM-DD"
  recurring: boolean;
  recurringDays?: string[]; // ["monday", "tuesday", etc.]
  color?: string;
  taken: boolean;
}
