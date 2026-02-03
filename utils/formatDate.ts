export type DateFormatOptions = Intl.DateTimeFormatOptions

export function formatDate(
  date: string | Date | null | undefined,
  locale: string = "en-US",
  options: DateFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  }
): string {
  if (!date) return "-"

  const parsedDate = typeof date === "string" ? new Date(date) : date

  if (isNaN(parsedDate.getTime())) return "-"

  return parsedDate.toLocaleDateString(locale, options)
}
