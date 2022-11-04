<i18n src="./quick-start-lang.json"></i18n>
<template>
    <div class="main-text-quick-start">
        <div class="firstTitle">{{ $t('t1') }}</div>
        <section>
            {{ $t('t2') }}
        </section>
        <div class="secondTitle">
            {{ $t('t3') }}
        </div>
        <section>
            {{ $t('t4') }}
        </section>
        <el-button class="createButton" :loading="labelLoading" @click="confirmCreateLabel">
            {{ $t('t5') }}
        </el-button>
        <div class="secondTitle">
            {{ $t('t6') }}
        </div>
        <section>
            {{ $t('t7') }}
        </section>
        <el-button class="createButton" :loading="dataLoading" @click="confirmCreateData">
            {{ $t('t8') }}
        </el-button>
        <div class="secondTitle">
            {{ $t('t9') }}
        </div>
        <section>
            {{ $t('t10') }}
        </section>
        <div class="secondTitle">
            {{ $t('t11') }}
        </div>
        <section>
            {{ $t('t12') }}
        </section>
        <el-button class="createButton" :loading="pluginLoading" @click="pluginCreateData">
            {{ $t('t13') }}
        </el-button>
        <section>
            {{ $t('t14') }}
        </section>
        <section style="margin-bottom:60px">
            <hr />
            <span style="font-size:12px"><sup>1</sup>&nbsp;&nbsp;{{ $t('t15') }}</span
            ><a href="http://www.mpi-inf.mpg.de/departments/databases-and-information-systems/research/yago-naga/yago/" target="_blank"
                >http://www.mpi-inf.mpg.de/departments/databases-and-information-systems/research/yago-naga/yago/</a
            >
        </section>
    </div>
</template>

<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { component } from 'vue/types/umd'
import HelpStore from '@/store/help/help'
import { getModule } from 'vuex-module-decorators'
import SubGraphManage from '@/store/subgraph-manage/subgraph-manage'
// import demos from '@/assets/demo-data/index'

