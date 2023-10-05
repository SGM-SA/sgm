import { environment as devEnvironment } from './environment.dev'
import { environment as prodEnvironment } from './environment.prod'
import { environment as stagingEnvironement } from './environment.staging'

export const environment = process.env.NODE_ENV === 'production' ? prodEnvironment : 
                           process.env.NODE_ENV === 'staging'    ? stagingEnvironement : 
                                                                   devEnvironment