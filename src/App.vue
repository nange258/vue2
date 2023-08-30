<template>
  <div id="app">
    <!-- <nav>
      <router-link to="/Home">Home</router-link> |
      <router-link to="/Login">Login</router-link>
    </nav> -->
    <router-view />
    <!-- <h1>1111</h1> -->
  </div>
</template>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  list-style: none;
  text-decoration: none;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
}
</style>
