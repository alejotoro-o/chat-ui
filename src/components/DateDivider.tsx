import type React from "react";
import { formatDate } from "../utilities/formatDate";
import { cn } from "../utilities/ui";

type DateDividerProps = {
    date: Date
    className?: string
    classNameLines?: string
    classNameText?: string
}

export const DateDivider: React.FC<DateDividerProps> = ({ date, className, classNameLines, classNameText }) => (
    <div className={cn("flex flex-row items-center my-2", className)}>
        <div className={cn("grow border-t border-gray-300", classNameLines)} />
        <span className={cn("mx-2 text-sm text-gray-500", classNameText)}>{formatDate(date)}</span>
        <div className={cn("grow border-t border-gray-300", classNameLines)} />
    </div>
);