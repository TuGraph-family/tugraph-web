<template>
    <div class="workbench-cypher-ide" :class="layoutType">
        <div class="workbench-cypher-textarea" @keydown="ctrlEnter">
            <textarea ref="cypherCodeMirror" class="cypher-code-mirror"></textarea>
        </div>
        <div class="workbench-cypher-btns">
            <el-tooltip content="Ctrl + Enter" placement="left">
                <div class="btn-run" @click="getCypher"></div>
            </el-tooltip>
        </div>
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
    created() {}
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
            await this.cypherStore.queryByCypher({ graph: this.subGraphManageStore.selectedSubGraph, script: cypher, tabValue: id })
            this.query = false
        }
    }
    ctrlEnter(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            this.getCypher()
        }
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
        }
    }
    &.layout2,
    &.layout4 {
        flex-direction: column;
        .workbench-cypher-btns {
            padding-top: 11px;
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
        .btn-run {
            cursor: pointer;
            width: 36px;
            height: 36px;
            background: url('../../../../assets/cypher-ide/run-normal.png') no-repeat center;
            &:hover {
                background: url('../../../../assets/cypher-ide/run-hover.png') no-repeat center;
            }
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
