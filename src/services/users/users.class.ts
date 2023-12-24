// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Users, UsersData, UsersPatch, UsersQuery } from './users.schema'

export type { Users, UsersData, UsersPatch, UsersQuery }

export interface UsersParams extends KnexAdapterParams<UsersQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class UsersService<ServiceParams extends Params = UsersParams> extends KnexService<
  Users,
  UsersData,
  UsersParams,
  UsersPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mysqlClient'),
    name: 'users'
  }
}
