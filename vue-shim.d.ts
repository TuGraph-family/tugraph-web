import Vue from 'vue'
import VueRouter from 'vue-router'
import { Route } from 'vue-router'
declare module '*.vue' {
    import Vue from 'vue'
    // eslint-disable-next-line prettier/prettier
    export default Vue
}
// 扩充
declare module 'vue/types/vue' {
    interface Vue {
        $router: VueRouter
        $route: Route
    }
}
