<script lang="ts">
  import index from './index.svelte'
  import about from './about.svelte'
  import organizationNew from './organizationNew.svelte'
  import userLogin from './userLogin.svelte'
  import notFound from './not-found.svelte'
  import { logout, tokenStore } from './auth'
  import { initUserStore, userStore } from './user'
  import config from './config'
  import getApi from './api'
  import page from 'page'

  let currentPage = null
  let params = {}
  let isLoggedIn: boolean = false
  userStore.subscribe(value => isLoggedIn = value !== null)

  page('/', () => currentPage = index)
  page('/about', () => currentPage = about)
  page('/organization/new', () => currentPage = organizationNew)
  page('/user/login', () => currentPage = userLogin)
  page('*', () => currentPage = notFound)

  page.start()

  initUserStore(getApi(config.apiDomainName, config.apiKey, tokenStore), tokenStore)
</script>

<svelte:head>
    <title>Boo: project management for agile teams</title>
</svelte:head>

<div class="container">
    <nav class="nav">
        <div class="nav-left">
            <a href="/">Home</a>
            <a href="/about">About</a>
            {#if isLoggedIn}
                <a href="/organization/invite">Add a team member</a>
            {:else}
                <a href="/organization/new">Sign up</a>
            {/if}
        </div>
        <div class="nav-right">
            {#if isLoggedIn}
                <a class="button outline" on:click={logout}>Logout</a>
            {:else}
                <a class="button outline" href="/user/login">Login</a>
            {/if}
        </div>
    </nav>
    <svelte:component this={currentPage} {params}/>
</div>
