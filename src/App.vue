<template>
<div id="app">
    <nav id="nav" class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">FreeFolk</a>
        <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link">
                        <router-link to="/">Youtube</router-link>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link">
                        <router-link to="/converter">Converter</router-link>
                    </a>
                </li>
            </ul>
        </div>
    </nav>
    <div class="container">
        <keep-alive>
            <router-view />
        </keep-alive>
    </div>
</div>
</template>

<style>
#nav {
    margin-bottom: 20px;
}
#app {
    font-family: 'Roboto', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
