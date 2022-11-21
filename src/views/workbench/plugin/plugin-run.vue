<i18n src="./plugin-lang.json"></i18n>
<template>
    <div class="plugin-run">
        <div class="plugin-run-top">
            <div class="plugin-description">
                <div class="plugin-name">{{ pluginData.name }}</div>
                <div class="title">
                    <span>{{ $t('text4') }}：</span><span>{{ pluginData.code_type }}</span>
                </div>
                <div class="title">
                    <span>{{ $t('text6') }}：</span>{{ pluginData.read_only ? $tc('text8', 1) : $tc('text8', 2) }}
                </div>
                <div class="title">
                    <span>{{ $t('text5') }}：</span>
                    <el-input type="textarea" :value="pluginData.description" :readonly="true"> </el-input>
                </div>
            </div>
            <div class="plugin-input">
                <div class="title">
                    <span>{{ $t('text12') }}</span>
                    <span class="timeout-input-box">{{ $t('text20') }}：<el-input v-model.number="timeout" class="timeout-input" size="mini"></el-input></span>
                </div>
                <el-input type="textarea" v-model="inputData"> </el-input>
                <div class="btn-group">
                    <el-button type="primary" plain size="small" @click="pluginRun">{{ $t('text13') }}</el-button>
                    <el-button type="primary" plain size="small" v-if="pluginData.code_type !== 'zip'" @click="drawer = true">{{ $t('text14') }}</el-button>
                    <el-button type="primary" plain size="small" @click="downLoadRun">{{ $t('text15') }}</el-button>
                    <el-button type="warning" plain size="small" @click="deletePlugin">{{ $t('text16') }}</el-button>
                </div>
            </div>
        </div>
        <div class="plugin-run-bottom">
            <div class="title">{{ $t('text21') }}：</div>
            <div class="plugin-output">
                <el-tree :data="treeCodeData" v-if="treeCodeData.length">
                    <span class="span-ellipsis" slot-scope="{ node, data }">
                        <span :title="node.label">
                            <span class="key">{{ data.key }}</span>
                            <span>: </span>
                            <el-tooltip class="item" effect="dark" :content="data.value + ''" placement="top">
                                <span class="value" :class="data.valueType">
                                    <span v-if="data.valueType === 'String'" class="value">"</span><span v-if="data.valueType === 'Function'" class="value Number">f </span>
                                    <span>{{ data.value }}</span>
                                    <span v-if="data.valueType === 'String'" class="value">"</span>
                                </span>
                            </el-tooltip>
                        </span>
                    </span>
                </el-tree>
            </div>
        </div>
        <el-drawer size="40%" custom-class="plugin-code-box" :append-to-body="true" :visible.sync="drawer" :with-header="false">
            <PluginCode :code="pluginData.code_base64"></PluginCode>
        </el-drawer>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import SubGraphManageStore from '@/store/subgraph-manage/subgraph-manage'
