<template>
    <div class="workbench-cypher-ide" :class="layoutType">
        <div class="workbench-cypher-textarea" @keydown="ctrlEnter">
            <textarea ref="cypherCodeMirror" class="cypher-code-mirror"></textarea>
        </div>
        <div class="workbench-cypher-btns">
            <el-tooltip content="Ctrl + Enter" placement="left">
                <div class="btn btn-run" @click="getCypher"></div>
            </el-tooltip>
            <el-tooltip content="Save Cypher" placement="left">
                <div class="btn btn-save" @click="saveCypher"></div>
            </el-tooltip>
            <el-tooltip content="Open Favorites" placement="left">
                <div class="btn btn-dir" @click="showLocalCypher"></div>
            </el-tooltip>
        </div>
        <el-dialog :visible.sync="dialogVisible" title="保存Cypher语句">
            <section class="local-cypher-dialog-body">
                <div>名称：</div>
                <div>
                    <el-input size="small" v-model="saveObj.name"></el-input>
                </div>
                <div>备注：</div>
                <div>
                    <el-input type="textarea" v-model="saveObj.ps" maxlength="50" show-word-limit></el-input>
                </div>
            </section>
            <section class="local-cypher-dialog-btns">
                <el-button size="mini" type="primary" @click="save">保存</el-button>
                <el-button size="mini" @click="dialogVisible = false">取消</el-button>
            </section>
        </el-dialog>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import * as CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/mode/cypher/cypher'
