<script type="ts">
  import { eye } from '@primer/octicons'
  import { tokenStore } from './auth'
  import { userStore } from './user'
  import config from './config'
  import { CognitoIdentityServiceProvider } from 'aws-sdk'
  import page from 'page'

  const request = {
    email: '',
    password: '',
  }

  userStore.subscribe(value => {
    if (value !== null) {
      page('/')
    }
  })

  let isComplete = false
  let isProcessing = false
  $: unknownError = request.email && request.password && false
  $: notAuthorized = request.email && false
  $: isValid =
    request.email !== '' &&
    request.password !== '' &&
    document.getElementById('email').validity.valid &&
    document.getElementById('password').validity.valid

  const toggleShowPassword = () => {
    const password = document.getElementById('password')
    password.setAttribute('type', password.type === 'password' ? 'text' : 'password')
  }

  const submit = async () => {
    isProcessing = true
    const cognito = new CognitoIdentityServiceProvider({ region: config.region })
    try {
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

      tokenStore.set({ accessToken, refreshToken })
      isComplete = true
    } catch (error) {
      if (error.code === 'NotAuthorizedException') {
        notAuthorized = true
      } else {
        unknownError = true
      }
    }
    isProcessing = false
  }
</script>

<h1>Login</h1>
<label for="email">Email:</label>
<p><input bind:value={request.email} type="email" name="email" id="email" class="{notAuthorized && !isProcessing ? 'error' : ''}" /></p>
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
{#if notAuthorized && !isProcessing}
    <p class="text-error">Invalid username and/or password</p>
{/if}
<button type="submit" disabled={isProcessing || !isValid || isComplete} on:click={submit}>Login</button>