import PluginStore from '@/store/plugin/plugin'
import PluginCode from './plugin-code.vue'
interface Data {
    [p: string]: any
}
@Component({
    components: {
        PluginCode
    }
})
export default class PluginRun extends Vue {
    @Prop(Object) pluginTab!: Data
    subGraphManageStore: SubGraphManageStore = getModule(SubGraphManageStore, store)
    pluginStore: PluginStore = getModule(PluginStore, store)
    inputData: string = ''
    timeout: number = 300
    treeCodeData: Array<any> = []
    drawer: boolean = false
    pluginData: {
        name: string
        description: string
        code_base64: string
        read_only: boolean
        code_type: string
    } = {
        name: '',
        description: '',
        code_base64: '',
        read_only: false,
        code_type: ''
    }
    get graphName() {
        return this.subGraphManageStore.selectedSubGraph
    }
    created() {
        this.initData()
    }
    async initData() {
        let res: any = null
        if (this.pluginTab.type === 'Python') {
            res = await this.pluginStore.getPyPluginDetail({ name: this.pluginTab.name, graph: this.graphName })
        } else {
            res = await this.pluginStore.getCppPluginDetail({ name: this.pluginTab.name, graph: this.graphName })
        }
        if (res.status === 200) {
            let data = res.data
            this.pluginData.name = data.name
            this.pluginData.description = data.description
            this.pluginData.code_base64 = data.code_base64
            this.pluginData.read_only = data.read_only
            this.pluginData.code_type = data.code_type
        }
    }
    async pluginRun() {
        let res: any = {}
        if (this.pluginTab.type === 'Python') {
            res = await this.pluginStore.excutePythonPlugin({ graph: this.graphName, name: this.pluginData.name, data: { data: this.inputData, timeout: this.timeout, in_process: false } })
        } else {
            res = await this.pluginStore.excuteCppPlugin({ graph: this.graphName, name: this.pluginData.name, data: { data: this.inputData, timeout: this.timeout, in_process: false } })
        }
        this.treeCodeData = []
        this.createData(this.treeCodeData, res)
    }
    downLoadRun() {
        const fileName = `${this.pluginData.name}.${this.pluginData.code_type}`
        let myBlob
        if (this.pluginData.code_type === 'zip') {
            myBlob = this.base64toBlob(this.pluginData.code_base64, 'application/zip')
        } else {
            myBlob = new Blob([atob(this.pluginData.code_base64)], {
                type: 'text/plain'
            })
        }
        const link = document.createElement('a')
        link.href = URL.createObjectURL(myBlob)
        link.download = fileName
        link.click()
        link.remove()
        URL.revokeObjectURL(link.href)
    }
    base64toBlob(base64: string, type: string) {
        // 将base64转为Unicode规则编码
        var bstr = atob(base64)
        var n = bstr.length
        var u8arr = new Uint8Array(n)
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n) // 转换编码后才可以使用charCodeAt 找到Unicode编码
        }
        return new Blob([u8arr], {
            type
        })
    }
    deletePlugin() {
        this.$confirm('此操作将永久删除该插件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
            .then(async () => {
                let res: any = {}
                if (this.pluginData.code_type === 'py') {
                    res = await this.pluginStore.deletePythonPlugin({ graph: this.graphName, name: this.pluginData.name })
                } else {
                    res = await this.pluginStore.deleteCppPlugin({ graph: this.graphName, name: this.pluginData.name })
                }
                if (res.status === 200) {
                    this.$emit('deletePlugin', { targetName: this.pluginTab.key })
                    this.$message({
                        message: '删除插件成功',
                        type: 'success'
                    })
                } else {
                    this.$message({
                        message: '删除插件失败',
                        type: 'error'
                    })
                }
            })
            .catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
    }
    createData(children: any[], data: any) {
        if (data !== null) {
            let typeName = data.constructor.name
            if (typeName === 'Object') {
                Object.keys(data).forEach((item) => {
                    let typeName = data[item].constructor.name
                    if (typeName === 'Object' || typeName === 'Array') {
                        let newChild: any[] = []
                        let obj = {
                            label: item,
                            key: item,
                            value: typeName === 'Object' ? 'Object' : `Array[${data[item].length}]`,
                            valueType: typeName,
                            children: newChild
                        }
                        this.createData(newChild, data[item])
                        children.push(obj)
                    } else if (typeName === 'Function') {
                        let value = data[item]
                            .toString()
                            .replace('function ', '')
                            .replace(/\{[\s\S]*\}/g, '')
                        let obj = {
                            label: item + ': ' + '',
                            key: item,
                            valueType: 'Function',
                            value: value
                        }
                        children.push(obj)
                    } else if (typeName === 'XMLHttpRequest') {
                        let obj = {
                            label: item + ': ' + 'XMLHttpRequest',
                            key: item,
                            valueType: 'XMLHttpRequest',
                            value: 'XMLHttpRequest'
                        }
                        children.push(obj)
                    } else {
                        let obj = {
                            label: item + ': ' + data[item],
                            key: item,
                            valueType: typeName,
                            value: data[item]
                        }
                        children.push(obj)
                    }
                })
            } else if (typeName === 'Array') {
                data.forEach((item: any, index: number) => {
                    if (item !== null) {
                        let typeName = item.constructor.name
                        if (typeName === 'Object' || typeName === 'Array') {
                            let newChild: any[] = []
                            let obj = {
                                label: index + ': ' + 'Object',
                                key: index,
                                value: 'Object',
                                valueType: typeName,
                                children: newChild
                            }
                            typeName === 'Array' && (obj.value = `Array[${item.length}]`)
                            this.createData(newChild, item)
                            children.push(obj)
                        } else if (typeName === 'Function') {
                            let value = item
                                .toString()
                                .replace('function ', '')
                                .replace(/\{[\s\S]*\}/g, '')
                            let obj = {
                                label: index + ': ' + '',
                                key: index,
                                valueType: 'Function',
                                value: value
                            }
                            children.push(obj)
                        } else if (typeName === 'XMLHttpRequest') {
                            let obj = {
                                label: index + ': ' + 'XMLHttpRequest',
                                key: index,
                                valueType: 'XMLHttpRequest',
                                value: 'XMLHttpRequest'
                            }
                        } else {
                            let obj = {
                                label: index,
                                key: index,
                                valueType: typeName,
                                value: item
                            }
                            children.push(obj)
                        }
                    }
                })
            }
        }
    }
}
</script>
<style lang="less" scope>
.plugin-run {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .plugin-run-top {
        height: 35%;
        display: flex;
        min-height: 400px;
        .plugin-description {
            width: 50%;
            height: 95%;
            font-size: 14px;
            padding-left: 50px;
            padding-right: 30px;
            border-right: 1px dashed #cccccc;
            background: url('../../../assets/plugin/title.svg') no-repeat 10px -3px;
            textarea {
                margin-top: 5px;
                resize: none;
                height: 200px;
                max-height: 200px;
                border-color: transparent;
                &:focus {
                    border-color: transparent;
                }
                &:hover {
                    border-color: transparent;
                }
            }
        }
        .plugin-input {
            width: 50%;
            padding-left: 30px;
            height: 95%;
            position: relative;
            textarea {
                resize: none;
                height: 260px;
                max-height: 260px;
            }
            .el-button {
                width: 120px;
            }
            .btn-group {
                display: flex;
                justify-content: space-between;
                position: absolute;
                bottom: 10px;
                right: 0;
            }
        }
    }
    .plugin-run-bottom {
        height: 65%;
        // flex-shrink: 1;
        border: 1px solid #cccccc;
        border-radius: 5px;
        padding: 10px;
        overflow: auto;
    }
    .plugin-name {
        font-size: 24px;
        font-family: PingFangSC-Regular;
        color: #44527c;
        word-break: break-all;
        margin-bottom: 14px;
    }
    .title {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #44527c;
        word-break: break-all;
        margin-bottom: 14px;
    }

    .timeout-input-box {
        float: right;
        margin-top: -5px;
    }
    .timeout-input {
        width: 80px;
    }
    .el-tree {
        width: 100%;
        font-size: 14px;
        span.key {
            color: #881391;
        }
        span.value {
            color: #444;
        }
        span.value.Number,
        span.value.Boolean {
            color: #03c;
        }
        span.value.XMLHttpRequest,
        span.value.String {
            color: #c41a16;
        }
        span.value.Function {
            font-style: italic;
        }
        .span-ellipsis {
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
    .plugin-code-box {
        height: 100%;
        max-height: 100%;
        width: 600px;
        overflow: hidden;
    }
}
</style>
