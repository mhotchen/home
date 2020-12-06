import { writable, Writable } from 'svelte/store'

type AuthToken = null|{ accessToken: string, refreshToken: string }
export interface TokenStore extends Writable<AuthToken> {}

export const tokenStore: TokenStore = writable(null)

tokenStore.subscribe(value => {
  if (value !== null) {
    document.cookie = `auth=${JSON.stringify(value)};max-age=${3650 * 24 * 3600};path=/;samesite=strict`
  }
})

export const initAuthStore = () => {
  const auth = document.cookie.split('; ').find(cookie => cookie.split('=')[0] === 'auth')
  if (auth !== undefined) {
    tokenStore.set(JSON.parse(auth.replace('auth=', '')))
  }
}

export const logout = () => {
  document.cookie = 'auth=null;path=/;samesite=strict'
  tokenStore.set(null)
}