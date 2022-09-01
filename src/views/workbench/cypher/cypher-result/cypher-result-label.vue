<template>
    <div class="workbench-cypher-result-label" ref="workbenchCypherResultLabel" :class="towards === 'down' && 'hidden'">
        <section class="label-box" ref="labelBox">
            <div
                class="label-item"
                :class="item.name === graphData.activeLabel && item.type === graphData.activeLabelType && 'active'"
                :type="item.type"
                v-for="item in labels"
                :key="item.type + item.name"
                :style="{ background: item.color }"
                @click="updateActiveLabel(item.name, item.type)"
            >
                {{ item.name }} ({{ item.num }})
            </div>
        </section>
        <span class="label-show-btn" v-if="show" :class="towards === 'down' ? 'el-icon-caret-bottom' : 'el-icon-caret-top'" @click="changeTowards"></span>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import CypherStore from '@/store/cypher/cypher'
@Component
export default class WorkbenchCypherResultLabel extends Vue {
    public $refs!: {
        labelBox: HTMLElement
        workbenchCypherResultLabel: HTMLElement
    }
    cypherStore: CypherStore = getModule(CypherStore, store)
    timer: number = 0
    show: boolean = false
    towards: string = 'down'
    @Prop(String) tabValue!: string
    get graphData() {
        let data, cypherReasultData, graphData
        data = this.cypherStore.cypherReasultDatas.find((item) => item.id === this.tabValue)
        data && (cypherReasultData = data.cypherReasultData)
        cypherReasultData && (graphData = cypherReasultData.graphData)
        return graphData
    }
    get labels() {
        return this.graphData && this.graphData.labels
    }
    @Watch('labels')
    onChangeLabels() {
        this.checkHeight()
    }
    get activeLabel() {
        return this.graphData && this.graphData.activeLabel
    }
    @Watch('activeLabel')
    onChangeActiveLabel() {
        this.checkHeight()
    }
    get activeElement() {
        return this.graphData && this.graphData.activeElement
    }
    @Watch('activeElement')
    onChangeActiveElement() {
        this.checkHeight()
    }
    created() {}
    mounted() {
        this.checkHeight()
        window.addEventListener('resize', this.checkHeight)
    }
    checkHeight() {
        if (this.timer) {
            clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
            if (this.$refs['labelBox'] && this.$refs['workbenchCypherResultLabel']) {
                let propBoxHeight = this.$refs['labelBox'].clientHeight
                let propBarHeight = this.$refs['workbenchCypherResultLabel'].clientHeight
                if (propBoxHeight - propBarHeight > 10) {
                    this.show = true
                } else {
                    this.show = false
                }
            }
        }, 300)
    }
    changeTowards() {
        if (this.towards === 'up') {
            this.towards = 'down'
        } else {
            this.towards = 'up'
        }
    }
    updateActiveLabel(data: string, type: string) {
        if (this.graphData.activeLabel === data && type === this.graphData.activeLabelType) {
            this.cypherStore.upDateActiveLabel({ tabValue: this.tabValue, labelName: '', labelType: '' })
        } else {
            this.cypherStore.upDateActiveLabel({ tabValue: this.tabValue, labelName: data, labelType: type })
        }
    }
}
</script>
<style lang="less" scoped>
.workbench-cypher-result-label {
    position: absolute;
    width: 100%;
    height: 34px;
    z-index: 3;
    overflow: unset;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    &.hidden {
        overflow: hidden;
    }
    .label-box {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        display: flex;
        flex-wrap: wrap;
        padding-left: 20px;
        padding-right: 20px;
        background: #ffffff;
    }
    .label-item {
        padding-left: 20px;
        padding-right: 20px;
        height: 24px;
        line-height: 20px;
        border-radius: 12px;
        font-size: 12px;
        color: #fff;
        text-align: center;
        margin-right: 10px;
        cursor: pointer;
        margin-top: 5px;
        margin-bottom: 5px;
        border: 2px solid transparent;
        &.active {
            border: 2px solid #000;
        }
        &[type='edge'] {
            border-radius: 3px;
        }
    }
    .label-show-btn {
        position: absolute;
        right: 5px;
        top: 8px;
        font-size: 18px;
        cursor: pointer;
    }
}
</style>
