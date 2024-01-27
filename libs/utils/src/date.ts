import dayjs, { Dayjs } from "dayjs"

/**
 * Get the date from an ISO 8601 week and year
 *
 * https://en.wikipedia.org/wiki/ISO_week_date
 *
 * Examples:
 *  getDateOfIsoWeek(53, 1976) -> Mon Dec 27 1976
 *  getDateOfIsoWeek( 1, 1978) -> Mon Jan 02 1978
 *  getDateOfIsoWeek( 1, 1980) -> Mon Dec 31 1979
 *  getDateOfIsoWeek(53, 2020) -> Mon Dec 28 2020
 *  getDateOfIsoWeek( 1, 2021) -> Mon Jan 04 2021
 *  getDateOfIsoWeek( 0, 2023) -> Invalid (no week 0)
 *  getDateOfIsoWeek(53, 2023) -> Invalid (no week 53 in 2023)
 */
export const getDateFromIsoWeek = (week: number, year: number) => {
  
    if (week < 1 || week > 53) {
        throw new RangeError('ISO 8601 weeks are numbered from 1 to 53')
    }
  
    const simple = new Date(year, 0, 1 + (week - 1) * 7)
    const dayOfWeek = simple.getDay()
    const isoWeekStart = simple

    // Get the Monday past, and add a week if the day was
    // Friday, Saturday or Sunday.
  
    isoWeekStart.setDate(simple.getDate() - dayOfWeek + 1)
    if (dayOfWeek > 4) {
        isoWeekStart.setDate(isoWeekStart.getDate() + 7)
    }

    // The latest possible ISO week starts on December 28 of the current year.
    if (isoWeekStart.getFullYear() > year || (
        isoWeekStart.getFullYear() == year &&
        isoWeekStart.getMonth() == 11 &&
        isoWeekStart.getDate() > 28
    )) {
        throw new RangeError(`${year} has no ISO week ${week}`)
    }
  
    return isoWeekStart
}

/**
 * Convert date to iso week (like 2021-W01) using dayjs
 */
export const getIsoWeekFromDate = (date: Date) => {

    const isoWeek = dayjs(date).isoWeek()
    const year = dayjs(date).isoWeekYear()

    return `${year}-W${isoWeek.toString().padStart(2, '0')}`
}