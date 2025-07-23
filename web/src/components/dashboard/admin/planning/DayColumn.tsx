import classNames from "classnames";
import { format, isToday } from "date-fns";

const getSlotStyle = (type: EventType) => {
  switch (type) {
    case "free":
      return {
        backgroundColor: "#EFF6FF", // Blue-50
        borderLeft: "4px solid #3B82F6", // Blue-500
        color: "#1E3A8A", // Blue-900
      };
    case "booked":
      return {
        backgroundColor: "#0EA5E9", // Sky-500
        borderLeft: "4px solid #0284C7", // Sky-600
        color: "white",
      };
    default:
      return {};
  }
};

const calculateEventPosition = (event: CalendarEvent) => {
  const startHour = event.start.getHours();
  const startMinutes = event.start.getMinutes();
  const endHour = event.end.getHours();
  const endMinutes = event.end.getMinutes();
  const top = (startHour - 7) * 64 + startMinutes;
  const height = (endHour - startHour) * 64 + (endMinutes - startMinutes);
  return { top, height };
};

export const DayColumn = ({ day, hours, events }: { day: Date, hours: string[], events: CalendarEvent[], }) => (
  
  <div className="col-span-1 border-l border-gray-200">
      <div className="text-center py-2 border-b border-gray-200 h-16">
          <p className="text-xs text-gray-500">{format(day, "EEE").toUpperCase()}</p>
          <p className={classNames("text-2xl font-semibold", { "text-blue-600": isToday(day) })}>{format(day, "d")}</p>
      </div>
      <div className="relative h-full">
          {hours.map((_, index) => (
              <div key={index} className="h-16 border-t border-gray-200" style={{ backgroundColor: "#FAFAFA" }}></div>
          ))}
          {events.map((event, index) => {
              const { top, height } = calculateEventPosition(event);
              const style = getSlotStyle(event.type);
              return (
                  <div key={index} className="absolute left-0 right-0 p-2 rounded-md text-xs" style={{ top: `${top}px`, height: `${height}px`, ...style }}>
                      <p className="font-semibold text-nowrap">{event.title}</p>
                      <p>{`${format(event.start, "h:mm a")} - ${format(event.end, "h:mm a")}`}</p>
                  </div>
              );
          })}
      </div>
  </div>
);