"use client";
import { useState } from "react";
import {
  addDays,
  subDays,
  getDay,
  isWithinInterval,
  isSameDay,
  parse,
  addMonths,
  subMonths,
  addYears,
  subYears,
} from "date-fns";
import { ManageAvailabilityModal } from "@/components/dashboard/admin/planning/ManageAvailabilityModal";
import { Controls } from "@/components/dashboard/admin/planning/Controls";
import { Header } from "@/components/dashboard/admin/planning/Header";
import { CalendarGrid } from "@/components/dashboard/admin/planning/CalendarGrid";
import { useAvailableSlots } from "@/hooks/admin/useAvailableSlots";
import { useConsultations, Consultation } from "@/hooks/admin/useConsultations";

const hours = Array.from({ length: 18 }, (_, i) => `${i + 7}:00`);

const PlanningPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("Week");
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { slots, loading, error, addSlot, removeSlot } = useAvailableSlots();
  const {consultations} = useConsultations()

  const handleNext = () => {
    const newDate = {
        Day: addDays(currentDate, 1),
        Week: addDays(currentDate, 7),
        Month: addMonths(currentDate, 1),
        Year: addYears(currentDate, 1),
    }[view] || currentDate;
    setCurrentDate(newDate);
  };

  const handlePrev = () => {
    const newDate = {
        Day: subDays(currentDate, 1),
        Week: subDays(currentDate, 7),
        Month: subMonths(currentDate, 1),
        Year: subYears(currentDate, 1),
    }[view] || currentDate;
    setCurrentDate(newDate);
  }

  const bookedEvents: CalendarEvent[] = consultations.map((c: Consultation) => {
    const [hour, minute] = c.time.split(":").map(Number);
    const [year, month, day] = c.date.split("-").map(Number);
    const startDate = new Date(year, month - 1, day, hour, minute);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    return {
      start: startDate,
      end: endDate,
      title: c.problem && c.problem.name,
      type: "booked" as const,
    };
  });

  const getEventsForDay = (day: Date): CalendarEvent[] => {
    const dayOfWeek = getDay(day);
    const availableSlots = slots
      .filter((slot) => slot.day === dayOfWeek)
      .map((slot) => {
        const start = parse(slot.startTime, "HH:mm", day);
        const end = parse(slot.endTime, "HH:mm", day);
        return { start, end, type: "free" as const, title: "Disponible" };
      });

    const freeSlots = availableSlots.filter(
      (slot) =>
        !bookedEvents.some((bookedEvent) =>
          isWithinInterval(bookedEvent.start, { start: slot.start, end: slot.end })
        )
    );
    const dayBookings = bookedEvents.filter((event) => isSameDay(event.start, day));
    const allEvents: CalendarEvent[] = [...freeSlots, ...dayBookings];

    if (searchTerm) {
        return allEvents.filter(event => event.title?.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return allEvents;
  };

  return (
    <div className="p-8 bg-white rounded-lg">
      <Header onManageClick={() => setModalOpen(true)} />
      <Controls
        view={view}
        setView={setView}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={() => setCurrentDate(new Date())}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <CalendarGrid
        view={view}
        hours={hours}
        getEventsForDay={getEventsForDay}
        currentDate={currentDate}
        setView={setView}
        setCurrentDate={setCurrentDate}
      />
      <ManageAvailabilityModal
        isOpen={isModalOpen}
        onClose={() => {
            setModalOpen(false);
        }}
        slots={slots}
        loading={loading}
        error={error}
        addSlot={addSlot}
        removeSlot={removeSlot}
      />
    </div>
  );
};

export default PlanningPage;
