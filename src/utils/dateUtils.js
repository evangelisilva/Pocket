/**
 * Safely parses a date string into a Date object that reflects the intended local date.
 * Handles both YYYY-MM-DD and full ISO strings.
 */
export const parseLocalDate = (dateStr) => {
    if (!dateStr) return new Date();

    // If it's just YYYY-MM-DD, parse it as local time by using slashes or parts
    if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    // Fallback for full ISO strings or other formats
    return new Date(dateStr);
};

/**
 * Formats a date for the <input type="date"> field (YYYY-MM-DD)
 * without timezone shifting.
 */
export const formatForInput = (date) => {
    const d = date instanceof Date ? date : parseLocalDate(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
};
