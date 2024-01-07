// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { LoginService } from './login.class'

// Main data model schema
export const loginSchema = Type.Object(
  {
    id: Type.Number(),
    email: Type.String(),
    password: Type.String()
  },
  { $id: 'Login', additionalProperties: false }
)
export type Login = Static<typeof loginSchema>
export const loginValidator = getValidator(loginSchema, dataValidator)
export const loginResolver = resolve<Login, HookContext<LoginService>>({})

export const loginExternalResolver = resolve<Login, HookContext<LoginService>>({})

// Schema for creating new entries
export const loginDataSchema = Type.Pick(loginSchema, ['email', 'password'], {
  $id: 'LoginData'
})
export type LoginData = Static<typeof loginDataSchema>
export const loginDataValidator = getValidator(loginDataSchema, dataValidator)
export const loginDataResolver = resolve<Login, HookContext<LoginService>>({})

// Schema for updating existing entries
export const loginPatchSchema = Type.Partial(loginSchema, {
  $id: 'LoginPatch'
})
export type LoginPatch = Static<typeof loginPatchSchema>
export const loginPatchValidator = getValidator(loginPatchSchema, dataValidator)
export const loginPatchResolver = resolve<Login, HookContext<LoginService>>({})

// Schema for allowed query properties
export const loginQueryProperties = Type.Pick(loginSchema, ['email', 'password'])
export const loginQuerySchema = Type.Intersect(
  [
    querySyntax(loginQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type LoginQuery = Static<typeof loginQuerySchema>
export const loginQueryValidator = getValidator(loginQuerySchema, queryValidator)
export const loginQueryResolver = resolve<LoginQuery, HookContext<LoginService>>({})
