<template>
    <div class="workbench-cypher-result-table">
        <el-table
            v-if="tableData.length"
            :data="tableData"
            height="100%"
            border
            style="width: 100%"
            header-row-class-name="headerRowClass"
            header-cell-class-name="headerCellClass"
            row-class-name="rowClass"
            cell-class-name="cellClass"
        >
            <el-table-column :prop="item" :label="item" v-for="item in Object.keys(tableData[0])" :key="item" align="center"> </el-table-column>
        </el-table>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import CypherStore from '@/store/cypher/cypher'
@Component
export default class WorkbenchCypherResultTable extends Vue {
    cypherStore: CypherStore = getModule(CypherStore, store)
    @Prop(String) tabValue!: string
    get tableData() {
        let data, cypherReasultData, graphData
        data = this.cypherStore.cypherReasultDatas.find((item) => item.id === this.tabValue)
        data && (cypherReasultData = data.cypherReasultData)
        return (cypherReasultData && cypherReasultData.tableData) || {}
    }
    created() {}
}
</script>
<style lang="less" scoped>
.workbench-cypher-result-table {
    width: 100%;
    height: 100%;
    padding: 10px;
    background: #f5f7fa;
    /deep/.el-table .cell {
        font-family: OpenSans-Bold;
        font-size: 12px;
        color: #44527c;
    }
    /deep/.headerCellClass .cell {
        font-family: OpenSans-Bold;
        font-size: 12px;
        color: #b3b3b3;
    }
    /deep/.rowClass {
        height: 44px;
    }
    /deep/.rowClass:nth-child(even) {
        background: #f8f9fa;
    }
    /deep/.cellClass {
        padding: 0;
        border: none;
    }
    .el-table--enable-row-hover .el-table__body tr:hover > td {
        background: #e3ebfb;
        box-shadow: 0 1px 0 0 #e6e6e6;
    }
}
</style>
