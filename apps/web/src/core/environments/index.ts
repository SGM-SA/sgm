import { environment as devEnvironment } from './environment.dev'
import { environment as prodEnvironment } from './environment.prod'

const isProd = process.env.NODE_ENV === 'production'
                || import.meta.env.PROD

export const environment = isProd ? prodEnvironment : devEnvironment