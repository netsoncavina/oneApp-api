// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  usersDataValidator,
  usersPatchValidator,
  usersQueryValidator,
  usersResolver,
  usersExternalResolver,
  usersDataResolver,
  usersPatchResolver,
  usersQueryResolver
} from './users.schema'

import type { Application } from '../../declarations'
import { UsersService, getOptions } from './users.class'
import { usersPath, usersMethods } from './users.shared'

export * from './users.class'
export * from './users.schema'
import { generate, verify } from 'password-hash'

// A configure function that registers the service and its hooks via `app.configure`
export const users = (app: Application) => {
  // Register our service on the Feathers application
  app.use(usersPath, new UsersService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: usersMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(usersPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(usersExternalResolver), schemaHooks.resolveResult(usersResolver)]
    },
    before: {
      all: [
        schemaHooks.validateQuery(usersQueryValidator),
        schemaHooks.resolveQuery(usersQueryResolver),
        (context) => {
          if (context.data) {
            const currentDate = new Date().toISOString()
            ;(context.data as { createdAt?: string }).createdAt = currentDate
            ;(context.data as { updatedAt?: string }).updatedAt = currentDate
          }
        }
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(usersDataValidator),
        schemaHooks.resolveData(usersDataResolver),

        async (context) => {
          // Check strong password
          const password = (context.data as { password?: string }).password as string
          if (password.length < 8) {
            throw new Error('Password must be at least 8 characters')
          }

          // Check email
          const email = (context.data as { email?: string }).email as string
          if (!email.includes('@')) {
            throw new Error('Email must be valid')
          }

          // Check duplicate email
          const users = await app.service(usersPath).find({ query: { email } })
          if (users.data && users.data.length > 0) {
            throw new Error('Email already exists')
          }

          if (context.data && (context.data as { password?: string })) {
            const hashedPassword = generate((context.data as { password?: string }).password as string)
            ;(context.data as { password?: string }).password = hashedPassword
          }
        }
      ],
      patch: [schemaHooks.validateData(usersPatchValidator), schemaHooks.resolveData(usersPatchResolver)],
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
    [usersPath]: UsersService
  }
}
