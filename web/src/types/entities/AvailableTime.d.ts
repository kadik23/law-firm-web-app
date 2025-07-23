type EventType = "free" | "booked" | "not-available";

interface CalendarEvent {
  start: Date;
  end: Date;
  title?: string;
  type: EventType;
}

interface AvailableSlot {
    id: number;
    day: number;
    startTime: string;
    endTime: string;
  }

type EventType = "free" | "booked" | "not-available";