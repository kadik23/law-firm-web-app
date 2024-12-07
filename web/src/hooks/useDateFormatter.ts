import { useMemo } from "react";

const useDateFormatter = (dateInput: Date | string) => {
    const months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const formattedDate = useMemo(() => {
        let date: Date;
        
        if (dateInput instanceof Date) {
            // Input is already a Date object
            date = dateInput;
        } else {
            // Input is a string, convert to Date
            date = new Date(dateInput);
        }

        // Return formatted date string
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }, [dateInput]); // Recalculate if `dateInput` changes

    return formattedDate;
};

export default useDateFormatter;
