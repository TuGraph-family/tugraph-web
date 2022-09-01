<template>
    <div class="inputformat-component" :class="theme" :title="`类型：${data.type}`">
        <template v-if="!data">
            <h3>data必须是一个Object，例：{name:'Tom',type:'STRING'}</h3>
        </template>
        <template v-else>
            <template v-if="data.type === 'STRING'">
                <el-input :disabled="disabled" v-model="dataValue" @change="handleChange"></el-input>
            </template>
            <template v-if="numberList.includes(data.type)">
                <el-input-number :disabled="disabled" v-model="dataValue" @change="handleChange"></el-input-number>
            </template>
            <template v-if="data.type === 'BOOL'">
                <el-select :disabled="disabled" v-model="dataValue" placeholder="请选择" @change="handleChange">
                    <el-option label="TRUE" :value="true"></el-option>
                    <el-option label="FALSE" :value="false"></el-option>
                </el-select>
            </template>
            <template v-if="data.type === 'DATE'">
                <el-date-picker :disabled="disabled" v-model="dataValue" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" @change="handleChange"> </el-date-picker>
            </template>
            <template v-if="data.type === 'DATETIME'">
                <el-date-picker :disabled="disabled" v-model="dataValue" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" @change="handleChange"></el-date-picker>
            </template>
            <template v-if="data.type === 'BLOB'">
                <el-upload :disabled="disabled" class="upload-demo" action="/" :before-upload="beforeUpload" :show-file-list="false">
                    <div class="choose-file-btn">
                        选择文件 <i @click.stop="clearFile" class="el-icon-circle-close" v-if="dataValue && !disabled"></i>
                        <i class="el-icon-document-checked" v-if="dataValue" @click.stop="showContent"></i>
                        <i class="el-icon-edit" v-if="editOnline && !disabled" @click.stop="showDig"></i>
                    </div>
                </el-upload>
            </template>
        </template>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

interface Data {
    value: string
    type: string
}
@Component({
    components: {}
})
export default class Inputformat extends Vue {
    @Prop(Object) data!: Data
    @Prop(Boolean) editOnline!: false
    @Prop(Boolean) disabled!: false
    @Prop({ type: String, default: 'default' }) theme!: string
    dataValue: any = null
    numberList: Array<String> = ['INT8', 'INT16', 'INT32', 'INT64', 'DOUBLE', 'FLOAT']
    dialogTableVisible: boolean = false
    mounted() {
        this.dataValue = this.data.value
        if (this.numberList.includes(this.data.type) && (this.dataValue === '' || this.dataValue === null)) {
            let obj = { ...this.data, value: 0, type: this.data.type }
            this.$emit('update:data', obj)
        }
        if (this.data.type === 'BOOL') {
            let obj = { ...this.data, value: true, type: this.data.type }
            this.$emit('update:data', obj)
        }
    }
    @Watch('data', { deep: true })
    updateData(n: any, o: any) {
        this.dataValue = n.value
    }
    @Watch('dataValue', { deep: true })
    updateDataValue(n: any, o: any) {
        // if (o || o === '' || o === false || o === 0) {
        // }
        this.dataValue = n
        this.$emit('change')
    }
    async beforeUpload(file: any) {
        var reader = new FileReader()
        reader.readAsText(file)
        let res = await new Promise((resolve) => {
            reader.onload = function(e) {
                let content = this.result
                content = (content as string).replace(/%/g, '%25')
                content = encodeURIComponent(content)
                content = btoa(content)

                resolve(content)
            }
        })
        this.dataValue = res
        this.handleChange(this.dataValue)
        return Promise.reject()
    }
    handleChange(data: any) {
        let obj = { ...this.data, value: data, type: this.data.type }
        this.$emit('update:data', obj)
    }
    clearFile() {
        this.dataValue = null
        let obj = { ...this.data, value: '', type: this.data.type }
        this.$emit('update:data', obj)
    }
    showDig() {
        this.dialogTableVisible = true
    }
    showContent() {
        let content = ''
        this.dataValue && (content = atob(this.dataValue))
        // console.log(content)
    }
}
</script>
<style lang="less" scoped>
.inputformat-component {
    width: 100%;
    height: 100%;

    > div {
        width: 100%;
        height: 100%;
    }
    /deep/.el-input,
    /deep/.el-select,
    /deep/.el-input-number,
    /deep/.el-date-editor,
    /deep/.el-upload {
        width: 100%;
        height: 100%;
        font-size: 10px;
        line-height: unset;
        border: 1px solid #dcdfe6;
        border-radius: 5px;
        overflow: hidden;
        background-color: #ffffff;
        .el-input {
            border: 0;
        }
        .el-input-number__decrease,
        .el-input-number__increase {
            width: 20px;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            top: 0;
        }
        .el-input-number__increase {
            right: 0;
        }
        .el-input-number__decrease {
            left: 0;
        }
        .el-input__prefix {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .el-input__icon {
            line-height: unset;
        }
        overflow: hidden;
    }
    /deep/.el-input-number {
        input {
            padding: 0 20px;
        }
    }
    .choose-file-btn {
        color: #666666;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        > .el-icon-circle-close {
            position: relative;
            top: 1px;
            left: 5px;
            z-index: 99;
            &:hover {
                color: #3691f2;
            }
        }
        > .el-icon-document-checked {
            position: absolute;
            right: -1px;
            top: 0;
            color: #3691f2;
            font-size: 14px;
            cursor: pointer;
        }
        > .el-icon-edit {
            position: absolute;
            top: 50%;
            left: 5px;
            transform: translateY(-50%);
            z-index: 99;
            font-size: 16px;
            &:hover {
                color: #3691f2;
            }
        }
    }
    /deep/input {
        width: 100%;
        height: 100%;
        outline: 0;
        border: 0;
        box-sizing: border-box;
    }
    .python-modal {
        /deep/.el-dialog {
            width: 800px;
        }
        /deep/.el-dialog__header {
            display: none;
        }
        /deep/.el-dialog__body {
            padding: 0;
            width: 65%;
            min-width: 800px;
        }
        .dialog-container {
            width: 100%;
            height: 500px;
        }
    }
}
.inputformat-component.dark {
    .python-modal {
        // /deep/.el-dialog {
        //     width: 800px;
        // }
        // /deep/.el-dialog__header {
        //     display: none;
        // }
        /deep/.el-dialog__body {
            background: #5b5e6a;
        }
        .dialog-container {
            width: 100%;
            height: 500px;
        }
    }
}
</style>
