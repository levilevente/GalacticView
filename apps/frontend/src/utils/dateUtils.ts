/**
 * Formats a Date object as a date string in YYYY-MM-DD format using UTC.
 * Use this when comparing to APIs that return UTC date-only strings (e.g. NASA APOD).
 * @param date - The date to format
 * @returns Date string in YYYY-MM-DD format (UTC)
 */
export function getUTCDateString(date: Date): string {
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

/**
 * Converts a Date object to a new Date object representing the same date at 00:00:00 UTC.
 * @param date - The date to convert
 * @returns New Date object at 00:00:00 UTC of the given date
 */
export function toUTCDateOnly(date: Date): Date {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}
