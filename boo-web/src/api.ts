import { TokenStore } from './auth'

let api: null|Api = null

// singleton this bad boy
export default function getApi (domainName: string, apiKey: string, tokenStore: TokenStore) {
  if (api === null) {
    api = new Api(domainName, apiKey, tokenStore)
  }

  return api
}

export class Api {
  private accessToken: string|undefined
  private refreshToken: string|undefined

  public constructor (
    private readonly domainName: string,
    private readonly apiKey: string,
    private readonly tokenStore: TokenStore
  ) {
    tokenStore.subscribe(value => {
      if (value === null) {
        this.accessToken = undefined
        this.refreshToken = undefined
      } else {
        this.accessToken = value.accessToken
        this.refreshToken = value.refreshToken
      }
    })
  }

  public async post(path: string, data: any, headers: any = {}) {
    const config = this.config
    config['headers'] = {...config['headers'], ...headers}
    return await fetch(`https://${this.domainName}${path}`, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  public async get(path: string, headers: any = {}) {
    const config = this.config
    config['headers'] = {...config['headers'], ...headers}
    return await fetch(`https://${this.domainName}${path}`, {
      ...config,
      method: 'GET',
    })
  }

  private get config (): {/* this fixes a typescript error... fml */} {
    const config = {
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'omit',
      redirect: 'manual',
      referrerPolicy: 'no-referrer',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'X-Source': 'boo-web',
        'X-Api-Key': this.apiKey,
      }
    }

    if (this.accessToken !== undefined) {
      config.headers['Authorization'] = `Bearer ${this.accessToken}`
    }

    return config
  }
}