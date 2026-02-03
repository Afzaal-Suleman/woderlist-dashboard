export function formatCurrency(
    amount: number,
    currency: string = "USD",
    locale: string = "en-US"
): string {
    if (isNaN(amount)) return "—"

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
    }).format(amount)
}

// Helper function to format budget
export const formatBudget = (amount: number | null, currency: string | null = 'USD') => {
    if (!amount) return "Not set"
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount)
}