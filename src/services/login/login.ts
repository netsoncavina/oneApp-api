// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  loginDataValidator,
  loginPatchValidator,
  loginQueryValidator,
  loginResolver,
  loginExternalResolver,
  loginDataResolver,
  loginPatchResolver,
  loginQueryResolver
} from './login.schema'

import type { Application } from '../../declarations'
import { LoginService, getOptions } from './login.class'
import { loginPath, loginMethods } from './login.shared'

export * from './login.class'
export * from './login.schema'

import { generate, verify } from 'password-hash'

// A configure function that registers the service and its hooks via `app.configure`
export const login = (app: Application) => {
  // Register our service on the Feathers application
  app.use(loginPath, new LoginService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: loginMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(loginPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(loginExternalResolver), schemaHooks.resolveResult(loginResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(loginQueryValidator), schemaHooks.resolveQuery(loginQueryResolver)],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(loginDataValidator),
        schemaHooks.resolveData(loginDataResolver),
        async (context) => {
          if (context.data && (context.data as { password?: string })) {
            const user = await app
              .service('users')
              .find({ query: { email: (context.data as { email?: string }).email } })
              .then((res) => res.data[0])

            if (user) {
              const hashedPassword = (user as { password?: string }).password
              if (
                verify((context.data as { password?: string }).password as string, hashedPassword as string)
              ) {
                return context
              } else {
                throw new Error('Wrong password')
              }
            }
          }
        }
      ],
      patch: [schemaHooks.validateData(loginPatchValidator), schemaHooks.resolveData(loginPatchResolver)],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [loginPath]: LoginService
  }
}
