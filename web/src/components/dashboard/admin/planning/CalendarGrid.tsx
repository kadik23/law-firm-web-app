import React from "react";
import {
  format,
  isToday,
  eachMonthOfInterval,
  startOfYear,
  endOfYear,
  isSameMonth,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
  eachDayOfInterval,
} from "date-fns";
import classNames from "classnames";
import { TimeColumn } from "./TimeColumn";
import { DayColumn } from "./DayColumn";

const getSlotStyle = (type: EventType) => {
  switch (type) {
    case "free":
      return {
        backgroundColor: "#EFF6FF",
        borderLeft: "4px solid #3B82F6",
        color: "#1E3A8A",
      };
    case "booked":
      return {
        backgroundColor: "#0EA5E9",
        borderLeft: "4px solid #0284C7",
        color: "white",
      };
    default:
      return {};
  }
};

interface CalendarGridProps {
  view: string;
  hours: string[];
  getEventsForDay: (day: Date) => CalendarEvent[];
  currentDate: Date;
  setView: (view: string) => void;
  setCurrentDate: (date: Date) => void;
}

interface MonthViewProps {
  days: Date[];
  getEventsForDay: (day: Date) => CalendarEvent[];
  currentDate: Date;
  setView: (view: string) => void;
  setCurrentDate: (date: Date) => void;
}

interface YearViewProps {
  currentDate: Date;
  setView: (view: string) => void;
  setCurrentDate: (date: Date) => void;
}

export const CalendarGrid = ({
  view,
  hours,
  getEventsForDay,
  currentDate,
  setView,
  setCurrentDate,
}: CalendarGridProps) => {

  const dateUINav = (view: string) => {
    const start = {
        Day: currentDate,
        Week: startOfWeek(currentDate, { weekStartsOn: 0 }),
        Month: startOfMonth(currentDate),
        Year: startOfYear(currentDate)
    }[view] || currentDate;

    const end = {
        Day: currentDate,
        Week: endOfWeek(currentDate, { weekStartsOn: 0 }),
        Month: endOfMonth(currentDate),
        Year: endOfYear(currentDate)
    }[view] || currentDate;

    return {
        start,
        end,
        days: eachDayOfInterval({ start, end })
    }
  }

  const {days} = dateUINav(view);

  const renderWeekView = () => (
    <div className="grid grid-cols-8">
      <TimeColumn hours={hours} />
      {days.map((day: Date) => (
        <DayColumn
          key={day.toString()}
          day={day}
          hours={hours}
          events={getEventsForDay(day)}
        />
      ))}
    </div>
  );

  const renderDayView = () => (
    <div className="grid grid-cols-2" style={{ minWidth: "400px" }}>
      <TimeColumn hours={hours} />
      <DayColumn
        day={currentDate}
        hours={hours}
        events={getEventsForDay(currentDate)}
      />
    </div>
  );

  const renderMonthView = () => (
    <MonthView
      days={days}
      getEventsForDay={getEventsForDay}
      currentDate={currentDate}
      setView={setView}
      setCurrentDate={setCurrentDate}
    />
  );

  const renderYearView = () => (
    <YearView
      currentDate={currentDate}
      setView={setView}
      setCurrentDate={setCurrentDate}
    />
  );

  switch (view) {
    case "Day":
      return renderDayView();
    case "Week":
      return renderWeekView();
    case "Month":
      return renderMonthView();
    case "Year":
      return renderYearView();
    default:
      return renderWeekView();
  }
};

const MonthView = ({
  days,
  getEventsForDay,
  currentDate,
  setView,
  setCurrentDate,
}: MonthViewProps) => {
  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return (
    <div>
      <div className="grid grid-cols-7 text-center text-sm font-semibold text-gray-500 border-b">
        {weekDays.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const events = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          return (
            <div
              key={day.toString()}
              className={classNames("h-32 p-2 border-t border-l", {
                "text-gray-400": !isCurrentMonth,
                "bg-white": isCurrentMonth,
                "border-blue-500 border-2": isToday(day),
              })}
              onClick={() => {
                setCurrentDate(day);
                setView("Day");
              }}
            >
              <p
                className={classNames("font-bold", {
                  "text-blue-600": isToday(day),
                })}
              >
                {format(day, "d")}
              </p>
              <div className="mt-1 text-xs overflow-y-auto max-h-20">
                {events.slice(0, 3).map((event, i) => (
                  <div
                    key={i}
                    className="truncate p-1 rounded mb-1"
                    style={getSlotStyle(event.type)}
                  >
                    {event.title}
                  </div>
                ))}
                {events.length > 3 && (
                  <div className="text-gray-500">+{events.length - 3} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const YearView = ({ currentDate, setView, setCurrentDate }: YearViewProps) => {
  const months = eachMonthOfInterval({
    start: startOfYear(currentDate),
    end: endOfYear(currentDate),
  });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {months.map((month) => (
        <div
          key={month.toString()}
          className={classNames(
            "p-4 rounded-lg cursor-pointer hover:bg-gray-100",
            {
              "bg-blue-100": isSameMonth(month, currentDate),
            }
          )}
          onClick={() => {
            setCurrentDate(month);
            setView("Month");
          }}
        >
          <p className="text-center font-semibold text-lg">
            {format(month, "MMMM yyyy")}
          </p>
        </div>
      ))}
    </div>
  );
};
