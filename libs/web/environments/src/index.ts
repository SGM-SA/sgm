import { environment as devEnvironment } from './environment.dev'
import { environment as prodEnvironment } from './environment.prod'

const isProd = process.env.NODE_ENV === 'production'

export const environment = isProd ? prodEnvironment : devEnvironment