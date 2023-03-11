<i18n src="./create-label-lang.json">
</i18n>

<template>
    <div class="workbench-create-label">
        <section class="workbench-create-label-loading" v-if="loading">
            <Loading></Loading>
        </section>
        <section class="workbench-create-label-body">
            <div class="label-list" @click="setActiveLabel({})">
                <div class="workbench-create-label-title"></div>
                <el-tabs type="border-card" :stretch="true" :activeName="activeName">
                    <el-tab-pane :label="$t('text1')" name="node">
                        <div class="label-container">
                            <el-tag
                                :type="activeLabel.value === item.name && activeLabel.type === 'node' ? '' : 'info'"
                                v-for="item in vertexLabels"
                                :key="item.name"
                                @click.stop="setActiveLabel(item.name, 'node')"
                            >
                                {{ item.name }}
                            </el-tag>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane :label="$t('text2')" name="edge">
                        <div class="label-container">
                            <el-tag
                                :type="activeLabel.value === item.name && activeLabel.type === 'edge' ? '' : 'info'"
                                v-for="item in edgeLabels"
                                :key="item.name"
                                @click.stop="setActiveLabel(item.name, 'edge')"
                                >{{ item.name }} {{ item.constraints && item.constraints.length === 0 ? '[无约束]' : '' }}</el-tag
                            >
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="label-canvas">
                <div class="label-canvas-top">
                    <el-button class="add-vertex-label" icon="el-icon-plus" size="mini" @click="showModal('vertex')">{{ $t('text1') }}</el-button>
                    <el-button class="add-edge-label" icon="el-icon-plus" size="mini" @click="showModal('edge')">{{ $t('text2') }}</el-button>
                    <el-button icon="el-icon-download" @click="exportLabels" size="mini" :disabled="vertexLabels.length < 1">导出模型</el-button>
                    <el-upload action="localhost" multiple :auto-upload="false" :on-change="uploadChange" :show-file-list="false">
                        <el-button icon="el-icon-upload2" size="mini">导入模型</el-button>
                    </el-upload>
                </div>
                <div class="label-canvas-container">
                    <labelGraph :activeLabel.sync="activeLabel"></labelGraph>
                    <div class="label-detail" v-if="labelDetail">
                        <div class="workbench-create-label-name">
                            {{ $t('text3') }}：{{ labelDetail.name }}
                            <div>
                                <el-button size="mini" icon="el-icon-plus" @click="addLabelProp(labelDetail, activeName === 'node' ? 'vertex' : 'edge')">
                                    {{ $t('text4') }}
                                </el-button>
                                <el-button size="mini" icon="el-icon-delete" @click="deleteLabel(labelDetail, activeName === 'node' ? 'vertex' : 'edge')">
                                    {{ $t('text5') }}
                                </el-button>
                            </div>
                        </div>
                        <el-table
                            :data="labelDetail.tableData"
                            border
                            height="calc(100% - 40px)"
                            header-row-class-name="headerRowClass"
                            header-cell-class-name="headerCellClass"
                            row-class-name="rowClass"
                            cell-class-name="cellClass"
                        >
                            <el-table-column prop="name" :label="$t('text6')" align="center">
                                <template slot-scope="scope">
                                    <div v-if="!scope.row.isNew">{{ scope.row.isPK ? '(主键)' : '' }} {{ scope.row.name }}</div>
                                    <div v-else>
                                        <el-input size="mini" v-model="scope.row.name"></el-input>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="type" :label="$t('text7')" align="center">
                                <template slot-scope="scope">
                                    <el-select filter size="mini" v-model="scope.row.type" :disabled="!scope.row.isEdit">
                                        <el-option v-for="item in typeOptions" :key="item" :label="item" :value="item"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="optional" :label="$t('text8')" align="center">
                                <template slot-scope="scope">
                                    <el-select size="mini" v-model="scope.row.optional" :disabled="!scope.row.isEdit" @change="updateIsOptional(scope.row, 'vertex')" placeholder="是否选填">
                                        <el-option :label="$tc('text13', 2)" :value="false"></el-option>
                                        <el-option :label="$tc('text13', 1)" :value="true"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="isIndex" :label="$t('text9')" align="center">
                                <template slot-scope="scope">
                                    <el-select
                                        size="mini"
                                        v-model="scope.row.isIndex"
                                        :disabled="!scope.row.isEdit ? true : scope.row.optional"
                                        @change="updateIsIndex(scope.row)"
                                        placeholder="是否索引"
                                    >
                                        <el-option :label="$tc('text13', 2)" :value="false"></el-option>
                                        <el-option :label="$tc('text13', 1)" :value="true"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="isUnique" :label="$t('text10')" align="center">
                                <template slot-scope="scope">
                                    <el-select size="mini" v-model="scope.row.isUnique" :disabled="!scope.row.isEdit ? true : !scope.row.isIndex" placeholder="是否唯一">
                                        <el-option :label="$tc('text13', 2)" :value="false"></el-option>
                                        <el-option :label="$tc('text13', 1)" :value="true"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('text11')" align="center" width="150">
                                <template slot-scope="scope">
                                    <div v-if="!scope.row.isEdit">
                                        <el-button size="mini" :disabled="scope.row.isPK" @click="editRowProp(scope.row, labelDetail, activeName === 'node' ? 'vertex' : 'edge')">{{
                                            $tc('text12', 1)
                                        }}</el-button>
                                        <el-button size="mini" :disabled="scope.row.isPK" @click="delRowProp(scope.row, labelDetail, activeName === 'node' ? 'vertex' : 'edge')">{{
                                            $tc('text12', 2)
                                        }}</el-button>
                                    </div>
                                    <div v-if="scope.row.isEdit">
                                        <el-button size="mini" @click="saveRowProp(scope.row, labelDetail, activeName === 'node' ? 'vertex' : 'edge')">{{ $tc('text14', 1) }}</el-button>
                                        <el-button size="mini" @click="cancelRowProp(scope.row, labelDetail, activeName === 'node' ? 'vertex' : 'edge')">{{ $tc('text14', 2) }}</el-button>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </section>
        <section class="workbench-create-label-modal" v-if="dialogVisible">
            <el-dialog
                custom-class="elDialog"
                :title="labelType === 'vertex' ? $t('dialog.text1') : $t('dialog.text2')"
                :visible.sync="dialogVisible"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :before-close="closeModel"
            >
                <el-form ref="form" :model="form">
                    <el-form-item class="labelName" :label="$t('dialog.text3')" prop="name" :label-width="formLabelWidth">
                        <el-input v-model="form.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item v-if="labelType === 'edge'" class="labelConstraints" :label="$t('dialog.text13')" :label-width="formLabelWidth">
                        <span @click="addConstraintsRow" class="addSpan">{{ $t('dialog.text5') }}</span>
                    </el-form-item>
                    <el-form-item v-if="labelType === 'edge'" props="constraints" :label-width="formLabelWidth">
                        <div class="edge-constraints-box">
                            <el-table
                                height="150"
                                header-row-class-name="headerRowClass"
                                header-cell-class-name="headerCellClass"
                                row-class-name="rowClass"
                                cell-class-name="cellClass"
                                :data="form.constraints"
                            >
                                <el-table-column :label="$t('dialog.text14')" prop="src" align="center">
                                    <template slot-scope="scope">
                                        <el-select filterable class="elSelect" v-model="scope.row.src">
                                            <el-option v-for="item in vertexLabels" :key="item.name" :label="item.name" :value="item.name"></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="$t('dialog.text15')" prop="dst" align="center">
                                    <template slot-scope="scope">
                                        <el-select filterable class="elSelect" v-model="scope.row.dst">
                                            <el-option v-for="item in vertexLabels" :key="item.name" :label="item.name" :value="item.name"></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="$t('dialog.text9')" align="center">
                                    <template slot-scope="scope">
                                        <div class="deleteButton" @click="deleteConstraintsRow(scope.$index, scope.row)">
                                            <i class="el-icon-delete"></i>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-form-item>
                    <el-form-item class="labelImg" :label="$t('dialog.text4')" :label-width="formLabelWidth">
                        <span @click="addRow" class="addSpan">{{ $t('dialog.text5') }}</span>
                    </el-form-item>

                    <el-form-item prop="fields" :label-width="formLabelWidth">
                        <div class="tableContainner">
                            <el-table
                                height="279"
                                header-row-class-name="headerRowClass"
                                header-cell-class-name="headerCellClass"
                                row-class-name="rowClass"
                                cell-class-name="cellClass"
                                :data="form.fields"
                            >
                                <el-table-column :label="$t('dialog.text3')" prop="name" align="center" width="200">
                                    <template slot-scope="scope">
                                        <el-input class="rowCol" v-model="scope.row.name"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="$t('dialog.text11')" prop="type" align="center" width="200">
                                    <template slot-scope="scope">
                                        <el-select class="elSelect" v-model="scope.row.type">
                                            <el-option v-for="item in typeOptions" :key="item" :label="item" :value="item"></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="$t('dialog.text6')" prop="optional" align="center">
                                    <template slot-scope="scope">
                                        <el-select class="elSelect2" v-model="scope.row.optional" @change="updateIsOptional(scope.row)" placeholder="是否选填">
                                            <el-option :label="$tc('text13', 2)" :value="false"></el-option>
                                            <el-option :label="$tc('text13', 1)" :value="true"></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column v-if="labelType === 'vertex'" :label="$t('dialog.text7')" prop="isIndex" align="center">
                                    <template slot-scope="scope">
                                        <el-select class="elSelect2" v-model="scope.row.isIndex" :disabled="scope.row.optional" @change="updateIsIndex(scope.row)" placeholder="是否索引">
                                            <el-option :label="$tc('text13', 2)" :value="false"></el-option>
                                            <el-option :label="$tc('text13', 1)" :value="true"></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column v-if="labelType === 'vertex'" :label="$t('dialog.text8')" prop="isIndex" align="center">
                                    <template slot-scope="scope">
                                        <el-select class="elSelect2" v-model="scope.row.isUnique" :disabled="!scope.row.isIndex" :placeholder="$t('dialog.text8')">
                                            <el-option :label="$tc('text13', 2)" :value="false"></el-option>
                                            <el-option :label="$tc('text13', 1)" :value="true"></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="$t('dialog.text9')" align="center">
                                    <template slot-scope="scope">
                                        <div class="deleteButton" @click="deleteRow(scope.$index, scope.row)">
                                            <i class="el-icon-delete"></i>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-form-item>
                    <el-form-item v-if="labelType === 'vertex'" class="labelName" :label="$t('dialog.text12')" prop="name" :label-width="formLabelWidth">
                        <el-select v-model="form.pk" size="mini" class="pk-select" @change="changePK">
                            <template v-for="(item, index) in form.fields || []">
                                <el-option v-if="item.name" :key="item.name + index" :value="item.name" :label="item.name"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <a class="createLabel" @click="createLabel()">{{ $tc('dialog.text10', 1) }}</a>
                    <a class="cancelLabel" @click="cancelLabel()">{{ $tc('dialog.text10', 2) }}</a>
                </div>
            </el-dialog>
        </section>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import { downloadFile } from '@/core/uitls'
