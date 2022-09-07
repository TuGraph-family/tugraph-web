<i18n>
{
    "en":{
        "text1":"Please choose a different label to change the display color, size, and content of the point or edge!",
        "text2":"show",
        "text3":"hide"
    },
    "zh":{
        "text1":"请选择不同的标签，来改变点或边的显示颜色，大小，以及内容!",
        "text2":"显示",
        "text3":"隐藏"
    }
}
</i18n>
<template>
    <div class="workbench-cypher-result-prop" ref="workbenchCypherResultProp">
        <div class="prop-box" ref="propBox">
            <div class="prop-active-label" :type="targetLabel.type" :style="{ background: targetLabel.color }">
                {{ graphData.activeLabel }}
            </div>
            <div>
                <div v-if="targetLabel.type === 'node'" class="color-list">
                    <div>
                        <div class="prop-name">Colors:</div>
                        <el-color-picker v-model="color" size="mini" @change="updateColor" :predefine="predefineColors"></el-color-picker>
                    </div>
                    <div>
                        <div class="prop-name">BorderColors:</div>
                        <el-color-picker v-model="borderColor" size="mini" @change="updateColor" :predefine="predefineBorderColors"></el-color-picker>
                    </div>
                </div>
                <div v-if="targetLabel.type === 'edge'" class="color-list">
                    <div>
                        <div class="prop-name">Colors:</div>
                        <el-color-picker v-model="color" size="mini" @change="updateColor" :predefine="predefineColors"></el-color-picker>
                    </div>
                </div>
            </div>
            <div>
                <div class="prop-name">Size:</div>
                <template v-if="targetLabel.type === 'node'">
                    <el-slider v-model="nodeSize" :max="200" input-size="mini" show-input @change="updateSize"> </el-slider>
                </template>
                <template v-else>
                    <el-slider v-model="edgeSize" :max="50" input-size="mini" show-input @change="updateSize"> </el-slider>
                </template>
            </div>
            <div>
                <div class="prop-name">Properties:</div>
                <div class="propties-list">
                    <div v-if="!targetLabel.props.length" class="prop-field-item null">空</div>
                    <div class="prop-field-item" v-else :class="targetLabel.activeProp === item ? 'active' : ''" v-for="item in targetLabel.props" :key="item" @click="updateActiveProp(item, 'props')">
                        {{ item }}
                    </div>
                </div>
                <div class="prop-name">SystemProperties:</div>
                <div class="sys-propties-list">
                    <div class="prop-field-item" :class="targetLabel.activeProp === item ? 'active' : ''" v-for="item in targetLabel.sysProps" :key="item" @click="updateActiveProp(item, 'sysProps')">
                        {{ item }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { throttle } from '@/core/uitls'
import { getModule } from 'vuex-module-decorators'
import CypherStore from '@/store/cypher/cypher'
import CreateLabelStore from '@/store/create-label/create-label'
import SubGraphManageStore from '@/store/subgraph-manage/subgraph-manage'
@Component
export default class WorkbenchCypherResultProp extends Vue {
    createLabelStore: CreateLabelStore = getModule(CreateLabelStore, store)
    subGraphManageStore: SubGraphManageStore = getModule(SubGraphManageStore, store)
    public $refs!: {
        propBox: HTMLElement
        workbenchCypherResultProp: HTMLElement
    }
    cypherStore: CypherStore = getModule(CypherStore, store)
    towards: string = 'up'
    show: boolean = false
    timer: number = 0
    targetPropBak: string = ''
    targetProp: string = ''
    sign: string = ''
    targetValue: string = ''
    filterList: Array<any> = []
    color: string = ''
    borderColor: string = ''
    nodeSize: number = 60
    edgeSize: number = 1
    predefineColors: Array<string> = []
    predefineBorderColors: Array<string> = []
    @Prop(String) tabValue!: string
    get graphData() {
        let data, cypherReasultData, graphData
        data = this.cypherStore.cypherReasultDatas.find((item) => item.id === this.tabValue)
        data && (cypherReasultData = data.cypherReasultData)
        cypherReasultData && (graphData = cypherReasultData.graphData)
        return graphData
    }

    get targetLabel() {
        this.checkHeight()
        if (this.graphData.activeLabelType) {
            return this.graphData && this.graphData.labels.find((item) => item.name === this.graphData.activeLabel && this.graphData.activeLabelType === item.type)
        }
        return this.graphData && this.graphData.labels.find((item) => item.name === (this.graphData && this.graphData.activeLabel))
    }
    @Watch('graphData', { deep: true })
    onGraphData() {
        this.checkHeight()
    }
    @Watch('targetLabel')
    onChangeTargetLabel() {
        this.color = this.targetLabel.color
        this.borderColor = this.targetLabel.borderColor
        this.nodeSize = this.targetLabel.size
        this.edgeSize = this.targetLabel.size
        this.predefineColors = this.targetLabel.colors.map((item) => {
            if (this.targetLabel.type === 'node') {
                return item[0]
            } else {
                return item
            }
        })
        this.predefineBorderColors = this.targetLabel.colors.map((item) => {
            return item[1]
        })
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
            if (this.$refs['propBox'] && this.$refs['workbenchCypherResultProp']) {
                let labelBoxHeight = this.$refs['propBox'].clientHeight
                let labelBarHeight = this.$refs['workbenchCypherResultProp'].clientHeight
                if (labelBoxHeight - labelBarHeight > 10) {
                    this.show = true
                } else {
                    this.show = false
                }
            }
        }, 300)
    }
    updateColor() {
        this.cypherStore.upDateColor({
            tabValue: this.tabValue,
            color: this.color,
            borderColor: this.borderColor,
            labelName: (this.graphData && this.graphData.activeLabel) || '',
            labelType: this.graphData.activeLabelType
        })
    }
    updateSize(data: number) {
        this.cypherStore.upDateSize({ tabValue: this.tabValue, size: data, labelName: (this.graphData && this.graphData.activeLabel) || '', labelType: this.graphData.activeLabelType })
    }
    updateActiveProp(data: string, source: string) {
        this.cypherStore.upDateActiveProp({
            tabValue: this.tabValue,
            propName: data,
            labelName: (this.graphData && this.graphData.activeLabel) || '',
            propNameSource: source,
            labelType: this.graphData.activeLabelType
        })
    }
    updateLabelShowStatus(value: boolean) {
        this.cypherStore.upDateShow({
            tabValue: this.tabValue,
            labelName: (this.graphData && this.graphData.activeLabel) || '',
            status: value,
            type: (this.targetLabel && this.targetLabel.type) || ''
        })
    }
}
</script>
<style lang="less" scoped>
.workbench-cypher-result-prop {
    width: 100%;
    height: 100%;
    background: #ffffff;
    z-index: 3;
    bottom: 0;
    .prop-box {
        width: 100%;
        padding-left: 10px;
        padding-right: 10px;
        background: #ffffff;
        align-items: center;
        font-size: 12px;
    }
    .prop-name {
        font-weight: 700;
        margin: 10px 10px 10px 0;
    }
    .prop-color-item {
        border-radius: 50%;
        cursor: pointer;
        margin-right: 5px;
        width: 16px;
        height: 16px;
    }
    .color-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        > div {
            display: flex;
            align-items: center;
        }
    }
    .prop-size-item.node {
        background: #f08080;
        border-radius: 50%;
        margin-right: 5px;
        cursor: pointer;
    }
    .prop-size-item.edge {
        background: #aaaaaa;
        margin-right: 5px;
        cursor: pointer;
    }
    .sys-propties-list,
    .propties-list {
        display: flex;
        flex-wrap: wrap;
    }
    .prop-active-label {
        height: 24px;
        width: 100%;
        line-height: 24px;
        border-radius: 12px;
        font-size: 12px;
        color: #fff;
        text-align: center;
        cursor: pointer;
        margin-top: 5px;
        margin-bottom: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &[type='edge'] {
            border-radius: 3px;
        }
    }
    .prop-field-item {
        min-height: 22px;
        max-height: 100px;
        overflow: auto;
        line-height: 22px;
        padding: 0 10px;
        border: 1px solid #b3b3b3;
        color: #999;
        border-radius: 3px;
        cursor: pointer;
        margin-right: 10px;
        margin-top: 5px;
        margin-bottom: 5px;
        max-width: 100%;
        word-break: break-word;
        &.null {
            cursor: unset;
            background: #eeeeee;
        }
    }
    .result-prop-all {
        width: 100%;
        font-size: 14px;
        font-weight: 700;
        line-height: 35px;
        color: #aaaaaa;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding-left: 21px;
    }
    .prop-show-btn {
        position: absolute;
        right: 5px;
        bottom: 8px;
        font-size: 18px;
        cursor: pointer;
        z-index: 4;
    }
    .active {
        box-shadow: 0 0 2px 2px #4481e6;
    }
    /deep/.el-select {
        margin-left: 10px;
        width: 100px;
        input {
            height: 28px;
            line-height: 28px;
        }
        .el-select__caret {
            line-height: 28px;
        }
    }
    .sign {
        width: 80px;
    }
    .expression {
        margin-left: 10px;
        width: 150px;
        /deep/input {
            height: 28px;
            line-height: 28px;
        }
    }
}
</style>
