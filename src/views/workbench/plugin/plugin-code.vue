<template>
    <div class="workbench-plugin-code">
        <div class="workbench-plugin-textarea">
            <textarea ref="codeCodeMirror" class="cypher-code-mirror"></textarea>
        </div>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import * as CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/clike/clike'
@Component
export default class WorkbenchPluginCode extends Vue {
    @Prop(String) code!: string
    public $refs!: {
        codeCodeMirror: HTMLTextAreaElement
    }
    cypherCodeMirror: any = null
    cypherCodeMirrorConfig: any = {
        lineNumbers: true, // 是否显示行数
        tabMode: 'indent',
        lineWrapping: true,
        mode: 'text/x-c++src', // 使用什么模式 text/x-pgsql是sql   javascript等
        showCursorWhenSelecting: true, // 当有选中的时候是否显示光标
        extraKeys: { Ctrl: 'autocomplete' }, // 自定义快捷键
        height: 100,
        readOnly: true,
        autoCloseBrackets: true
    }
    mounted() {
        let dom = this.$refs['codeCodeMirror']
        this.cypherCodeMirror = CodeMirror.fromTextArea(dom, this.cypherCodeMirrorConfig)
        this.cypherCodeMirror.setValue(atob(this.code))
        // this.cypherCodeMirror.on('change', () => {
        //     this.cypherCodeMirror.closeHint()
        //     this.cypherCodeMirror.showHint()
        // })
    }
}
</script>
<style lang="less" scoped>
.workbench-plugin-code {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    position: relative;
    .workbench-plugin-textarea {
        overflow: hidden;
        border-radius: 8px;
        width: 100%;
        height: 100%;
        max-height: 100%;
        position: absolute;
    }
    /deep/.CodeMirror {
        height: 100%;
        width: 100%;
        overflow: hidden;
        background: #f5f6fa;
    }
}
</style>