import 'codemirror/addon/display/placeholder'
import 'codemirror/addon/hint/anyword-hint'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/edit/closebrackets'
import CypherStore from '@/store/cypher/cypher'
import SubGraphManageStore from '@/store/subgraph-manage/subgraph-manage'
@Component
export default class WorkbenchCypherIde extends Vue {
    @Prop(String) layoutType!: ''
    cypherStore: CypherStore = getModule(CypherStore, store)
    subGraphManageStore: SubGraphManageStore = getModule(SubGraphManageStore, store)
    query: boolean = false
    dialogVisible: boolean = false
    saveObj: { name: string; ps: string; value: string } = { name: '', ps: '', value: '' }
    variablePool: any = {
        keyWords: [
            'CREATE',
            'MATCH',
            'WITH',
            'WHERE',
            'RETURN',
            'AS',
            'AND',
            'DISTINCT',
            'UNWIND',
            'IN',
            'LIMIT',
            'OR',
            'NOT',
            'CONTAINS',
            'ENDS',
            'STARTS',
            'ORDER',
            'BY',
            'IS',
            'NULL',
            'SKIP',
            'CALL',
            'YIELD',
            'COUNT',
            'PROP',
            'PROPERTIES',
            'DELETE'
        ]
    }
    public $refs!: {
        cypherCodeMirror: HTMLTextAreaElement
    }
    get currentCypher() {
        return this.cypherStore.currentCypher
    }
    @Watch('currentCypher')
    onChangeCurrentCypher(newVal: string, oldVal: string) {
        this.cypherCodeMirror.setValue(newVal)
    }
    cypherCodeMirror: any = null
    cypherCodeMirrorConfig: any = {
        lineNumbers: true, // 是否显示行数
        tabMode: 'indent',
        lineWrapping: true,
        mode: 'application/x-cypher-query', // 使用什么模式 text/x-pgsql是sql   javascript等
        showCursorWhenSelecting: true, // 当有选中的时候是否显示光标
        extraKeys: { Ctrl: 'autocomplete' }, // 自定义快捷键
        height: 100,
        autoCloseBrackets: true,
        hintOptions: { hint: this.handleShowHint, completeSingle: false }
    }
    mounted() {
        let dom = this.$refs['cypherCodeMirror']
        this.cypherCodeMirror = CodeMirror.fromTextArea(dom, this.cypherCodeMirrorConfig)
        this.cypherCodeMirror.setValue(this.currentCypher)
        this.cypherCodeMirror.on('change', () => {
            this.cypherCodeMirror.closeHint()
            this.cypherCodeMirror.showHint()
        })
    }
    handleShowHint() {
        // const codeMirrorInstance = dom.getCodeMirrorInstance();
        const cur = this.cypherCodeMirror.getCursor()
        const curLine = this.cypherCodeMirror.getLine(cur.line)
        // 当前光标的位置
        const end = cur.ch
        var beforCursorString = curLine.substr(0, end)
        let lastSpaceIndex = beforCursorString.lastIndexOf(' ')
        var lastWord = ''
        if (lastSpaceIndex !== -1) {
            lastWord = beforCursorString.substr(lastSpaceIndex + 1, beforCursorString.length)
        } else {
            lastWord = beforCursorString
        }
        var list: any = []
        this.variablePool.keyWords.forEach((item: any) => {
            let a = lastWord.toUpperCase()
            if (a) {
                if (item.startsWith(a)) {
                    list.push(item)
                }
            }
        })
        return {
            list: list,
            from: CodeMirror.Pos(cur.line, end - lastWord.length),
            to: CodeMirror.Pos(cur.line, end)
        }
    }
    async getCypher() {
        if (!this.query) {
            this.query = true
            let cypher = this.cypherCodeMirror.getValue()
            this.cypherStore.upDateCurrentCypher(cypher)
            let id = new Date().getTime() + ''
            this.cypherStore.tabAdd({ id: id, graph: this.subGraphManageStore.selectedSubGraph })
            let res = await this.cypherStore.queryByCypher({ graph: this.subGraphManageStore.selectedSubGraph, script: cypher, tabValue: id })
            console.log(res)
            this.query = false
        }
    }
    ctrlEnter(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            this.getCypher()
        }
    }
    showLocalCypher() {
        this.$emit('update:isShowLocalCypher', true)
    }
    saveCypher() {
        let localCypherList
        if (localStorage.LOCALCYPHERLIST) {
            localCypherList = JSON.parse(localStorage.LOCALCYPHERLIST)
        } else {
            localCypherList = []
        }
        let n = localCypherList.length + 1
        this.saveObj = {
            name: '收藏Cypher语句 ' + n,
            ps: '收藏Cypher语句 ' + n + ' 的备注',
            value: this.cypherCodeMirror.getValue()
        }
        this.dialogVisible = true
    }
    save() {
        let localCypherList
        if (localStorage.LOCALCYPHERLIST) {
            localCypherList = JSON.parse(localStorage.LOCALCYPHERLIST)
        } else {
            localCypherList = []
        }
        if (!this.saveObj.name) {
            this.$message({
                message: '收藏语句名称不能为空',
                type: 'warning'
            })
        }
        let has = localCypherList.find((item) => item.name === this.saveObj.name)
        if (has) {
            this.$message({
                message: '收藏语句名称重复',
                type: 'warning'
            })
            return
        }
        localCypherList.push(this.saveObj)
        localStorage.LOCALCYPHERLIST = JSON.stringify(localCypherList)
        this.dialogVisible = false
    }
}
</script>
<style lang="less" scoped>
.workbench-cypher-ide {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    position: relative;
    padding: 16px 14px;
    &.layout1,
    &.layout3 {
        flex-direction: row;
        .workbench-cypher-btns {
            padding-left: 11px;
            > .btn {
                margin-bottom: 12px;
            }
        }
    }
    &.layout2,
    &.layout4 {
        flex-direction: column;
        .workbench-cypher-btns {
            padding-top: 11px;
            display: flex;
            > .btn {
                margin-right: 12px;
            }
        }
    }
    .workbench-cypher-textarea {
        overflow: hidden;
        border-radius: 8px;
        flex-grow: 1;
        // width: calc(100% - 50px);
        // max-width: calc(100% - 50px);
    }
    .workbench-cypher-btns {
        > .btn {
            cursor: pointer;
            width: 40px;
            height: 40px;
            background-color: #5c71c0;
            border-radius: 5px;
            background-size: 35px;
            background-repeat: no-repeat;
            background-position: center;
            padding: 5px;
        }
        .btn-run {
            background-image: url('../../../../assets/cypher-ide/run.png');
        }
        .btn-save {
            background-image: url('../../../../assets/cypher-ide/save.png');
        }
        .btn-dir {
            background-image: url('../../../../assets/cypher-ide/dir.png');
        }
    }
    /deep/ .el-dialog {
        width: 440px;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 0 16px;
    }
    /deep/ .el-dialog__header {
        padding-top: 0;
        padding-left: 0;
        height: 63px;
        line-height: 63px;
        font-family: PingFangSC-Regular;
        font-size: 20px;
        color: #44527c;
        height: 63px;
        line-height: 63px;
        border-bottom: 1px solid #e6e6e6;
    }
    /deep/ .el-dialog__headerbtn {
        font-size: 20px;
    }
    /deep/ .el-dialog__body {
        padding: 0;
    }
    .local-cypher-dialog-btns {
        margin: 20px 0;
        white-space: nowrap;
        text-align: right;
    }

    .local-cypher-dialog-body {
        > div {
            margin: 5px 0;
        }
    }

    /deep/.CodeMirror {
        height: 100%;
        width: 100%;
        background: #f5f6fa;
    }
    /deep/.CodeMirror-gutters {
        border: none;
        width: 42px;
        color: #fff;
    }
    /deep/.CodeMirror-gutter {
        width: 42px;
        border: none;
        background: #a1a3bc;
        color: #fff;
    }
    /deep/.CodeMirror-linenumber {
        color: #fff;
    }
    /deep/.CodeMirror-sizer {
        padding: 6px 13px;
    }
    /deep/.CodeMirror-gutter-wrapper {
        left: -68px !important;
    }
}
</style>
