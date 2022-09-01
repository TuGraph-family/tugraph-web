<template>
    <div class="workbench-cypher-result-code">
        <el-tree :data="treeCodeData">
            <span class="span-ellipsis" slot-scope="{ node, data }">
                <span :title="node.label">
                    <span class="key">{{ data.key }}</span>
                    <span>: </span>
                    <span class="value" :class="data.valueType"
                        ><span v-if="data.valueType === 'String'" class="value">"</span><span v-if="data.valueType === 'Function'" class="value Number">f </span>{{ data.value
                        }}<span v-if="data.valueType === 'String'" class="value">"</span>
                    </span>
                </span>
            </span>
        </el-tree>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import CypherStore from '@/store/cypher/cypher'
@Component
export default class WorkbenchCypherResultCode extends Vue {
    cypherStore: CypherStore = getModule(CypherStore, store)
    treeCodeData: Array<any> = []
    @Prop(String) tabValue!: string
    get codeData() {
        let data, cypherReasultData, graphData
        data = this.cypherStore.cypherReasultDatas.find((item) => item.id === this.tabValue)
        data && (cypherReasultData = data.cypherReasultData)
        return (cypherReasultData && cypherReasultData.codeData) || {}
    }
    created() {
        this.createData(this.treeCodeData, this.codeData)
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
<style lang="less" scoped>
.workbench-cypher-result-code {
    width: 100%;
    height: 100%;
    word-break: break-all;
    overflow: auto;
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
}
</style>
