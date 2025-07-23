import React, { useState } from "react";
import { Icon } from "@iconify-icon/react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface AvailableSlot {
  id: number;
  day: number;
  startTime: string;
  endTime: string;
}

interface ManageAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  slots: AvailableSlot[];
  loading: boolean;
  error: string | null;
  addSlot: (slot: Omit<AvailableSlot, "id">) => Promise<void>;
  removeSlot: (id: number) => Promise<void>;
}

export const ManageAvailabilityModal = ({
  isOpen,
  onClose,
  slots,
  loading,
  error,
  addSlot,
  removeSlot,
}: ManageAvailabilityModalProps) => {
  const [formState, setFormState] = useState({
    day: 0,
    startTime: "",
    endTime: "",
  });

  const handleAddSlot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { day, startTime, endTime } = formState;
    if (day >= 0 && startTime && endTime && startTime < endTime) {
      await addSlot({ day, startTime, endTime });
      setFormState({ day: 0, startTime: "", endTime: "" });
    } else {
      alert("End time must be after start time.");
    }
  };

  const handleDeleteSlot = async (id: number) => {
    await removeSlot(id);
  };

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Manage Recurring Availability</h2>
          <button onClick={onClose}>
            <Icon icon="ic:round-close" width="24" height="24" />
          </button>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="mb-6 max-h-60 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-2">
                Current Recurring Slots
              </h3>
              <div className="space-y-2">
                {slots.length > 0 ? (
                  slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex justify-between items-center p-2 bg-gray-100 rounded-md"
                    >
                      <p>
                        <span className="font-semibold">
                          {weekDays[slot.day]}
                        </span>
                        : {slot.startTime} - {slot.endTime}
                      </p>
                      <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Icon icon="ic:round-delete" width="20" height="20" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No recurring slots defined.</p>
                )}
              </div>
            </div>
            <form onSubmit={handleAddSlot} className="space-y-4">
              <h3 className="text-lg font-semibold border-t pt-4">
                Add New Slot
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="day"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Day of Week
                  </label>
                  <select
                    name="day"
                    id="day"
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    value={formState.day}
                    onChange={(e) =>
                      setFormState((f) => ({
                        ...f,
                        day: Number(e.target.value),
                      }))
                    }
                  >
                    {weekDays.map((day, index) => (
                      <option key={index} value={index}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="startTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    id="startTime"
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    value={formState.startTime}
                    onChange={(e) =>
                      setFormState((f) => ({ ...f, startTime: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="endTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    id="endTime"
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    value={formState.endTime}
                    onChange={(e) =>
                      setFormState((f) => ({ ...f, endTime: e.target.value }))
                    }
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[#34495E] text-white py-2 px-4 rounded-md hover:bg-opacity-90"
              >
                Add Slot
              </button>
            </form>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </>
        )}
      </div>
    </div>
  );
};
