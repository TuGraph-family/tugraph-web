<template>
    <div class="plugin-applications">
        <router-view></router-view>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import SubGraphManageStore from '@/store/subgraph-manage/subgraph-manage'

import router from '@/router'

@Component
export default class PluginApplications extends Vue {
    subGraphManageStore: any = getModule(SubGraphManageStore, store)
    menuRouter: any = router
    showChagePwd: boolean = false
    get selectedSubGraph() {
        return this.subGraphManageStore.selectedSubGraph
    }
    get selectedSubGraphDesc() {
        return this.subGraphManageStore.selectedSubGraphDesc
    }
    get currentRouter() {
        return this.menuRouter.currentRoute
    }
    created() {
        // let name = this.currentRouter.name
        // this.$router.push({ path:'Applications/' })
    }
}
</script>
<style lang="less" scoped>
.plugin-applications {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>
