<i18n src="./workbench-menu-lang.json"></i18n>
<template>
    <div class="workbench-menu">
        <section class="workbench-menu-logo">
            <router-link to="/Workbench/Cypher"></router-link>
        </section>
        <section class="workbench-menu-list">
            <div class="workbench-menu-graph-name" :title="selectedSubGraphDesc || selectedSubGraph">{{ $t('text1') }}：{{ selectedSubGraphDesc || selectedSubGraph }}</div>
            <div class="workbench-menu-list-item Cypher" :class="currentRouter.name === 'Cypher' ? 'active' : ''">
                <router-link to="/Workbench/Cypher">{{ $t('text2') }}</router-link>
            </div>
            <div class="workbench-menu-list-item CreateLabel" :class="currentRouter.name === 'CreateLabel' ? 'active' : ''">
                <router-link to="/Workbench/CreateLabel">{{ $t('text3') }}</router-link>
            </div>
            <div class="workbench-menu-list-item ImportData" :class="currentRouter.name === 'ImportData' ? 'active' : ''">
                <router-link to="/Workbench/ImportData">{{ $t('text4') }}</router-link>
            </div>
            <div class="workbench-menu-list-item Plugin" :class="currentRouter.name === 'Plugin' ? 'active' : ''">
                <router-link to="/Workbench/Plugin">{{ $t('text5') }}</router-link>
            </div>
            <div class="workbench-menu-list-item Help" :class="currentRouter.name === 'Help' ? 'active' : ''">
                <router-link to="/Workbench/Help">{{ $t('text6') }}</router-link>
            </div>
        </section>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import SubGraphManageStore from '@/store/subgraph-manage/subgraph-manage'

import router from '@/router'
@Component
export default class WorkbenchMenu extends Vue {
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
    created() {}
}
</script>
<style lang="less" scoped>
.workbench-menu {
    width: 100%;
    height: 100%;
    background: #323457;
    color: #bebfca;
    font-size: 12px;
    .workbench-menu-logo {
        height: 90px;
        background: url('../../../assets/workbench-menu/logo.png') no-repeat center;
        background-size: 150px;
        a {
            display: inline-block;
            width: 100%;
            height: 100%;
        }
    }
    .workbench-menu-graph-name {
        height: 40px;
        line-height: 40px;
        padding-left: 20px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .workbench-menu-list-item {
        margin: 3px 8px;
        a {
            display: inline-block;
            text-decoration: none;
            color: unset;
            width: 100%;
            height: 48px;
            line-height: 48px;
            padding-left: 44px;
        }
        &.active {
            color: #fff;
            font-weight: 700;
            border-radius: 4px;
        }
        &.Cypher {
            background: url('../../../assets/workbench-menu/cypher-normal.svg') no-repeat 15px center;
            &.active {
                background: #4b4d74 url('../../../assets/workbench-menu/cypher-active.svg') no-repeat 15px center;
            }
        }
        &.CreateLabel {
            background: url('../../../assets/workbench-menu/create-label-normal.svg') no-repeat 15px center;
            &.active {
                background: #4b4d74 url('../../../assets/workbench-menu/create-label-active.svg') no-repeat 15px center;
            }
        }
        &.ImportData {
            background: url('../../../assets/workbench-menu/import-data-normal.svg') no-repeat 15px center;
            &.active {
                background: #4b4d74 url('../../../assets/workbench-menu/import-data-active.svg') no-repeat 15px center;
            }
        }
        &.Plugin {
            background: url('../../../assets/workbench-menu/plugin-normal.svg') no-repeat 15px center;
            &.active {
                background: #4b4d74 url('../../../assets/workbench-menu/plugin-active.svg') no-repeat 15px center;
            }
        }
        &.Help {
            background: url('../../../assets/workbench-menu/help-normal.svg') no-repeat 15px center;
            &.active {
                background: #4b4d74 url('../../../assets/workbench-menu/help-active.svg') no-repeat 15px center;
            }
        }
        &:hover {
            background-color: #191c46;
            border-radius: 4px;
        }
    }
}
</style>