import CreateLabelStore from '@/store/create-label/create-label'
import SubGraphManageStore from '@/store/subgraph-manage/subgraph-manage'
import Loading from '@/components/loading/loading.vue'
import labelGraph from './label-graph/label-graph.vue'
@Component({
    components: { Loading, labelGraph }
})
export default class WorkbenchCreateLabel extends Vue {
    public $refs!: {
        workbenchCreateLabelCanvas: HTMLDivElement
    }
    loading: boolean = false
    activeLabel: { type: string; value: string } = {
        type: '',
        value: ''
    }
    @Watch('activeLabel')
    onChangeActiveLabel() {
        this.activeName = this.activeLabel.type || 'node'
    }
    activeName: string = 'node'
    searchValue: string = ''
    subGraphManageStore: SubGraphManageStore = getModule(SubGraphManageStore, store)
    createLabelStore: CreateLabelStore = getModule(CreateLabelStore, store)
    vertexOptionData: any = null
    edgeOptionData: any = null
    vertexLabels: any = []
    edgeLabels: any = []
    form: { [p: string]: any } = {
        name: '',
        fields: [],
        constraints: [],
        is_vertex: '',
        pk: ''
    }
    typeOptions: Array<string> = ['INT8', 'INT16', 'INT32', 'INT64', 'FLOAT', 'DOUBLE', 'STRING', 'DATE', 'DATETIME', 'BLOB', 'BOOL']

