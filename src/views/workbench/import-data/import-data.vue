<i18n src="./import-data-lang.json"></i18n>
<template>
    <div class="workbench-data-import">
        <div class="workbench-data-import-header">
            <div class="workbench-data-import-title">{{ $t('text1') }}</div>
            <div class="workbench-data-import-right-btn">
                <span class="workbench-data-import-file">{{ $t('text2') }}：</span>
                <el-select class="workbench-data-import-select" v-model="fileDecode">
                    <el-option v-for="item in fileDecodeList" :key="item.label" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-upload v-if="tableData.length > 0" action="localhost" multiple :auto-upload="false" :on-change="uploadChange" :show-file-list="false">
                    <el-button size="small" type="primary">{{ $t('text4') }}</el-button>
                </el-upload>
            </div>
        </div>
        <div class="workbench-data-import-table" v-if="tableData.length > 0">
            <el-table :data="tableData" border height="100%">
                <el-table-column prop="graphName" :label="$t('text5')"> </el-table-column>
                <el-table-column prop="fileName" :label="$t('text6')"> </el-table-column>
                <el-table-column prop="fileSize" :label="$t('text19')"> </el-table-column>
                <el-table-column prop="fileReaderStatus" :label="$t('text7')">
                    <template slot-scope="scope">
                        <div v-if="scope.row.fileReaderStatus === 'success'">
                            <span>{{ $t('text12') }}</span>
                        </div>
                        <div v-if="scope.row.fileReaderStatus === 'faild'">
                            <span>{{ $t('text20') }}:{{ scope.row.fileReaderMsg }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="labelName" :label="$t('text8')">
                    <template slot-scope="scope">
                        <el-select size="mini" v-model="scope.row.labelType" @change="changeLabelType(scope)">
                            <el-option :label="$t('text24')" value="node"></el-option>
                            <el-option :label="$t('text25')" value="edge"></el-option>
                        </el-select>
                        <el-select size="mini" v-model="scope.row.labelName" :disabled="!scope.row.labelType">
                            <el-option v-for="item in scope.row.label.filter((item) => item.type === scope.row.labelType)" :key="item.name" :label="item.name" :value="item.name"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="mapStatus" :label="$t('text9')">
                    <template slot-scope="scope">
                        <div v-if="scope.row.mapStatus === 'reading'">
                            <el-button size="mini">{{ $t('text22') }}</el-button>
                            <span>{{ $t('text23') }}</span>
                        </div>
                        <div v-if="scope.row.mapStatus === 'none'">
                            <el-button size="mini" @click="mapRowData(scope)">{{ $t('text13') }}</el-button>
                            <span>{{ $t('text14') }}</span>
                        </div>
                        <div v-if="scope.row.mapStatus === 'finished'" @click="mapRowData(scope)">
                            <el-button type="success" size="mini">{{ $t('text15') }}</el-button>
                            <span>{{ $t('text16') }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="uploadProgress" :label="$t('text10')">
                    <template slot-scope="scope">
                        <el-progress :text-inside="true" :stroke-width="15" :percentage="scope.row.uploadProgress"></el-progress>
                    </template>
                </el-table-column>
                <el-table-column prop="uploadResult" :label="$t('text11')">
                    <template slot-scope="scope">
                        <div v-if="scope.row.uploadResult === 'notstarted'">
                            <el-button size="mini" @click="importOnline(scope)">{{ $t('text17') }}</el-button>
                        </div>
                        <div v-if="scope.row.uploadResult === 'uploading'">
                            <span style="margin-right:10px;color:#409EFF;">{{ $t('text26') }}</span>
                        </div>
                        <div v-if="scope.row.uploadResult === 'faild'">
                            <span style="margin-right:10px;color:#f56c6c;">{{ $t('text27') }}</span>
                        </div>
                        <div v-if="scope.row.uploadResult === 'success'">
                            <span style="margin-right:10px; color:#67C23A;">{{ $t('text28') }}</span>
                        </div>
                        <el-button type="danger" :disabled="scope.row.uploadResult === 'uploading'" size="mini" @click="deleteRowFromTabelData(scope)">{{ $t('text18') }}</el-button>
                        <div v-if="scope.row.uploadResult === 'faild'">
                            <i class="el-icon-warning-outline faild" @click="showErrorMessage(scope)"></i>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="import-data-none" v-if="tableData.length === 0">
            <div class="no-search">
                <div class="no-search-img"></div>
                <div class="no-search-word">{{ $t('text3') }}</div>
                <el-upload action="localhost" multiple :auto-upload="false" :on-change="uploadChange" :show-file-list="false">
                    <el-button size="small" type="primary">{{ $t('text4') }}</el-button>
                </el-upload>
            </div>
        </div>
        <div class="map-data-modal" v-if="mapModalData">
            <div class="map-data-modal-box">
                <!-- <div class="left"></div> -->
                <div class="right">
                    <div class="header">
                        <div class="header-item" v-if="mapModalData.targetlabel.type === 'edge'">起点 <el-input size="mini" v-model="mapModalData.srcCol"></el-input> 列</div>
                        <div class="header-item" v-if="mapModalData.targetlabel.type === 'edge'">终点 <el-input size="mini" v-model="mapModalData.dstCol"></el-input> 列</div>
                        <div class="header-item">从第 <el-input size="mini" v-model="mapModalData.header"></el-input> 行开始导入</div>
                        <el-button size="mini" class="map-btn" @click="createDescription">映射</el-button>
                        <i
                            class="el-icon-circle-close"
                            @click="
                                () => {
                                    this.mapModalData = null
                                }
                            "
                        ></i>
                    </div>
                    <div class="body">
                        <el-table :data="mapModalData.mapData.data" border height="100%" :row-class-name="rowClassName">
                            <el-table-column v-for="(item, index) in mapModalData.mapData.header" :key="item.col" :prop="item.col">
                                <template slot="header" slot-scope="scope">
                                    <div class="src" v-if="index === mapModalData.srcCol - 1 && mapModalData.targetlabel.type === 'edge'">
                                        {{ $t('text30') }}
                                        <el-select clearable size="mini" v-model="mapModalData.srcLabelName" @change="changePointLabel(scope)">
                                            <el-option v-for="l in allLabel.filter((item) => item.type === 'node')" :key="l.name" :value="l.name" :label="l.name"></el-option>
                                        </el-select>
                                    </div>
                                    <div class="dst" v-else-if="index === mapModalData.dstCol - 1 && mapModalData.targetlabel.type === 'edge'">
                                        {{ $t('text31') }}
                                        <el-select clearable size="mini" v-model="mapModalData.dstLabelName" @change="changePointLabel(scope)">
                                            <el-option v-for="l in allLabel.filter((item) => item.type === 'node')" :key="l.name" :value="l.name" :label="l.name"></el-option>
                                        </el-select>
                                    </div>
                                    <div v-else>
                                        <el-select clearable size="mini" v-model="item.propName" @change="changeColProp(scope)">
                                            <el-option v-for="(l, i) in mapModalData.targetlabel.props" :key="i" :value="i" :label="i"></el-option>
                                        </el-select>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import SubGraphManageStore from '@/store/subgraph-manage/subgraph-manage'
import ImportDataStore from '@/store/import-data/import-data'
import CreateLabelStore from '@/store/create-label/create-label'
import FileWorker from './file.worker.ts'
// 行数据模型
interface rowData {
    graphName: string
    fileName: string
    fileSize: string
    description: any
    fileReaderStatus: 'success' | 'faild'
    fileReaderMsg: string
    mapStatus: 'reading' | 'none' | 'finished'
    label: any
    labelType: string
    labelName: string
    uploadProgress: number
    uploadResult: 'faild' | 'success' | 'notstarted' | 'uploading'
    mapData: Array<any>
    returnIndexList: Array<number>
    mapLabelData: Array<any>
    mapModalData: any
    importDataBuffer: any
    errMessageList: any
}
@Component({
    components: {}
})
export default class importData extends Vue {
    subGraphManageStore: SubGraphManageStore = getModule(SubGraphManageStore, store)
    createLabelStore: CreateLabelStore = getModule(CreateLabelStore, store)
    ImportDataStore: ImportDataStore = getModule(ImportDataStore, store)
    fileDecode: string = 'UTF-8'
    fileDecodeList: any = [
        { label: 'UTF-8', value: 'UTF-8' },
        { label: 'GB2312', value: 'GB2312' },
        { label: 'GBK', value: 'GBK' },
        { label: 'ISO-8859-2', value: 'ISO-8859-2' }
    ]
    tableData: Array<rowData> = []
    mapModalData: any = null
    get currentGraph() {
        return this.subGraphManageStore.selectedSubGraph
    }
    @Watch('currentGraph')
    currentGraphChange(n, o) {
        this.createLabelStore.getAllLabel({ graph: this.currentGraph })
    }
    get allLabel() {
        let target = this.createLabelStore.allLabel.find((item) => item.graph == this.currentGraph)
        return target.allLabel
    }

    selectedValue: string = ''
    created() {}
    clone(data: any) {
        return JSON.parse(JSON.stringify(data))
    }
    uploadChange(file, fileList) {
        let rowData: rowData = {
            graphName: this.currentGraph,
            fileName: file.name,
            fileSize: (file.size / 1024).toFixed(2) + 'Kb',
            mapStatus: 'reading',
            labelType: '',
            labelName: '',
            label: this.clone(this.allLabel),
            uploadProgress: 0,
            uploadResult: 'notstarted',
            mapData: [],
            returnIndexList: [],
            fileReaderStatus: 'success',
            fileReaderMsg: '',
            description: '',
            mapLabelData: [],
            mapModalData: null,
            importDataBuffer: null,
            errMessageList: null
        }
        if (file.name.endsWith('.csv')) {
            this.tableData.push(rowData)
            var reader: any = new FileReader()
            reader.onload = () => {
                let w: Worker = new FileWorker()
                w.onmessage = (e: any) => {
                    rowData.mapData = e.data.mapData
                    rowData.returnIndexList = e.data.returnIndexList
                    rowData.importDataBuffer = e.data.importDataBuffer
                    rowData.mapStatus = 'none'
                    w.terminate()
                }
                w.onerror = (e) => {
                    console.log(e)
                }
                // worker数据传输有大小限制

                w.postMessage({ fileDecode: this.fileDecode, method: 'getTableData', buffer: reader.result }, [reader.result])
            }
            reader.onerror = (e) => {
                rowData.fileReaderStatus = 'faild'
                rowData.fileReaderMsg = e.target.error.message
            }

            reader.readAsArrayBuffer(file.raw)
        } else {
            this.tableData.push(rowData)
            rowData.fileReaderStatus = 'faild'
            rowData.fileReaderMsg = this.$t('text21') as string
        }
    }
    deleteRowFromTabelData(scope: any) {
        this.tableData.splice(scope.$index, 1)
    }
    mapRowData(scope: any) {
        let row = scope.row
        if (!row.labelName) {
            this.$message({
                message: this.$t('message.text1') as string,
                type: 'warning'
            })
            return
        }
        if (row.mapStatus === 'none') {
            let columnNum = Math.max(...row.mapData.map((item) => item.arr.length))

            let tableData: Array<any> = []
            let tableHeader: Array<any> = []
            for (let i = 0; i < columnNum; i++) {
                tableHeader.push({
                    col: 'col' + i,
                    labelName: '',
                    propName: ''
                })
            }
            row.mapData.forEach((item) => {
                let row: any = {}
                for (let i = 0; i < columnNum; i++) {
                    row['col' + i] = item.arr[i]
                }
                tableData.push(row)
            })

            this.mapModalData = {
                targetlabel: this.allLabel.find((item) => item.type === row.labelType && item.name === row.labelName),
                mapLabelData: row.mapLabelData,
                header: 1, // 从第几行开始导入
                srcCol: 1, // 起点是第几列
                dstCol: 2, // 终点是第几列
                srcLabelName: '',
                srcLabelProp: '',
                dstLabelName: '',
                dstLabelProp: '',
                rowIndex: scope.$index,
                mapData: {
                    header: tableHeader,
                    data: tableData
                }
            }
        } else {
            this.mapModalData = row.mapModalData
        }
    }
    changeColProp(scope: any) {
        console.log(scope)
        let index = this.mapModalData.mapData.header.findIndex((item, index) => item.propName === this.mapModalData.mapData.header[scope.$index].propName && index !== scope.$index)

        if (index !== scope.$index && index !== -1) {
            // 清空重复prop的列
            this.mapModalData.mapData.header[index].propName = ''
        }
    }
    createDescription() {
        let description: any
        let label = this.mapModalData.targetlabel.name
        let header = this.mapModalData.header
        let propsList = []
        this.mapModalData.mapData.header.forEach((item, index) => {
            if (index === this.mapModalData.srcCol - 1 && this.mapModalData.targetlabel.type === 'edge') {
                propsList.push('SRC_ID')
            } else if (index === this.mapModalData.dstCol - 1 && this.mapModalData.targetlabel.type === 'edge') {
                propsList.push('DST_ID')
            } else if (item.propName) {
                propsList.push(item.propName)
            } else {
                propsList.push('SKIP')
            }
        })
        let props = propsList
        // if (this.mapModalData.targetlabel.type === 'node') {
        //     // description = `LABEL=${label},HEADER=${header - 1}\n${props}`
        // } else {
        let srcLabelName = this.mapModalData.srcLabelName
        //     let srcLabelProp = this.mapModalData.srcLabelProp
        let dstLabelName = this.mapModalData.dstLabelName
        //     let dstLabelProp = this.mapModalData.dstLabelProp
        //     // description = `LABEL=${label},SRC_ID=${srcLabelName}:${srcLabelProp},DST_ID=${dstLabelName}:${dstLabelProp},HEADER=${header - 1}\n${props}`
        // }

        if (this.mapModalData.targetlabel.type === 'node') {
            description = {
                files: [
                    {
                        format: 'CSV',
                        label: label,
                        columns: props,
                        header: header - 1
                    }
                ]
            }
        } else {
            let srcLabelName = this.mapModalData.srcLabelName

            let dstLabelName = this.mapModalData.dstLabelName

            description = {
                files: [
                    {
                        format: 'CSV',
                        label: label,
                        columns: props,
                        header: header - 1,
                        SRC_ID: srcLabelName,
                        DST_ID: dstLabelName
                    }
                ]
            }
        }
        if (!props) {
            this.$message({
                message: this.$t('message.text2') as string,
                type: 'warning'
            })
        } else {
            this.tableData[this.mapModalData.rowIndex].mapStatus = 'finished'
            this.tableData[this.mapModalData.rowIndex].description = description
            this.tableData[this.mapModalData.rowIndex].mapModalData = this.mapModalData
            this.mapModalData = null
        }
    }
    rowClassName({ row, rowIndex }) {
        if (rowIndex < this.mapModalData.header - 1) {
            return 'no-import'
        }
    }
    changeLabelType(scope: any) {
        let rowData: rowData = scope.row
        rowData.labelName = ''
    }
    async importOnline(scope: any) {
        let rowData: rowData = scope.row
        if (rowData.mapStatus === 'finished') {
            let len = rowData.importDataBuffer.length
            let resList: Array<any> = []
            for (let i: number = 0; i < len; i++) {
                rowData.uploadResult = 'uploading'
                // 2021-12-31 导入数据接口description修改，@伯途 @诗源
                // if (i > 0) {
                //     console.log(rowData.description)
                //     rowData.description = rowData.description.replace(/HEADER=\d*/, 'HEADER=0')
                // }
                // console.log(new TextDecoder(this.fileDecode).decode(rowData.importDataBuffer[i].data))
                let params = {
                    graph: rowData.graphName,
                    data: { description: rowData.description, data: new TextDecoder(this.fileDecode).decode(rowData.importDataBuffer[i].data), continue_on_error: true, delimiter: ',' }
                }
                if (i > 0) {
                    rowData.description.files[0] && (rowData.description.files[0].header = 0)
                }
                params.data.description = JSON.stringify(rowData.description)
                console.log(params)
                let res = await this.ImportDataStore.importTextData(params)

                rowData.uploadProgress = parseFloat((((i + 1) / len) * 100).toFixed(2))
                res.start = rowData.importDataBuffer[i].startLine
                res.end = rowData.importDataBuffer[i].endLine
                resList.push(res)
            }
            let errRes = resList.filter((item) => item.status !== 200)
            if (errRes.length) {
                rowData.uploadResult = 'faild'
                let errMessageList: Array<any> = []
                errRes.forEach((item) => {
                    errMessageList.push({
                        text: `${item.start}~${item.end}导入失败`,
                        err: item.data.error_message
                    })
                })
                rowData.errMessageList = errMessageList
                return
            }
            rowData.uploadResult = 'success'
        } else {
            this.$message({
                message: this.$t('message.text3') as string,
                type: 'warning'
            })
        }
    }
    changePointLabel(scope: any) {
        let index = scope.$index
        if (index === this.mapModalData.srcCol - 1) {
            this.mapModalData.srcLabelProp = ''
        } else if (index === this.mapModalData.dstCol - 1) {
            this.mapModalData.dstLabelProp = ''
        }
    }
    showErrorMessage(scope: any) {
        let content = ''
        let errMessageList = scope.row.errMessageList
        errMessageList.forEach((item) => {
            content += `<div style="border-bottom:1px dotted #dddddd;margin-bottom:5px;"><span>${item.text}<span><br><span style="color:#f56c6c;">原因：${item.err}</span></div>`
        })
        this.$alert(`<div style="height:300px;overflow:auto;">${content}</div>`, this.$t('text29') as string, {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            callback: (action) => {}
        })
    }
}
</script>
<style lang="less" scoped>
@import url('./data-import.less');
</style>
