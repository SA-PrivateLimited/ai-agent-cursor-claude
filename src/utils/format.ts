const dateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'UTC',
  timeZoneName: 'short',
})

export function formatDate(value: string): string {
  const iso = value.length === 10 ? `${value}T00:00:00Z` : value
  return dateFormat.format(new Date(iso))
}

export function formatDateTime(value: string): string {
  return dateTimeFormat.format(new Date(value))
}
