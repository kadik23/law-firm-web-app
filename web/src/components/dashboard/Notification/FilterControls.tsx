"use client";

import { useState } from "react";
import Dropdown from "./Dropdown";

interface FilterControlsProps {
  postTimeValue: string;
  notificationTypeValue: string;
  consultationTimeValue: string;
  consultationTypeValue: string;
  onPostTimeChange: (value: string) => void;
  onNotificationTypeChange: (value: string) => void;
  onConsultationTimeChange: (value: string) => void;
  onConsultationTypeChange: (value: string) => void;
}

const FilterControls = ({
  postTimeValue,
  notificationTypeValue,
  consultationTimeValue,
  consultationTypeValue,
  onPostTimeChange,
  onNotificationTypeChange,
  onConsultationTimeChange,
  onConsultationTypeChange,
}: FilterControlsProps) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const postTimeOptions = ["Tous", "Aujourde'hui", "7 dernier jours", "30 dernier jours", "cette annee (2025)", "cette annee (2024)"];
  const notificationTypeOptions = ["Tous", "Commentaires", "Consultations", "Documents"];
  const consultationTypes = ["Tous", "Acceptée", "Refusée"];

  const handleToggle = (dropdownId: string) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-6">
      <div className="flex items-center gap-2 mb-4 md:mb-0 w-full md:w-auto">
        <Dropdown
          options={postTimeOptions}
          value={postTimeValue}
          iconSrc="/icons/dashboard/time.svg"
          isOpen={openDropdown === "postTime"}
          onToggle={() => handleToggle("postTime")}
          onSelect={(option) => {
            onPostTimeChange(option);
            setOpenDropdown(null); // Close dropdown after selection
          }}
        />
        <Dropdown
          options={notificationTypeOptions}
          value={notificationTypeValue}
          iconSrc="/icons/dashboard/comment.svg"
          isOpen={openDropdown === "notificationType"}
          onToggle={() => handleToggle("notificationType")}
          onSelect={(option) => {
            onNotificationTypeChange(option);
            setOpenDropdown(null); // Close dropdown after selection
          }}
        />
      </div>
      {(
        notificationTypeValue === "Tous" || 
        notificationTypeValue === "Consultations" || 
        notificationTypeValue === "Notifications"
      ) && (
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Dropdown
            options={postTimeOptions}
            value={consultationTimeValue}
            iconSrc="/icons/dashboard/time.svg"
            isOpen={openDropdown === "consultationTime"}
            onToggle={() => handleToggle("consultationTime")}
            onSelect={(option) => {
              onConsultationTimeChange(option);
              setOpenDropdown(null); // Close dropdown after selection
            }}
          />
          <Dropdown
            options={consultationTypes}
            value={consultationTypeValue}
            iconSrc="/icons/dashboard/comment.svg"
            isOpen={openDropdown === "consultationType"}
            onToggle={() => handleToggle("consultationType")}
            onSelect={(option) => {
              onConsultationTypeChange(option);
              setOpenDropdown(null); // Close dropdown after selection
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FilterControls;