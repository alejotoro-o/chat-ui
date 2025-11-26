import type React from "react";
import { formatDate } from "../utilities/formatDate";
import { cn } from "../utilities/ui";

type DateDividerProps = {
    date: Date
    locale?: string
    className?: string
    classNameLines?: string
    classNameText?: string
}

export const DateDivider: React.FC<DateDividerProps> = ({ date, locale = "en-US", className, classNameLines, classNameText }) => (
    <div className={cn("flex flex-row items-center my-2", className)}>
        <div className={cn("grow border-t border-gray-300", classNameLines)} />
        <span className={cn("mx-2 text-sm text-gray-500", classNameText)}>{formatDate(date, locale)}</span>
        <div className={cn("grow border-t border-gray-300", classNameLines)} />
    </div>
);