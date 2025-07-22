import { type User } from './user'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $user: User
  }
}

export {}
