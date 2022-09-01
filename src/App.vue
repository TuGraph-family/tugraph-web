<template>
    <div id="app">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive && $route.name === 'Cypher'"></router-view>
        </keep-alive>
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive && $route.name === 'Plugin'"></router-view>
        </keep-alive>

        <!-- 不需要被缓存的路由入口 -->
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
export default class App extends Vue {}
</script>

<style lang="less">
html,
body {
    margin: 0;
    padding: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
* {
    box-sizing: border-box;
}
#app {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>
