<template>
    <div class="local-cypher">
        <div class="local-cypher-title">
            <div>Cypher 收藏夹</div>
            <i class="el-icon-close" @click="closeLocalCypher"></i>
        </div>
        <div class="local-cypher-filter">
            <el-input type="text" size="small" v-model="text" @change="changeText"></el-input>
            <el-button size="small" @click="filterLocalCypher">筛选</el-button>
        </div>
        <div>
            <el-collapse>
                <el-collapse-item v-for="(item, index) in localCypherList" :key="item.name">
                    <template slot="title">
                        <div class="el-collapse-item-title">
                            <span>{{ item.name }}</span>
                            <i class="el-icon-delete" @click.self.stop="deletCypher(item.name, index)">删除</i>
                        </div>
                    </template>
                    <div class="cypher-item">
                        <el-tooltip class="item" effect="light" content="复制" placement="left">
                            <i class="el-icon-document-copy" @click.stop="copy(item.value)"></i>
                        </el-tooltip>
                        {{ item.value }}
                    </div>
                    <div>
                        备注：
                        <div class="el-collapse-item-ps">
                            {{ item.ps }}
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { copyToClipboardAsync } from '@/core/uitls'
@Component({
    components: {}
})
export default class Inputformat extends Vue {
    localCypherList: any[] = []
    text: string = ''

    created() {}
    mounted() {
        let localCypherList
        if (localStorage.LOCALCYPHERLIST) {
            localCypherList = JSON.parse(localStorage.LOCALCYPHERLIST)
        } else {
            localCypherList = []
        }
        this.localCypherList = localCypherList
    }
    closeLocalCypher() {
        this.$emit('update:isShowLocalCypher', false)
    }
    deletCypher(name, i) {
        let localCypherList = localStorage.LOCALCYPHERLIST ? JSON.parse(localStorage.LOCALCYPHERLIST) : []
        let index = localCypherList.findIndex((item) => item.name === name)
        localCypherList.splice(index, 1)
        this.localCypherList.splice(i, 1)
        localStorage.LOCALCYPHERLIST = JSON.stringify(localCypherList)
    }
    filterLocalCypher() {
        let localCypherList = localStorage.LOCALCYPHERLIST ? JSON.parse(localStorage.LOCALCYPHERLIST) : []
        this.localCypherList = localCypherList.filter((item) => item.name.includes(this.text) || item.ps.includes(this.text))
    }
    changeText() {
        if (!this.text) {
            let localCypherList = localStorage.LOCALCYPHERLIST ? JSON.parse(localStorage.LOCALCYPHERLIST) : []
            this.localCypherList = localCypherList
        }
    }
    async copy(val) {
        let res = await copyToClipboardAsync(val)
        if (res.text === 'ok') {
            this.$message({
                message: '复制成功',
                type: 'success'
            })
        } else {
            this.$message({
                message: res.text,
                type: 'warning'
            })
        }
    }
}
</script>
<style lang="less" scoped>
.local-cypher {
    width: 100%;
    height: 100%;
    padding: 10px;
    overflow: auto;
    .local-cypher-title {
        font-family: OpenSans;
        font-size: 24px;
        color: #44527c;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        i {
            cursor: pointer;
        }
    }
    .local-cypher-filter {
        display: flex;
        margin-bottom: 10px;
        > .el-input {
            margin-right: 10px;
        }
    }
    .el-collapse-item-title {
        width: 100%;
        > span {
            max-width: 50%;
            overflow: hidden;
            margin-right: 30px;
        }
    }
    .el-collapse-item-ps {
        color: #aaaaaa;
    }
    .el-icon-document-copy {
        font-size: 16px;
        margin-right: 5px;
        cursor: pointer;
    }
    .cypher-item {
        min-height: 40px;
        background: #f3f4f8;
        padding: 12px 12px;
        line-height: 20px;
        border-radius: 4px;
        border-radius: 4px;
        box-sizing: border-box;
        border: 1px solid transparent;
        font-size: 12px;
        &.do-click {
            cursor: pointer;
        }
    }
    .cm-keyword {
        color: #708;
    }
    .cm-atom {
        color: #219;
    }
    .cm-string {
        color: #a11;
    }
    .cm-def {
        color: #00f;
    }
}
</style>
