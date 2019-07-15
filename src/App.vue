<template>
    <div id="app">
        <!-- <nav id="nav" class="navbar navbar-expand-lg navbar-light bg-light">
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
                <li class="nav-item">
                    <a class="nav-link">
                        <router-link to="/torrent">Torrent</router-link>
                    </a>
                </li>
            </ul>
        </div>
    </nav>
    <div class="container">
        <keep-alive>
            <router-view />
        </keep-alive>
        </div>-->
        <div class="ff-bar">
            <div class="ff-logo">
                <img src="./assets/logo.png" alt="">
            </div>
        </div>
        <keep-alive>
            <router-view/>
        </keep-alive>
    </div>
</template>

<style>
.ff-logo {
    width: 30px;
    height: 30px;
    margin-left: 5px;
    display: flex;
    align-items: center;
}
.ff-logo img {
    height: 20px;
}
.ff-bar {
    background-color: #212121;
    max-height: 30px;
    display: flex;
    align-items: center;
    -webkit-app-region: drag;
}
#nav {
    margin-bottom: 20px;
}
#app {
    font-family: "Roboto", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
body {
    background-color: #303030;
    color: white;
}
</style>