    get labelDetail() {
        let target: any = null
        if (this.activeLabel.type === 'node') {
            target = this.vertexLabels.find((item) => item.name === this.activeLabel.value)
        }
        if (this.activeLabel.type === 'edge') {
            target = this.edgeLabels.find((item) => item.name === this.activeLabel.value)
        }
        return target
    }
    // activeNames: any = []
    formLabelWidth: string = '100'
    labelType: string = ''
    dialogVisible: boolean = false

    get currentSelectedGraph() {
        return this.subGraphManageStore.selectedSubGraph
    }
    @Watch('currentSelectedGraph')
    async onChangeCreateLabelStore() {
        this.loading = true
    }
    get allLabels() {
        let target = this.createLabelStore.allLabel.find((item) => item.graph == this.currentSelectedGraph)
        return target ? target.allLabel : []
    }
    @Watch('allLabels', { deep: true })
    onChangeAllLabels() {
        this.loading = false
        this.draw()
    }
    created() {
        this.currentSelectedGraph &&
            this.createLabelStore.getAllLabel({
                graph: this.currentSelectedGraph
            })
    }
    mounted() {}
    draw() {
        let allLabel = JSON.parse(JSON.stringify(this.allLabels))
        allLabel.forEach((item) => {
            var tableData: any = []
            Object.keys(item.props).forEach((k) => {
                var obj: any = {}
                obj.isNew = false
                obj['name'] = k
                obj['isIndex'] = item.props[k].isIndex
                obj['isIndexBak'] = item.props[k].isIndex
                obj['isUnique'] = item.props[k].isUnique
                obj['isUniqueBak'] = item.props[k].isUnique
                obj['optional'] = item.props[k].optional
                obj['optionalBak'] = item.props[k].optional
                obj['type'] = item.props[k].type
                obj['typeBak'] = item.props[k].type
                obj['isEdit'] = false
                obj['isPK'] = item.primary === k ? true : false
                tableData.push(obj)
            })
            item.tableData = tableData
        })
        let vertexLabels = allLabel.filter((item) => item.type === 'node')
        let edgeLabels = allLabel.filter((item) => item.type === 'edge')
        this.vertexLabels = vertexLabels
        this.edgeLabels = edgeLabels
    }
    editRowProp(row: any, item: any, type: string) {
        row.isEdit = !row.isEdit
    }
    delRowProp(row: any, item: any, type: string) {
        this.$confirm(this.$t('message.text12', [item.name, row.name]) as string, this.$t('message.text1') as string, {
            confirmButtonText: this.$tc('message.text2', 1) as string,
            cancelButtonText: this.$tc('message.text2', 2) as string,
            type: 'warning'
        })
            .then(async () => {
                let res: any = await this.createLabelStore.deleteFieldsFromLabel({ graph: this.currentSelectedGraph, labelType: type, labelName: item.name, prop: row.name })
                if (res.msg === 'success') {
                    this.$message({
                        message: this.$tc('message.text3', 1) as string,
                        type: 'success'
                    })
                    let index = item.tableData.indexOf(row)
                    item.tableData.splice(index, 1)
                } else {
                    this.$message({
                        message: res.text || (this.$tc('message.text3', 2) as string),
                        type: 'error'
                    })
                }
            })
            .catch(() => {
                this.$message({
                    type: 'info',
                    message: this.$t('message.text6') as string
                })
            })
    }
    saveRowProp(row: any, item: any, type: string) {
        interface labelData {
            optional: boolean
            isIndex: boolean
            isUnique: boolean
            type: string
        }
        let labelNewProp: labelData = {
            optional: row.optional,
            isIndex: row.isIndex,
            isUnique: row.isUnique,
            type: row.type
        }
        let labelOldProp: labelData = {
            optional: row.optionalBak,
            isIndex: row.isIndexBak,
            isUnique: row.isUniqueBak,
            type: row.typeBak
        }

        this.$confirm(this.$t('message.text8', [item.name, row.name]) as string, this.$t('message.text1') as string, {
            confirmButtonText: this.$tc('message.text2', 1),
            cancelButtonText: this.$tc('message.text2', 2),
            type: 'warning'
        })
            .then(async () => {
                let res: any = await this.createLabelStore.alterFieldsFromLabel({
                    graph: this.currentSelectedGraph,
                    labelType: type,
                    labelName: item.name,
                    labelPropName: row.name,
                    labelNewProp: labelNewProp,
                    labelOldProp: labelOldProp,
                    isNew: row.isNew
                })
                if (res.msg === 'success') {
                    this.$message({
                        type: 'success',
                        message: row.isNew ? this.$tc('message.text4', 1) : this.$tc('message.text5', 1)
                    })
                    row.isNew = false
                    row.isEdit = false
                    this.createLabelStore.getAllLabel({ graph: this.currentSelectedGraph })
                } else {
                    this.$message({
                        type: 'error',
                        message: res.text || (row.isNew ? this.$tc('message.text4', 2) : this.$tc('message.text5', 2))
                    })
                }
            })
            .catch(() => {
                this.$message({
                    type: 'info',
                    message: this.$t('message.text7') as string
                })
            })
    }
    cancelRowProp(row: any, item: any, type: string) {
        if (row.isNew === false) {
            row.isEdit = false
            row.type = row.typeBak
            row.isIndex = row.isIndexBak
            row.optional = row.optionalBak
            row.isUnique = row.isUniqueBak
        } else {
            let index = item.tableData.indexOf(row)
            item.tableData.splice(index, 1)
        }
    }
    addLabelProp(item: any, type: string) {
        var obj: any = {}
        if (type === 'vertex') {
            obj.isNew = true
            obj['name'] = ''
            obj['isIndex'] = false
            obj['isIndexBak'] = false
            obj['isUnique'] = false
            obj['isUniqueBak'] = false
            obj['optional'] = true
            obj['optionalBak'] = true
            obj['type'] = 'STRING'
            obj['typeBak'] = 'STRING'
            obj['isEdit'] = true
        } else {
            obj.isNew = true
            obj['name'] = ''
            obj['optional'] = true
            obj['optionalBak'] = true
            obj['type'] = 'STRING'
            obj['typeBak'] = 'STRING'
            obj['isEdit'] = true
        }
        item.tableData.unshift(obj)
    }
    deleteLabel(item: any, type: string) {
        this.$confirm(this.$t('message.text9', [item.name]) as string, this.$t('message.text1') as string, {
            confirmButtonText: this.$tc('message.text2', 1) as string,
            cancelButtonText: this.$tc('message.text2', 2) as string,
            type: 'warning'
        })
            .then(async () => {
                let res = await this.createLabelStore.deleteLabel({ graph: this.currentSelectedGraph, labelName: item.name, labelType: type })
                if (res.msg === 'success') {
                    this.$message({
                        message: this.$tc('message.text3', 1) as string,
                        type: 'success'
                    })
                } else {
                    this.$message({
                        message: this.$tc('message.text3', 2) as string,
                        type: 'error'
                    })
                }
                this.createLabelStore.getAllLabel({ graph: this.currentSelectedGraph })
            })
            .catch(() => {
                this.$message({
                    type: 'info',
                    message: this.$t('message.text6') as string
                })
            })
    }
    addRow() {
        let o: { [p: string]: any } = {
            name: '',
            type: 'STRING',
            optional: true
        }
        if (this.labelType === 'vertex') {
            o = {
                ...o,
                isIndex: false,
                isUnique: false
            }
        }
        this.form.fields.push(o)
    }
    addConstraintsRow() {
        this.form.constraints.push({ src: '', dst: '' })
    }
    deleteConstraintsRow(index: any) {
        this.form.constraints.splice(index, 1)
    }
    showModal(data: string) {
        this.form = {
            name: '',
            fields: [],
            is_vertex: '',
            constraints: [],
            pk: ''
        }
        this.labelType = data
        this.dialogVisible = true
    }
    closeModel() {
        this.clearLabel()
        this.dialogVisible = false
    }
    async createLabel() {
        if (this.form.name === '') {
            this.$message({
                type: 'error',
                message: this.$t('message.text10') as string
            })
            return
        }
        let target = this.form.fields.find((item) => item.name.trim() === '')
        if (target) {
            this.$message({
                type: 'error',
                message: this.$t('message.text11') as string
            })
            return
        }
        this.form.is_vertex = this.labelType === 'vertex'
        let params: any = {
            graph: this.currentSelectedGraph,
            data: {
                name: this.form.name,
                fields: this.form.fields,
                is_vertex: this.form.is_vertex
            }
        }
        // 创建节点必须指定一个属性为主键
        if (this.form.is_vertex) {
            if (!this.form.pk) {
                this.$message({
                    type: 'error',
                    message: this.$t('message.text13') as string
                })
                return
            }
            params.data.primary = this.form.pk
        } else {
            // 边类型加edge_constraints，限制起始点
            let edge_constraints = []
            this.form.constraints.forEach((item) => {
                edge_constraints.push([item.src, item.dst])
            })
            params.data.edge_constraints = edge_constraints
        }
        let res: any = await this.createLabelStore.createLabel(params)
        if (res.msg === 'success') {
            this.$message({
                message: this.$tc('message.text4', 1) as string,
                type: 'success'
            })
            this.dialogVisible = false
        } else {
            this.$message({
                message: res.text || (this.$tc('message.text4', 2) as string),
                type: 'error'
            })
        }
        this.createLabelStore.getAllLabel({ graph: this.currentSelectedGraph })
    }
    cancelLabel() {
        this.clearLabel()
        this.dialogVisible = false
    }
    updateIsIndex(row: any) {
        if (row.isIndex === false) {
            row.isUnique = false
        }
    }
    clearLabel() {
        this.form = {
            name: '',
            fields: [],
            is_vertex: ''
        }
    }
    updateIsOptional(row: any) {
        if (row.optional === true) {
            row.isIndex = false
            row.isUnique = false
        }
    }
    deleteRow(index: any, row: any) {
        this.form.fields.splice(index, 1)
    }
    handleChange(val: any) {
        console.log(val)
    }
    updatePropsOptional(row: any, type: string) {
        if (row.optional === true) {
            row.isIndex = false
            row.isUnique = false
        }
    }
    changePK(data: any) {
        if (data) {
            this.form.fields.forEach((field) => {
                if (field.name === data) {
                    field.isIndex = true
                    field.isUnique = true
                    field.optional = false
                }
            })
        }
    }
    exportLabels() {
        let fileName: string
        let nodedata: any
        let edgedata: any
        fileName = this.currentSelectedGraph + '_schema.json'
        nodedata = this.vertexLabels.map((item) => {
            return {
                label: item.name,
                primary: item.primary,
                type: 'VERTEX',
                properties: Object.keys(item.props).map((name) => {
                    return {
                        name: name,
                        type: item.props[name].type,
                        optional: item.props[name].optional,
                        index: item.props[name].isIndex,
                        unique: item.props[name].isUnique
                    }
                })
            }
        })
        edgedata = this.edgeLabels.map((item) => {
            return {
                label: item.name,
                type: 'EDGE',
                primary: item.primary,
                properties: Object.keys(item.props).map((name) => {
                    return {
                        name: name,
                        type: item.props[name].type,
                        optional: item.props[name].optional,
                        index: item.props[name].isIndex,
                        unique: item.props[name].isUnique
                    }
                }),
                constraints: item.constraints
            }
        })
        console.log(nodedata, edgedata)
        let data = JSON.stringify({ schema: [...nodedata, ...edgedata] })

        downloadFile(fileName, new Blob([data]))
    }
    uploadChange(file, fileList) {
        if (file.name.endsWith('.json') && this.currentSelectedGraph) {
            var reader: any = new FileReader()
            let list = []
            reader.onload = async () => {
                let res = reader.result
                let description = JSON.stringify(JSON.parse(res))
                let result: any = await this.createLabelStore.importSchema({ graphName: this.currentSelectedGraph, description: description })
                if (result.msg === 'success') {
                    this.$message({
                        message: '导入成功',
                        type: 'success'
                    })
                } else {
                    this.$message({
                        message: '导入失败',
                        type: 'success'
                    })
                }
                this.createLabelStore.getAllLabel({ graph: this.currentSelectedGraph })
            }
            reader.onerror = (e) => {}
            reader.readAsText(file.raw)
        } else if (!this.currentSelectedGraph) {
            this.$message({
                message: '子图不能为空',
                type: 'error'
            })
        } else {
            this.$message({
                message: '文件格式不正确',
                type: 'error'
            })
        }
    }
    setActiveLabel(tag, type) {
        this.activeLabel = {
            type: type,
            value: tag
        }
    }
}
</script>
<style lang="less" scoped>
@import url('./create-label');
</style>
