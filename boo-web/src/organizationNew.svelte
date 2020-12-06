<script type="ts">
  import { eye } from '@primer/octicons'
  import { tokenStore } from './auth'
  import { userStore } from './user'
  import config from './config'
  import getApi from './api'
  import { CognitoIdentityServiceProvider } from 'aws-sdk'
  import page from 'page'

  const api = getApi(config.apiDomainName, config.apiKey, tokenStore)

  const request = {
    organization: '',
    email: '',
    password: '',
  }

  let isComplete = false
  let isProcessing = false
  $: unknownError = request.organization && request.email && request.password && false
  $: usernameAlreadyExists = request.email && false
  $: isValid =
    request.organization !== '' &&
    request.email !== '' &&
    request.password !== '' &&
    document.getElementById('organization').validity.valid &&
    document.getElementById('email').validity.valid &&
    document.getElementById('password').validity.valid

  userStore.subscribe(value => {
    if (value !== null) {
      page('/')
    }
  })

  const toggleShowPassword = () => {
    const password = document.getElementById('password')
    password.setAttribute('type', password.type === 'password' ? 'text' : 'password')
  }

  const submit = async () => {
    isProcessing = true
    const cognito = new CognitoIdentityServiceProvider({ region: config.region })
    try {
      await cognito
        .signUp({
          ClientId: config.cognitoClientId,
          Username: request.email,
          Password: request.password,
          UserAttributes: [
            { Name: 'email', Value: request.email }
          ]
        })
        .promise()

      const user = await cognito
        .initiateAuth({
          AuthFlow: 'USER_PASSWORD_AUTH',
          ClientId: config.cognitoClientId,
          AuthParameters: {
            USERNAME: request.email,
            PASSWORD: request.password
          }
        })
        .promise()

      const accessToken = user?.AuthenticationResult?.AccessToken
      const refreshToken = user?.AuthenticationResult?.RefreshToken
      if (!accessToken || !refreshToken) {
        unknownError = true
        return
      }

      const response = await api.post(
        '/organizations',
        { name: request.organization },
        { Authorization: `Bearer ${accessToken}` }
      )
      if (response.status >= 500) {
        unknownError = true
        return
      }

      // Don't set until after the company is created, because for the rest of the app we assume if an access token
      // exists that it's associated with an organization. If the organization creation caused an error and we have
      // stored an access token already then we may get unexpected results
      tokenStore.set({ accessToken, refreshToken })
      isComplete = true
    } catch (error) {
      if (error.code === 'UsernameExistsException') {
        usernameAlreadyExists = true
      } else {
        unknownError = true
      }
    }
    isProcessing = false
  }
</script>

<h1>Sign up</h1>
<label for="organization">Organization name:</label>
<p><input bind:value={request.organization} type="text" name="organization" id="organization" minlength="1"/></p>
<label for="email">Email:</label>
<p><input bind:value={request.email} type="email" name="email"
          class="{usernameAlreadyExists && !isProcessing ? 'error' : ''}" id="email"/></p>
{#if usernameAlreadyExists && !isProcessing}
    <p class="text-error">This email address is already in use</p>
{/if}
<label for="password">Password:</label>
<p class="grouped">
    <input bind:value={request.password} type="password" name="password" id="password" minlength="8"/>
    <button on:click={toggleShowPassword} class="button icon-only outline">
        {@html eye.toSVG({ "aria-label": "Show password" })}
    </button>
</p>
{#if unknownError && !isProcessing}
    <p class="text-error">An unknown error occurred. Try again later.</p>
{/if}
<button type="submit" disabled={isProcessing || !isValid || isComplete} on:click={submit}>Sign up</button>
