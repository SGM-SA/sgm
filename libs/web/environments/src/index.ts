import { environment as devEnvironment } from './environment.dev'
import { environment as prodEnvironment } from './environment.prod'
import { environment as stagingEnvironment } from './environment.staging'
import {EnvironmentConfig} from "./type"

let environment: EnvironmentConfig

switch (process.env.NODE_ENV) {
  case 'production':
    environment = prodEnvironment
    break
  case 'staging':
    environment = stagingEnvironment
    break
  case 'development':
  default:
    environment = devEnvironment
    break
}

export { environment }
