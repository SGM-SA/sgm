import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.locale('fr')
dayjs.extend(relativeTime)

export { dayjs }
