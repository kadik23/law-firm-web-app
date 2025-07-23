import React from 'react';
import { Icon } from "@iconify-icon/react";
import classNames from "classnames";

interface ControlsProps {
    view: string;
    setView: (view: string) => void;
    onPrev: () => void;
    onNext: () => void;
    onToday: () => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

const viewOptions = [
    { key: "Day", label: "Jour" },
    { key: "Week", label: "Semaine" },
    { key: "Month", label: "Mois" },
    { key: "Year", label: "Année" },
];

export const Controls = ({ view, setView, onPrev, onNext, onToday, searchTerm, setSearchTerm }: ControlsProps) => (
    <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-0 md:items-center mb-6">
        <div className="flex items-center gap-4">
            <button onClick={onPrev}><Icon icon="ic:round-chevron-left" width="24" height="24" /></button>
            <button onClick={onToday} className="font-semibold">Aujourd{"'"}hui</button>
            <button onClick={onNext}><Icon icon="ic:round-chevron-right" width="24" height="24" /></button>
        </div>
        <div className="flex gap-2 border border-gray-200 rounded-md p-1">
            {viewOptions.map(({ key, label }) => (
                <button
                    key={key}
                    onClick={() => setView(key)}
                    className={classNames("px-4 py-1 rounded-md text-sm", {
                        "bg-[#34495E] text-white": view === key,
                        "text-gray-600": view !== key,
                    })}
                >
                    {label}
                </button>
            ))}
        </div>
        <div className="relative">
            <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#34495E]"
            />
            <Icon icon="ic:round-search" width="24" height="24" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
    </div>
);
