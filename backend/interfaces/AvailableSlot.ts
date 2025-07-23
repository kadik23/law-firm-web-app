export interface IAvailableSlot {
  id?: number;
  day: number; // 0=Sunday, 1=Monday, ...
  startTime: string; // 'HH:mm'
  endTime: string;   // 'HH:mm'
} 