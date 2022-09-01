<i18n src="./plugin-lang.json"></i18n>
<template>
    <div class="workbench-plugin">
        <div class="workbench-plugin-left">
            <div class="left-header">
                {{ $t('text1') }}
            </div>
            <el-input prefix-icon="el-icon-search" v-model="filterPluginName" placeholder="插件名称"></el-input>
            <el-collapse v-model="activeNames">
                <el-collapse-item :title="`C++ ${$t('text1')}`" name="C++">
                    <div class="plugin-item" v-for="item in pluginList.cppPluginList" :key="item.name" @click="openPlugin('C++', item.name)">{{ item.name }}</div>
                </el-collapse-item>
                <el-collapse-item :title="`Python ${$t('text1')}`" name="Python">
                    <div class="plugin-item" v-for="item in pluginList.pyPluginList" :key="item.name" @click="openPlugin('Python', item.name)">{{ item.name }}</div>
                </el-collapse-item>
            </el-collapse>
            <el-button class="add-plugin-btn" size="small" type="primary" @click="dialogVisible = true">{{ $t('text3') }}</el-button>
        </div>
        <div class="workbench-plugin-right">
            <template v-if="tabPluginList.length">
                <el-tabs type="border-card" closable v-model="activeTabName" @tab-remove="removeTab">
                    <el-tab-pane v-for="item in tabPluginList" :key="item.key" :name="item.key">
                        <span class="tab-plugin-name" slot="label">{{ item.name }}【{{ item.type }}】</span>
                        <div class="tab-box">
                            <PluginRun :pluginTab="item" @deletePlugin="deletePlugin"></PluginRun>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </template>
            <template v-else>
                <div class="no-plugin">
                    <div class="null-img"></div>
                    <div class="null-img-word">{{ $t('text17') }}</div>
                </div>
            </template>
        </div>
        <el-dialog :destroy-on-close="true" :visible.sync="dialogVisible" :before-close="beforeClose" :title="$t('text3')" custom-class="plugin-dialog">
            <el-form :model="form">
                <el-form-item :label="`${$t('text2')}：`" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :label="`${$t('text4')}：`" :label-width="formLabelWidth">
                    <el-select :popper-append-to-body="false" v-model="form.type" placeholder="">
                        <el-option-group v-for="group in options" :key="group.label" :label="group.label">
                            <el-option class="item-type" v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                        </el-option-group>
                    </el-select>
                </el-form-item>
                <el-form-item :label="`${$t('text5')}：`" :label-width="formLabelWidth">
                    <el-input v-model="form.description" autocomplete="off" type="textarea"></el-input>
                </el-form-item>
                <el-form-item :label="`${$t('text6')}：`" :label-width="formLabelWidth">
                    <div @mouseover="iconShow = true" @mouseout="iconShow = false" class="helpIcon">
                        <span v-if="iconShow">{{ $t('text11') }}</span>
                    </div>
                    <el-select class="elSelect" v-model="form.read_only" placeholder="请选择是否只读">
                        <el-option :label="`${$tc('text8', 1)}`" :value="true"></el-option>
                        <el-option :label="`${$tc('text8', 2)}`" :value="false"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-upload action="localhost" class="upload-demo" ref="upload" :file-list="fileList" :limit="1" :auto-upload="false" :on-change="handleChange">
                <el-button class="uploadButton" size="small" type="primary">{{ $t('text7') }}</el-button>
            </el-upload>
            <div slot="footer" class="dialog-footer">
                <el-button class="createLabel" type="primary" @click="loadPlugin">{{ $t('text9') }}</el-button>
                <el-button class="cancelPlugin" type="primary" @click="cancelPlugin">{{ $t('text10') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import PluginRun from './plugin-run.vue'
import PluginStore from '@/store/plugin/plugin'
import SubGraphManageStore from '@/store/subgraph-manage/subgraph-manage'
import store from '@/store/index'

@Component({
    components: {
        PluginRun
    }
})
export default class WorkbenchPlugin extends Vue {
    pluginStore: PluginStore = getModule(PluginStore, store)
    subGraphManageStore: SubGraphManageStore = getModule(SubGraphManageStore, store)
    filterPluginName: string = ''
    activeNames: Array<string> = ['C++', 'Python']
    activeTabName: string = ''
    dialogVisible: boolean = false
    formLabelWidth: string = '100'
    iconShow: boolean = false
    file: any = null
    form = {
        name: '',
        type: '',
        description: '',
        code_base64: new Blob(),
        read_only: false
    }
    options = [
        {
            label: 'C++',
            options: [
                {
                    value: 'zip',
                    label: 'zip'
                },
                {
                    value: 'so',
                    label: 'so'
                },
                {
                    value: 'cpp',
                    label: 'cpp'
                }
            ]
        },
        {
            label: 'Python',
            options: [
                {
                    value: 'py',
                    label: 'py'
                }
            ]
        }
    ]
    get pluginList() {
        if (this.filterPluginName) {
            let data: { cppPluginList: any[]; pyPluginList: any[] } = {
                cppPluginList: [],
                pyPluginList: []
            }
            let cppPluginList = this.pluginStore.pluginList.cppPluginList.filter((item) => item.name.includes(this.filterPluginName))
            let pyPluginList = this.pluginStore.pluginList.pyPluginList.filter((item) => item.name.includes(this.filterPluginName))
            data.cppPluginList = cppPluginList
            data.pyPluginList = pyPluginList
            return data
        } else {
            return this.pluginStore.pluginList
        }
    }
    get graphName() {
        return this.subGraphManageStore.selectedSubGraph
    }
    get tabPluginList() {
        return this.pluginStore.tabPluginList
    }
    get fileList() {
        if (this.file) {
            return [this.file]
        } else {
            return []
        }
    }
    @Watch('graphName')
    onChangeGraphName() {
        this.graphName && this.pluginStore.getPluginList(this.graphName)
        this.pluginStore.clearTab()
    }
    @Watch('dialogVisible')
    onChangeDialogVisible() {
        if (this.dialogVisible === false) {
            this.form = {
                name: '',
                type: '',
                description: '',
                code_base64: new Blob(),
                read_only: false
            }
            this.file = null
        }
    }
    created() {}
    activated() {
        this.graphName && this.pluginStore.getPluginList(this.graphName)
    }
    deletePlugin(params: { targetName: string }) {
        this.removeTab(params.targetName)
        this.pluginStore.getPluginList(this.graphName)
    }
    handleChange(file: any) {
        this.file = file
    }
    openPlugin(type: string, name: string) {
        this.activeTabName = type + '_' + name
        let target = this.tabPluginList.find((item) => item.name === name && item.type === type)
        if (!target) {
            this.pluginStore.addTab({ name, type })
        }
    }
    loadPlugin() {
        var self = this
        if (this.form.name === '' || this.form.type === '' || this.form.description === '') {
            this.$message({
                type: 'error',
                message: '以下所有内容为必填项，不能为空'
            })
            return
        }
        if (!this.file) {
            this.$message({
                type: 'error',
                message: '选择文件不能为空'
            })
            return
        }

        // var type = this.form.code_base64.type
        // 用户名数字字母下划线，64位
        var uPattern = /^[a-zA-Z0-9_]{0,64}$/
        if (!uPattern.test(this.form.name)) {
            this.$message({
                type: 'error',
                message: this.$t('text18') as string
            })
            return
        }
        let name = this.form.name
        let description = this.form.description
        let type = this.form.type
        let readOnly = this.form.read_only
        var reader = new FileReader()
        // 将文件以Data URL形式进行读入页面
        reader.readAsDataURL(this.file.raw)
        reader.onload = async (e: any) => {
            let code_base64 = (e.target.result as string).split(',')[1]
            let res: any = {}
            if (type === 'py') {
                res = await this.pluginStore.loadPythonPlugin({ graph: this.graphName, data: { name: name, description: description, code_base64: code_base64, read_only: readOnly, code_type: type } })
            } else {
                res = await this.pluginStore.loadCppPlugin({ graph: this.graphName, data: { name: name, description: description, code_base64: code_base64, read_only: readOnly, code_type: type } })
            }
            if (res.status === 200) {
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                this.dialogVisible = false
                this.pluginStore.getPluginList(this.graphName)
            } else {
                this.$message({
                    message: res.data.error_message,
                    type: 'error'
                })
            }
        }
    }
    beforeClose(done: any) {
        this.clearData()
        done()
    }
    cancelPlugin() {
        this.dialogVisible = false
    }
    removeTab(targetName: string) {
        this.tabPluginList.forEach((tab, index) => {
            if (tab.key === targetName) {
                let nextTab = this.tabPluginList[index + 1] || this.tabPluginList[index - 1]
                if (nextTab) {
                    this.activeTabName = nextTab.key
                }
            }
        })
        this.pluginStore.removeTab({ key: targetName })
    }
    clearData() {
        this.form = {
            name: '',
            type: '',
            description: '',
            code_base64: new Blob(),
            read_only: false
        }
        this.file = null
        console.log(123)
    }
}
</script>

<style lang="less" scoped>
.workbench-plugin {
    width: 100%;
    height: 100%;
    display: flex;
    .workbench-plugin-left {
        width: 240px;
        height: 100%;
        border-right: 1px solid #cccccc;
        .left-header {
            height: 60px;
            line-height: 60px;
            font-family: OpenSans;
            font-size: 24px;
            color: #44527c;
            margin-left: 10px;
        }
        .el-input {
            margin: 0 10px;
            width: 220px;
        }
        .el-collapse {
            margin: 20px 10px 0 10px;
            width: 220px;
            height: calc(100% - 180px);
        }
        .el-collapse-item {
            max-height: 50%;
            overflow: auto;
        }
        .plugin-item {
            background-image: url('../../../assets/plugin/plugin.png');
            background-repeat: no-repeat no-repeat;
            background-position: 10px 10px;
            padding-left: 35px;
            height: 40px;
            line-height: 40px;
            border-radius: 5px;
            &:hover {
                background-color: #e7eefb;
                cursor: pointer;
            }
        }
    }
    .workbench-plugin-right {
        flex-grow: 1;
        height: 100%;
        overflow: hidden;
        .el-tabs {
            height: 100%;
            border-width: 0;
        }
        .tab-plugin-name {
            display: inline-block;
            vertical-align: middle;
            width: 120px;
            height: 30px;
            line-height: 30px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .tab-box {
            width: 100%;
            height: 100%;
        }
    }
    .add-plugin-btn {
        width: 220px;
        margin: 13px 10px;
    }
    /deep/.el-tabs__content {
        width: 100%;
        height: calc(100% - 40px);
        .el-tab-pane {
            width: 100%;
            height: 100%;
        }
    }
    .no-plugin {
        width: 100%;
        height: calc(100% - 100px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .null-img {
            width: 92px;
            height: 102px;
            background: url('../../../assets/plugin/empty.svg');
            background-position: center;
        }
        .null-img-word {
            margin-top: 23px;
            opacity: 0.47;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #44527c;
        }
    }

    /deep/.plugin-dialog {
        width: 440px;
        background: #ffffff;
        border: 1px solid #cccccc;
        border-radius: 4px;
        border-radius: 4px;

        .el-dialog__headerbtn {
            top: 25px;
            right: 24px;
            .el-dialog__close {
                color: #44527c;
                font-size: 20px;
            }
        }
        .el-dialog__header {
            padding: 20px 12px 15px 12px;
            border-bottom: 1px solid #e6e6e6;
        }
        .el-dialog__title {
            font-family: PingFangSC-Regular;
            font-size: 20px;
            color: #44527c;
        }
        .el-dialog__body {
            padding: 14px 24px;
        }
        .el-form-item__label {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #666666;
            line-height: 14px;
        }
        .el-form-item {
            margin-bottom: 0px;
        }
        .el-form-item__content {
            line-height: 50px;
        }
        .el-input__inner {
            height: 28px;
            line-height: 28px;
            font-family: OpenSans;
            font-size: 12px;
            color: #44527c;
            padding: 0 8px;
        }
        .el-select {
            float: right;
            width: 100%;
        }
        .el-dialog__footer {
            padding: 0px;
        }
        .upload-demo {
            margin-top: 12px;
        }
        .item-type {
            margin-left: 15px;
        }
        .dialog-footer {
            padding: 20px 24px 28px 0px;
            .createLabel {
                width: 80px;
                height: 28px;
                line-height: 0px;
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #ffffff;
                background: #3e8cf6;
                border-radius: 4px;
                border-radius: 4px;
            }
            .cancelPlugin {
                width: 80px;
                height: 28px;
                line-height: 0px;
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #44527c;
                background: #ffffff;
                border: 1px solid #cccccc;
                border-radius: 4px;
                border-radius: 4px;
            }
        }
        .el-textarea {
            margin-top: 10px;
            margin-bottom: 10px;
        }
        .helpIcon {
            width: 14px;
            height: 14px;
            margin-left: 55px;
            background-size: 100%;
            background-image: url('../../../assets/plugin/help_normal.svg');
            position: relative;
            span {
                font-size: 12px;
                position: absolute;
                z-index: 88;
                top: 0px;
                left: 22px;
                width: 140px;
                height: 22px;
                line-height: 22px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 5;
                background: rgba(239, 240, 246, 0.6);
            }
        }
    }
}
</style>
