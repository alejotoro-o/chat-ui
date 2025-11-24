// Utility to format just the date (no time)
export const formatDate = (date: Date, locale: string = "en-US") =>
    date.toLocaleDateString(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });