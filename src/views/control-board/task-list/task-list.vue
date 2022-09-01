<i18n src="./task-list-lang.json"></i18n>
<template>
    <div class="control-task-list">
        <div class="control-task-header">
            {{ $t('t1') }}
        </div>
        <div class="running-task-body">
            <el-table
                class="taskTable"
                header-row-class-name="headerRowClass"
                header-cell-class-name="headerCellClass"
                row-class-name="rowClass"
                cell-class-name="cellClass"
                :data="taskList.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
            >
                <el-table-column :label="$t('t2')" prop="task_id" align="center"> </el-table-column>
                <el-table-column :label="$t('t3')" prop="time_elapsed" :formatter="formatterTimeElapsed" align="center"> </el-table-column>
                <el-table-column show-overflow-tooltip :label="$t('t4')" prop="description" align="center"> </el-table-column>
                <el-table-column :label="$t('t5')" align="center">
                    <template slot-scope="scope">
                        <el-button class="overButton" @click="missionOver(scope.$index, scope.row)" type="danger" size="small">{{ $t('t6') }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="pagination" layout="prev, pager, next, total, jumper" @current-change="current_change" :total="total" :page-size="pagesize" background> </el-pagination>
        </div>
    </div>
</template>

<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { formatSeconds } from '@/core/uitls.ts'
import { getModule } from 'vuex-module-decorators'
import TaskListStore from '@/store/task-list/task-list'
@Component
export default class TaskList extends Vue {
    taskListStore: TaskListStore = getModule(TaskListStore, store)
    pagesize: number = 10 // 每页的数据条数
    currentPage: number = 1 // 默认开始页面
    get taskList() {
        return this.taskListStore.taskList
    }
    get total() {
        return this.taskList.length
    }
    created() {
        this.taskListStore.getTaskList()
    }
    current_change(currentPage) {
        this.currentPage = currentPage
    }
    formatterTimeElapsed(row, column, cellValue) {
        return cellValue + 's'
    }
    async missionOver(index, row) {
        var self = this
        let res = await this.taskListStore.killTask({ taskId: row.task_id })
        if (res.status === 'success') {
            this.$message({
                message: '结束任务请求发送成功',
                type: 'success'
            })
            this.taskListStore.getTaskList()
        } else {
            this.$message({
                message: '结束任务请求发送失败',
                type: 'error'
            })
        }
    }
}
</script>

<style lang="less" scoped>
.control-task-list {
    width: 100%;
    height: 100%;
    .control-task-header {
        background: #ffffff;
        box-shadow: 0 1px 0 0 #dedfdf;
        width: 100%;
        height: 60px;
        font-family: OpenSans;
        font-size: 24px;
        color: #44527c;
        line-height: 60px;
        padding-left: 25px;
        position: relative;
        z-index: 2;
    }

    // .running-task-body {
    //     width: 100%;
    //     height: calc(100% - 60px);
    //     background: #e6eaf2;
    //     box-sizing: border-box;
    //     overflow: auto;
    //     .el-table {
    //         font-family: PingFangSC-Regular;
    //         font-size: 12px;
    //         color: #44527c;
    //         text-align: center;
    //         thead th {
    //             padding: 0;
    //             height: 32px;
    //             line-height: 32px;
    //             .cell {
    //                 border-right: 1px solid #e6e6e6;
    //             }
    //             font-size: 12px;
    //             color: #666666;
    //         }
    //         .cell {
    //             // max-height: 100px;
    //         }
    //     }
    // }
}
</style>
