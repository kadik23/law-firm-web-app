import { setMinutes, setHours, format } from "date-fns";

export const TimeColumn = ({ hours }: { hours: string[] }) => (
  <div className="col-span-1 pr-4 text-right">
      <div className="h-16 flex items-end justify-end pr-2 pb-2">
          <span className="text-xs text-gray-400">EST GMT-5</span>
      </div>
      {hours.map((hour) => {
          const hourInt = parseInt(hour, 10);
          const date = setHours(setMinutes(new Date(0), 0), hourInt);
          return (
              <div key={hour} className="h-16">
                  <span className="text-xs text-gray-500">{format(date, "h a")}</span>
              </div>
          );
      })}
  </div>
);
