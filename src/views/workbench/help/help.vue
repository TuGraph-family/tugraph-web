<template>
    <div class="workbench-help">
        <div class="workbench-help-menu">
            <div class="menuLogo"></div>
            <div class="menuItem" :class="{ itemActive: item.active }" v-for="(item, index) in menuList" :key="index" @click="menuClick(item)">
                <span class="triangle" :class="{ triangleActive: item.active }"></span>
                <span>{{ lang === 'zh' ? item.text_zh : item.text_en }}</span>
            </div>
        </div>
        <div class="workbench-help-context">
            <template v-if="activeMenu === 'TuGraph'">
                <Introduction></Introduction>
            </template>
            <template v-if="activeMenu === 'quickUse'">
                <QuickStart></QuickStart>
            </template>
            <template v-if="activeMenu === 'graphBase'">
                <GraphBase></GraphBase>
            </template>
            <template v-if="activeMenu === 'createLabel'">
                <CreateLabel></CreateLabel>
            </template>
            <template v-if="activeMenu === 'importData'">
                <ImportData></ImportData>
            </template>
            <template v-if="activeMenu === 'cypher'">
                <CypherQuery></CypherQuery>
            </template>
            <template v-if="activeMenu === 'plugin'">
                <plugin></plugin>
            </template>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Introduction from './introduction.vue'
import QuickStart from './quick-start.vue'
import GraphBase from './graph-base.vue'
import CreateLabel from './create-label.vue'
import ImportData from './data-import.vue'
import CypherQuery from './cypher-query.vue'
import Plugin from './plugins.vue'
@Component({
    components: {
        Introduction,
        QuickStart,
        GraphBase,
        CreateLabel,
        ImportData,
        CypherQuery,
        Plugin
    }
})
export default class WorkbenchHelp extends Vue {
    activeMenu: string = 'TuGraph'
    menuList: Array<{ name: string; active: boolean; text_zh: string; text_en: string }> = [
        {
            name: 'TuGraph',
            text_zh: 'TuGraph简介',
            text_en: 'TuGraph Introduction',
            active: true
        },
        {
            name: 'quickUse',
            text_zh: '快速上手',
            text_en: 'TuGraph Quick Start',
            active: false
        },
        {
            name: 'graphBase',
            text_zh: '图基础',
            text_en: 'Graph basis',
            active: false
        },
        {
            name: 'createLabel',
            text_zh: '建模',
            text_en: 'Design Schema',
            active: false
        },
        {
            name: 'importData',
            text_zh: '导入',
            text_en: 'Load Data',
            active: false
        },
        {
            name: 'cypher',
            text_zh: '查询',
            text_en: 'Cypher Query',
            active: false
        },
        {
            name: 'plugin',
            text_zh: '插件',
            text_en: 'Plugin',
            active: false
        }
    ]
    get lang() {
        return this.$store.state.language
    }
    menuClick(item) {
        this.menuList.forEach((i) => {
            i.active = false
        })
        this.activeMenu = item.name
        item.active = true
    }
}
</script>
<style lang="less" scoped>
.workbench-help {
    width: 100%;
    height: 100%;
    display: flex;

    .workbench-help-menu {
        width: 240px;
        height: 100%;
        padding: 0 12px;
        background: #ffffff;
        box-shadow: 1px 0 0 0 #cccccc;
        display: flex;
        flex-direction: column;
        .menuLogo {
            margin: 28px auto;
            width: 96px;
            height: 100px;
            background-image: url('../../../assets/help/logo_ver.svg');
        }
        .triangle {
            width: 0;
            height: 0;
            border-top: 4px solid transparent;
            border-bottom: 4px solid transparent;
            border-left: 5px solid #a9c5ee;
            margin-left: 11px;
            margin-right: 12px;
        }
        .triangleActive {
            border-left: 5px solid #3e8cf6;
        }
        .menuItem {
            width: 100%;
            height: 40px;
            display: flex;
            align-items: center;
            font-family: MicrosoftYaHei;
            font-size: 12px;
            color: #052c57;
            cursor: pointer;
        }
        .menuItem:hover {
            background: #e7eefb;
            border-radius: 4px;
            border-radius: 4px;
        }
        .itemActive {
            background: #e7eefb;
            border-radius: 4px;
            border-radius: 4px;
            font-weight: bold;
        }
    }
    .workbench-help-context {
        width: 100%;
        height: 100%;
        padding-left: 140px;
        padding-right: 140px;
        overflow: auto;
    }
}
</style>
