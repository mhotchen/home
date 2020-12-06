import { TokenStore } from './auth'
import { Api } from './api'
import { writable, Writable } from 'svelte/store'

type User = null|{ id: string, email: string, username: string }
export interface UserStore extends Writable<User> {}

export const userStore: UserStore = writable(null)

let api: null|Api = null
let tokenStore: null|TokenStore = null
let accessToken: null|string = null
let refreshToken: null|string = null

export const initUserStore = (apiParam: Api, tokenStoreParam: TokenStore) => {
  api = apiParam
  tokenStore = tokenStoreParam
  tokenStore.subscribe(async value => {
    if (value === null) {
      userStore.set(null)
      accessToken = null
      refreshToken = null
      return
    }

    // Only retrieve the user if the access token/refresh token haven't been set yet
    if (accessToken === null && refreshToken === null) {
      const response = await (await api.get('/users/me')).json()
      userStore.set(response['success'] === true ? response['user'] : null)
    }

    refreshToken = value.refreshToken
    accessToken = value.accessToken
  })
}