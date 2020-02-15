export function formateDate(date: Date, withTime?: boolean): string {
  let iso = date.toISOString().match(/(\d{4}\-\d{2}\-\d{2})T(\d{2}:\d{2}:\d{2})/)

  let result = iso[1]

  if (withTime) {
    result += ` ${iso[2]}`
  }

  return result
}