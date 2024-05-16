<template>
    <div class="workbench-cypher-result-table">
        <div class="workbench-cypher-result-table-data" :class="hasPagination && 'page'">
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
                <el-table-column :prop="item" :label="item" v-for="item in Object.keys(tableData[0])" :key="item">
                    <template slot-scope="scope">
                        <pre>{{ tableData[0][item] }}</pre>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div v-if="hasPagination" class="workbench-cypher-result-table-pagination">
            <el-pagination :current-page="currentPage" :page-size="100" layout="prev, pager, next" :total="total" @current-change="currentChange"> </el-pagination>
        </div>
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
    currentPage: number = 1
    get hasPagination(): boolean {
        let data, cypherReasultData
        data = this.cypherStore.cypherReasultDatas.find((item) => item.id === this.tabValue)
        cypherReasultData = data.cypherReasultData
        console.log(cypherReasultData.tableData.length)
        return cypherReasultData.tableData.length > 100 || false
    }
    get total(): number {
        let data, cypherReasultData
        data = this.cypherStore.cypherReasultDatas.find((item) => item.id === this.tabValue)
        cypherReasultData = data.cypherReasultData
        return cypherReasultData.tableData.length
    }
    get tableData() {
        let n: number = this.currentPage
        let data, cypherReasultData, graphData
        data = this.cypherStore.cypherReasultDatas.find((item) => item.id === this.tabValue)
        data && (cypherReasultData = data.cypherReasultData)
        if (cypherReasultData && cypherReasultData.tableData.length < 100) {
            return cypherReasultData.tableData || {}
        } else {
            let data = cypherReasultData.tableData.slice((n - 1) * 100, (n - 1) * 100 + 100)
            return data
        }
    }
    currentChange(data) {
        this.currentPage = data
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
    display: flex;
    flex-direction: column;
    position: relative;
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
    .workbench-cypher-result-table-data {
        height: 100%;
        width: 100%;
        flex-grow: 1;
        flex-shrink: 1;
        &.page {
            height: calc(100% - 30px);
        }
    }
    .workbench-cypher-result-table-pagination {
        height: 50px;
        width: 100%;
        flex-shrink: 0;
        position: relative;
        .el-pagination {
            padding: 2px 0px;
            position: absolute;
            right: 0;
        }
    }
}
</style>
