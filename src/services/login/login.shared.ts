// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Login, LoginData, LoginPatch, LoginQuery, LoginService } from './login.class'

export type { Login, LoginData, LoginPatch, LoginQuery }

export type LoginClientService = Pick<LoginService<Params<LoginQuery>>, (typeof loginMethods)[number]>

export const loginPath = 'login'

export const loginMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const loginClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(loginPath, connection.service(loginPath), {
    methods: loginMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [loginPath]: LoginClientService
  }
}