@Component
export default class QuickStart extends Vue {
    pluginLoading: boolean = false
    labelLoading: boolean = false
    dataLoading: boolean = false
    helpStore: HelpStore = getModule(HelpStore, store)
    subGraphManage: SubGraphManage = getModule(SubGraphManage, store)
    demos: any[] = []
    created() {
        import('../../../components/scene/config').then((res) => {
            res.default.forEach((item: any) => {
                // 0是正在创建，1是已完成创建
                item.status = 0
                item.active = -1
                item.steps = [
                    {
                        icon: '',
                        status: '',
                        text: '创建子图'
                    },
                    {
                        icon: '',
                        status: '',
                        text: '创建模型'
                    },
                    {
                        icon: '',
                        status: '',
                        text: '加载数据'
                    },
                    {
                        icon: '',
                        status: '',
                        text: '创建完成'
                    }
                ]
            })
            this.demos = res.default
        })
    }
    get graphName() {
        return this.subGraphManage.selectedSubGraph
    }
    async confirmCreateLabel() {
        let creaeteLabelScripts = this.demos[0].createLabelScript
        let res = await this.helpStore.createLabels({ graph: this.graphName, scripts: creaeteLabelScripts })
        if (res.status === 'success') {
            this.$message({
                message: '模型创建成功',
                type: 'success'
            })
        } else {
            this.$message({
                message: '模型创建失败:' + res.error_messsage,
                type: 'error'
            })
        }
    }
    async confirmCreateData() {
        let list: any[] = await this.demos[0].data()
        let result = await this.helpStore.createData({ graph: this.graphName, dataList: list })
        if (result && result.status === 'success') {
            this.$message({
                message: '数据生成成功',
                type: 'success'
            })
        } else {
            this.$message({
                message: '数据生成失败:' + result.error_message,
                type: 'error'
            })
        }
    }
    async pluginCreateData() {
        let pluginList = [
            {
                description: `
查询root节点N跳邻居节点的个数
输入参数示例：
    {
        "label":"person",
        "field":"id",
        "root":15,
        "depth":1
    }`,
                name: 'khop',
                read_only: true,
                code_type: 'cpp',
                code_base64:
                    'Ci8qIENvcHlyaWdodCAoYykgMjAyMiBBbnRHcm91cC4gQWxsIFJpZ2h0cyBSZXNlcnZlZC4gKi8KCi8qCiAqIFJldHVybnMgdGhlIG51bWJlciBvZiB2ZXJ0aWNlcyBpbiB0aGUgay10aCBsYXllcgogKiBhY2NvcmRpbmcgdG8gdGhlIGdpdmVuIHZlcnRleC4KICovCiNpbmNsdWRlIDxpb3N0cmVhbT4KI2luY2x1ZGUgPHZlY3Rvcj4KI2luY2x1ZGUgPHVub3JkZXJlZF9zZXQ+CgojaW5jbHVkZSAibGdyYXBoL2xncmFwaC5oIgojaW5jbHVkZSAibGdyYXBoL2xncmFwaF90cmF2ZXJzYWwuaCIKI2luY2x1ZGUgInRvb2xzL2pzb24uaHBwIgoKdXNpbmcganNvbiA9IG5sb2htYW5uOjpqc29uOwp1c2luZyBuYW1lc3BhY2UgbGdyYXBoX2FwaTsKCmNsYXNzIFVub3JkZXJlZFBhcmFsbGVsQml0c2V0IHsKIHB1YmxpYzoKICAgIHNpemVfdCBzaXplXzsKICAgIHNpemVfdCBwYXJhbGxlbF9iaXRzZXRfc2l6ZV87CiAgICBzaXplX3QgdGhyZXNob2xkX3NpemVfOwogICAgYm9vbCB1c2VfdW5vcmRlcmVkX3NldF87CiAgICBzdGQ6OnNoYXJlZF9wdHI8b2xhcDo6UGFyYWxsZWxCaXRzZXQ+IHBhcmFsbGVsX2JpdHNldF92aXNpdGVkXzsKICAgIHN0ZDo6dW5vcmRlcmVkX3NldDxpbnQ2NF90PiB1bm9yZGVyZWRfc2V0X3Zpc2l0ZWRfOwoKICAgIFVub3JkZXJlZFBhcmFsbGVsQml0c2V0KHNpemVfdCBwYXJhbGxlbF9iaXRzZXRfc2l6ZSwgc2l6ZV90IHRocmVzaG9sZF9zaXplKSB7CiAgICAgICAgc2l6ZV8gPSAwOwogICAgICAgIHBhcmFsbGVsX2JpdHNldF9zaXplXyA9IHBhcmFsbGVsX2JpdHNldF9zaXplOwogICAgICAgIHRocmVzaG9sZF9zaXplXyA9IHRocmVzaG9sZF9zaXplOwogICAgICAgIHVzZV91bm9yZGVyZWRfc2V0XyA9IHRydWU7CiAgICB9CgogICAgflVub3JkZXJlZFBhcmFsbGVsQml0c2V0KCkge30KCiAgICBib29sIEhhcyhpbnQ2NF90IHZpZCkgewogICAgICAgIGlmICh1c2VfdW5vcmRlcmVkX3NldF8pIHsKICAgICAgICAgICAgcmV0dXJuIHVub3JkZXJlZF9zZXRfdmlzaXRlZF8uZmluZCh2aWQpICE9IHVub3JkZXJlZF9zZXRfdmlzaXRlZF8uZW5kKCk7CiAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgcmV0dXJuIHBhcmFsbGVsX2JpdHNldF92aXNpdGVkXy0+SGFzKHZpZCk7CiAgICAgICAgfQogICAgfQoKICAgIGJvb2wgQWRkKGludDY0X3QgdmlkKSB7CiAgICAgICAgaWYgKHVzZV91bm9yZGVyZWRfc2V0XyAmJiBzaXplXyA+PSB0aHJlc2hvbGRfc2l6ZV8pIHsKICAgICAgICAgICAgdXNlX3Vub3JkZXJlZF9zZXRfID0gZmFsc2U7CiAgICAgICAgICAgIHN0ZDo6c2hhcmVkX3B0cjxvbGFwOjpQYXJhbGxlbEJpdHNldD4gcHRyXygKICAgICAgICAgICAgICAgIG5ldyBvbGFwOjpQYXJhbGxlbEJpdHNldChwYXJhbGxlbF9iaXRzZXRfc2l6ZV8pKTsKICAgICAgICAgICAgcGFyYWxsZWxfYml0c2V0X3Zpc2l0ZWRfID0gcHRyXzsKICAgICAgICAgICAgZm9yIChhdXRvIGl0ZXIgPSB1bm9yZGVyZWRfc2V0X3Zpc2l0ZWRfLmJlZ2luKCk7IGl0ZXIgIT0gdW5vcmRlcmVkX3NldF92aXNpdGVkXy5lbmQoKTsKICAgICAgICAgICAgICAgICArK2l0ZXIpIHsKICAgICAgICAgICAgICAgIHBhcmFsbGVsX2JpdHNldF92aXNpdGVkXy0+QWRkKCppdGVyKTsKICAgICAgICAgICAgfQogICAgICAgIH0KICAgICAgICBpZiAodXNlX3Vub3JkZXJlZF9zZXRfKSB7CiAgICAgICAgICAgIHVub3JkZXJlZF9zZXRfdmlzaXRlZF8uZW1wbGFjZSh2aWQpOwogICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgIHBhcmFsbGVsX2JpdHNldF92aXNpdGVkXy0+QWRkKHZpZCk7CiAgICAgICAgfQogICAgICAgIHNpemVfICs9IDE7CiAgICAgICAgcmV0dXJuIHRydWU7CiAgICB9CgogICAgdm9pZCBDbGVhcigpIHsKICAgICAgICBpZiAodXNlX3Vub3JkZXJlZF9zZXRfKSB7CiAgICAgICAgICAgIHVub3JkZXJlZF9zZXRfdmlzaXRlZF8uY2xlYXIoKTsKICAgICAgICB9IGVsc2UgewogICAgICAgICAgICBwYXJhbGxlbF9iaXRzZXRfdmlzaXRlZF8tPkNsZWFyKCk7CiAgICAgICAgfQogICAgICAgIHNpemVfID0gMDsKICAgIH0KfTsKCmV4dGVybiAiQyIgYm9vbCBQcm9jZXNzKEdyYXBoREImIGRiLCBjb25zdCBzdGQ6OnN0cmluZyYgcmVxdWVzdCwgc3RkOjpzdHJpbmcmIHJlc3BvbnNlKSB7CiAgICBkb3VibGUgc3RhcnRfdGltZTsKCiAgICAvLyBwcmVwYXJlCiAgICBzdGFydF90aW1lID0gZ2V0X3RpbWUoKTsKICAgIGludDY0X3Qgcm9vdCA9IDA7CiAgICBzaXplX3QgZGVwdGggPSAzOwogICAgc3RkOjpzdHJpbmcgbGFiZWwgPSAibm9kZSI7CiAgICBzdGQ6OnN0cmluZyBmaWVsZCA9ICJpZCI7CiAgICBzaXplX3QgdGhyZXNob2xkX3NpemUgPSAxMDAwMDsKICAgIGJvb2wgaGFzX2R1cGxpY2F0ZV9lZGdlID0gZmFsc2U7CiAgICBib29sIG11bHRpX3RocmVhZHMgPSB0cnVlOwogICAgdHJ5IHsKICAgICAgICBqc29uIGlucHV0ID0ganNvbjo6cGFyc2UocmVxdWVzdCk7CiAgICAgICAgaWYgKGlucHV0WyJyb290Il0uaXNfbnVtYmVyKCkpIHsKICAgICAgICAgICAgcm9vdCA9IGlucHV0WyJyb290Il0uZ2V0PGludDY0X3Q+KCk7CiAgICAgICAgfQogICAgICAgIGlmIChpbnB1dFsiZGVwdGgiXS5pc19udW1iZXIoKSkgewogICAgICAgICAgICBkZXB0aCA9IGlucHV0WyJkZXB0aCJdLmdldDxpbnQ2NF90PigpOwogICAgICAgIH0KICAgICAgICBpZiAoaW5wdXRbImxhYmVsIl0uaXNfc3RyaW5nKCkpIHsKICAgICAgICAgICAgbGFiZWwgPSBpbnB1dFsibGFiZWwiXS5nZXQ8c3RkOjpzdHJpbmc+KCk7CiAgICAgICAgfQogICAgICAgIGlmIChpbnB1dFsiZmllbGQiXS5pc19zdHJpbmcoKSkgewogICAgICAgICAgICBmaWVsZCA9IGlucHV0WyJmaWVsZCJdLmdldDxzdGQ6OnN0cmluZz4oKTsKICAgICAgICB9CiAgICAgICAgaWYgKGlucHV0WyJ0aHJlc2hvbGRfc2l6ZSJdLmlzX251bWJlcigpKSB7CiAgICAgICAgICAgIHRocmVzaG9sZF9zaXplID0gaW5wdXRbInRocmVzaG9sZF9zaXplIl0uZ2V0PHNpemVfdD4oKTsKICAgICAgICB9CiAgICAgICAgaWYgKGlucHV0WyJoYXNfZHVwbGljYXRlX2VkZ2UiXS5pc19ib29sZWFuKCkpIHsKICAgICAgICAgICAgaGFzX2R1cGxpY2F0ZV9lZGdlID0gaW5wdXRbImhhc19kdXBsaWNhdGVfZWRnZSJdLmdldDxib29sPigpOwogICAgICAgIH0KICAgICAgICBpZiAoaW5wdXRbIm11bHRpX3RocmVhZHMiXS5pc19ib29sZWFuKCkpIHsKICAgICAgICAgICAgbXVsdGlfdGhyZWFkcyA9IGlucHV0WyJtdWx0aV90aHJlYWRzIl0uZ2V0PGJvb2w+KCk7CiAgICAgICAgfQogICAgfSBjYXRjaCAoc3RkOjpleGNlcHRpb24mIGUpIHsKICAgICAgICBzdGQ6OmNvdXQgPDwgZS53aGF0KCkgPDwgc3RkOjplbmRsOwogICAgICAgIHN0ZDo6Y291dCA8PCAicmVxdWVzdDogIiA8PCByZXF1ZXN0IDw8IHN0ZDo6ZW5kbDsKICAgICAgICB0aHJvdyBzdGQ6OnJ1bnRpbWVfZXJyb3IoZS53aGF0KCkpOwogICAgfQoKICAgIHNpemVfdCBzaXplID0gMDsKICAgIGF1dG8gdHhuID0gZGIuQ3JlYXRlUmVhZFR4bigpOwogICAgc2l6ZV90IHZlcnRleF9sYWJlbF9pZCA9IHR4bi5HZXRWZXJ0ZXhMYWJlbElkKGxhYmVsKTsKICAgIHNpemVfdCB2ZXJ0ZXhfZmllbGRfaWQgPSB0eG4uR2V0VmVydGV4RmllbGRJZCh2ZXJ0ZXhfbGFiZWxfaWQsIGZpZWxkKTsKCiAgICBhdXRvIHJvb3RfaXRlciA9CiAgICAgICAgdHhuLkdldFZlcnRleEluZGV4SXRlcmF0b3IodmVydGV4X2xhYmVsX2lkLAogICAgICAgICAgICAgICAgdmVydGV4X2ZpZWxkX2lkLCBGaWVsZERhdGEocm9vdCksIEZpZWxkRGF0YShyb290KSk7CiAgICBpbnQ2NF90IHZlcnRleF9pZDsKICAgIGlmIChyb290X2l0ZXIuSXNWYWxpZCgpKSB7CiAgICAgICAgdmVydGV4X2lkID0gcm9vdF9pdGVyLkdldFZpZCgpOwogICAgfSBlbHNlIHsKICAgICAgICBqc29uIG91dHB1dDsKICAgICAgICBvdXRwdXRbInNpemUiXSA9IDA7CiAgICAgICAgcmVzcG9uc2UgPSBvdXRwdXQuZHVtcCgpOwogICAgICAgIHJldHVybiB0cnVlOwogICAgfQogICAgYXV0byBwcmVwYXJlX2Nvc3QgPSBnZXRfdGltZSgpIC0gc3RhcnRfdGltZTsKCiAgICAvLyBjb3JlCiAgICBzdGFydF90aW1lID0gZ2V0X3RpbWUoKTsKICAgIGlmIChtdWx0aV90aHJlYWRzKSB7CiAgICAgICAgYXV0byBmcm9udGllclRyYXZlcnNhbCA9IHRyYXZlcnNhbDo6RnJvbnRpZXJUcmF2ZXJzYWwoZGIsIHR4biwgMSk7CiAgICAgICAgZnJvbnRpZXJUcmF2ZXJzYWwuU2V0RnJvbnRpZXIodmVydGV4X2lkKTsKICAgICAgICBmb3IgKHNpemVfdCBpID0gMDsgaSA8IGRlcHRoOyArK2kpIHsKICAgICAgICAgICAgZnJvbnRpZXJUcmF2ZXJzYWwuUmVzZXRWaXNpdGVkKCk7CiAgICAgICAgICAgIGZyb250aWVyVHJhdmVyc2FsLkV4cGFuZE91dEVkZ2VzKCk7CiAgICAgICAgfQogICAgICAgIGF1dG8mIHB2ID0gZnJvbnRpZXJUcmF2ZXJzYWwuR2V0RnJvbnRpZXIoKTsKICAgICAgICBzaXplID0gcHYuU2l6ZSgpOwogICAgfSBlbHNlIHsKICAgICAgICBzaXplX3QgbnVtX3ZlcnRpY2VzID0gdHhuLkdldE51bVZlcnRpY2VzKCk7CiAgICAgICAgc3RkOjp2ZWN0b3I8aW50NjRfdD4gc3JjX3ZlcnRleHM7CiAgICAgICAgc3JjX3ZlcnRleHMucHVzaF9iYWNrKHZlcnRleF9pZCk7CiAgICAgICAgc3RkOjp2ZWN0b3I8aW50NjRfdD4gZHN0X3ZlcnRleHM7CiAgICAgICAgYXV0byB2aXQgPSB0eG4uR2V0VmVydGV4SXRlcmF0b3IoKTsKICAgICAgICBVbm9yZGVyZWRQYXJhbGxlbEJpdHNldCB2aXNpdGVkKG51bV92ZXJ0aWNlcywgdGhyZXNob2xkX3NpemUpOwogICAgICAgIGZvciAoc2l6ZV90IGkgPSAwOyBpIDwgZGVwdGg7ICsraSkgewogICAgICAgICAgICBmb3IgKGF1dG8gdmlkIDogc3JjX3ZlcnRleHMpIHsKICAgICAgICAgICAgICAgIHZpdC5Hb3RvKHZpZCk7CiAgICAgICAgICAgICAgICBmb3IgKGF1dG8gZWl0ID0gdml0LkdldE91dEVkZ2VJdGVyYXRvcigpOyBlaXQuSXNWYWxpZCgpOyBlaXQuTmV4dCgpKSB7CiAgICAgICAgICAgICAgICAgICAgaW50NjRfdCBkc3QgPSBlaXQuR2V0RHN0KCk7CiAgICAgICAgICAgICAgICAgICAgaWYgKChpID09IDAgJiYgIWhhc19kdXBsaWNhdGVfZWRnZSkgfHwKICAgICAgICAgICAgICAgICAgICAgICAgKCF2aXNpdGVkLkhhcyhkc3QpICYmIHZpc2l0ZWQuQWRkKGRzdCkpKSB7CiAgICAgICAgICAgICAgICAgICAgICAgIGRzdF92ZXJ0ZXhzLnB1c2hfYmFjayhkc3QpOwogICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgfQogICAgICAgICAgICBzdGQ6OnN3YXAoc3JjX3ZlcnRleHMsIGRzdF92ZXJ0ZXhzKTsKICAgICAgICAgICAgZHN0X3ZlcnRleHMuY2xlYXIoKTsKICAgICAgICAgICAgdmlzaXRlZC5DbGVhcigpOwogICAgICAgIH0KICAgICAgICBzaXplID0gc3JjX3ZlcnRleHMuc2l6ZSgpOwogICAgfQogICAgYXV0byBjb3JlX2Nvc3QgPSBnZXRfdGltZSgpIC0gc3RhcnRfdGltZTsKCiAgICBqc29uIG91dHB1dDsKICAgIG91dHB1dFsic2l6ZSJdID0gc2l6ZTsKICAgIG91dHB1dFsicHJlcGFyZV9jb3N0Il0gPSBwcmVwYXJlX2Nvc3Q7CiAgICBvdXRwdXRbImNvcmVfY29zdCJdID0gY29yZV9jb3N0OwogICAgb3V0cHV0WyJ0b3RhbF9jb3N0Il0gPSBwcmVwYXJlX2Nvc3QgKyBjb3JlX2Nvc3Q7CiAgICByZXNwb25zZSA9IG91dHB1dC5kdW1wKCk7CiAgICByZXR1cm4gdHJ1ZTsKfQoK'
            },
            {
                description: `计算当前节点总数`,
                name: 'scan_edges',
                read_only: true,
                code_type: 'py',
                code_base64:
                    'IyEvYmluL3B5dGhvbgoKaW1wb3J0IGpzb24KCmRlZiBQcm9jZXNzKGRiLCBpbnB1dCk6CiAgICBzY2FuX2VkZ2VzID0gRmFsc2UKICAgIHRyeToKICAgICAgICBwYXJhbSA9IGpzb24ubG9hZHMoaW5wdXQpCiAgICAgICAgc2Nhbl9lZGdlcyA9IHBhcmFtWydzY2FuX2VkZ2VzJ10KICAgIGV4Y2VwdDoKICAgICAgICBwYXNzCiAgICB0eG4gPSBkYi5DcmVhdGVSZWFkVHhuKCkKICAgIG51bV92ZXJ0aWNlcyA9IDAKICAgIG51bV9lZGdlcyA9IDAKICAgIHZpdCA9IHR4bi5HZXRWZXJ0ZXhJdGVyYXRvcigpCiAgICB3aGlsZSB2aXQuSXNWYWxpZCgpOgogICAgICAgIG51bV92ZXJ0aWNlcyArPSAxCiAgICAgICAgaWYgc2Nhbl9lZGdlczoKICAgICAgICAgICAgZWl0ID0gdml0LkdldE91dEVkZ2VJdGVyYXRvcigpCiAgICAgICAgICAgIHdoaWxlIGVpdC5Jc1ZhbGlkKCk6CiAgICAgICAgICAgICAgICBudW1fZWRnZXMgKz0gMQogICAgICAgICAgICAgICAgZWl0Lk5leHQoKQogICAgICAgIHZpdC5OZXh0KCkKICAgIG91dHB1dCA9IHsibnVtX3ZlcnRpY2VzIjpudW1fdmVydGljZXN9CiAgICBpZiBzY2FuX2VkZ2VzOgogICAgICAgIG91dHB1dFsibnVtX2VkZ2VzIl0gPSBudW1fZWRnZXMKICAgIHJldHVybiAoVHJ1ZSwganNvbi5kdW1wcyhvdXRwdXQpKQo='
            }
        ]
        let result = await this.helpStore.createPlugins({ graph: this.graphName, datalist: pluginList })
        if (result && result.status === 'success') {
            this.$message({
                message: '插件创建成功',
                type: 'success'
            })
        } else {
            this.$message({
                dangerouslyUseHTMLString: true,
                message: result.errors.join('<br />'),
                type: 'error'
            })
        }
    }
}
</script>

<style lang="less" scope>
.main-text-quick-start {
    font-family: MicrosoftYaHei;
    font-size: 14px;
    color: #052c57;
    line-height: 28px;
    .firstTitle {
        margin-top: 55px;
        margin-bottom: 40px;
        font-family: MicrosoftYaHei-Bold;
        font-size: 32px;
        color: #052c57;
    }
    .secondTitle {
        margin-bottom: 12px;
        font-family: MicrosoftYaHei-Bold;
        font-size: 18px;
        color: #052c57;
        line-height: 28px;
    }
    .createButton {
        width: 250px;
        height: 40px;
        margin-bottom: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #3e8cf6;
        border-radius: 20px;
        border-radius: 20px;
        font-family: MicrosoftYaHei-Bold;
        font-size: 14px;
        color: #ffffff;
        cursor: pointer;
    }
    .createButton:hover {
        background: #2a70cf;
        border-radius: 20px;
        border-radius: 20px;
    }
}
</style>
