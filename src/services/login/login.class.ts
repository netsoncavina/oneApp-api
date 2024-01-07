// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'
import type { Login, LoginData, LoginPatch, LoginQuery } from './login.schema'

export type { Login, LoginData, LoginPatch, LoginQuery }

export interface LoginServiceOptions {
  app: Application
}

export interface LoginParams extends Params<LoginQuery> {}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class LoginService<ServiceParams extends LoginParams = LoginParams>
  implements ServiceInterface<Login, LoginData, ServiceParams, LoginPatch>
{
  constructor(public options: LoginServiceOptions) {}

  async find(_params?: ServiceParams): Promise<Login[]> {
    return []
  }

  async get(id: Id, _params?: ServiceParams): Promise<Login> {
    return {
      id: 0,
      email: 'test',
      password: 'test'
    }
  }

  async create(data: LoginData, params?: ServiceParams): Promise<Login>
  async create(data: LoginData[], params?: ServiceParams): Promise<Login[]>
  async create(data: LoginData | LoginData[], params?: ServiceParams): Promise<Login | Login[]> {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)))
    }

    return {
      id: 0,
      ...data
    }
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update(id: NullableId, data: LoginData, _params?: ServiceParams): Promise<Login> {
    return {
      id: 0,
      ...data
    }
  }

  async patch(id: NullableId, data: LoginPatch, _params?: ServiceParams): Promise<Login> {
    return {
      id: 0,
      email: 'test',
      password: 'test',
      ...data
    }
  }

  async remove(id: NullableId, _params?: ServiceParams): Promise<Login> {
    return {
      id: 0,
      email: 'test',
      password: 'test'
    }
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
