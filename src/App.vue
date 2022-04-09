<template>
  <div>
    <router-view />
  </div>
</template>
<style lang="less">
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  html,
  body {
    height: 100%;
  }

  body {
    font-size: 16px;
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 16px;
  }
</style>