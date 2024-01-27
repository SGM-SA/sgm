import dayjs from 'dayjs'

// locales
import 'dayjs/locale/fr'

// plugins
import relativeTime from 'dayjs/plugin/relativeTime'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekDay from 'dayjs/plugin/weekday'
import isoWeek from 'dayjs/plugin/isoWeek'

dayjs.locale('fr')
dayjs.extend(relativeTime)
dayjs.extend(weekDay)
dayjs.extend(weekOfYear)
dayjs.extend(isoWeek)

export { dayjs }
