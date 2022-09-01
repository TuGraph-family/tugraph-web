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
                    'I2luY2x1ZGUgImxncmFwaC9sZ3JhcGguaCIKI2luY2x1ZGUgImxncmFwaC9sZ3JhcGhfb2xhcC5oIgojaW5jbHVkZSAibGdyYXBoL2xncmFwaF90cmF2ZXJzYWwuaCIKCiNpbmNsdWRlICJqc29uLmhwcCIKCiNpbmNsdWRlIDxpb3N0cmVhbT4KI2luY2x1ZGUgPHZlY3Rvcj4KI2luY2x1ZGUgPHVub3JkZXJlZF9zZXQ+Cgp1c2luZyBqc29uID0gbmxvaG1hbm46Ompzb247Cgp1c2luZyBuYW1lc3BhY2UgbGdyYXBoX2FwaTsKCmNsYXNzIFVub3JkZXJlZFBhcmFsbGVsQml0c2V0IHsKcHVibGljOgogICAgc2l6ZV90IHNpemVfOwogICAgc2l6ZV90IHBhcmFsbGVsX2JpdHNldF9zaXplXzsKICAgIHNpemVfdCB0aHJlc2hvbGRfc2l6ZV87CiAgICBib29sIHVzZV91bm9yZGVyZWRfc2V0XzsKICAgIHN0ZDo6c2hhcmVkX3B0cjxvbGFwOjpQYXJhbGxlbEJpdHNldD4gcGFyYWxsZWxfYml0c2V0X3Zpc2l0ZWRfOwogICAgc3RkOjp1bm9yZGVyZWRfc2V0PGludDY0X3Q+IHVub3JkZXJlZF9zZXRfdmlzaXRlZF87CgogICAgVW5vcmRlcmVkUGFyYWxsZWxCaXRzZXQoc2l6ZV90IHBhcmFsbGVsX2JpdHNldF9zaXplLCBzaXplX3QgdGhyZXNob2xkX3NpemUpIHsKICAgICAgICBzaXplXyA9IDA7CiAgICAgICAgcGFyYWxsZWxfYml0c2V0X3NpemVfID0gcGFyYWxsZWxfYml0c2V0X3NpemU7CiAgICAgICAgdGhyZXNob2xkX3NpemVfID0gdGhyZXNob2xkX3NpemU7CiAgICAgICAgdXNlX3Vub3JkZXJlZF9zZXRfID0gdHJ1ZTsKICAgIH0KCiAgICB+VW5vcmRlcmVkUGFyYWxsZWxCaXRzZXQoKSB7fQoKICAgIGJvb2wgSGFzKGludDY0X3QgdmlkKSB7CiAgICAgICAgaWYgKHVzZV91bm9yZGVyZWRfc2V0XykgewogICAgICAgICAgICByZXR1cm4gdW5vcmRlcmVkX3NldF92aXNpdGVkXy5maW5kKHZpZCkgIT0gdW5vcmRlcmVkX3NldF92aXNpdGVkXy5lbmQoKTsKICAgICAgICB9IGVsc2UgewogICAgICAgICAgICByZXR1cm4gcGFyYWxsZWxfYml0c2V0X3Zpc2l0ZWRfLT5IYXModmlkKTsKICAgICAgICB9CiAgICB9CgogICAgYm9vbCBBZGQoaW50NjRfdCB2aWQpIHsKICAgICAgICBpZiAodXNlX3Vub3JkZXJlZF9zZXRfICYmIHNpemVfID49IHRocmVzaG9sZF9zaXplXykgewogICAgICAgICAgICB1c2VfdW5vcmRlcmVkX3NldF8gPSBmYWxzZTsKICAgICAgICAgICAgc3RkOjpzaGFyZWRfcHRyPG9sYXA6OlBhcmFsbGVsQml0c2V0PiBwdHJfKG5ldyBvbGFwOjpQYXJhbGxlbEJpdHNldChwYXJhbGxlbF9iaXRzZXRfc2l6ZV8pKTsKICAgICAgICAgICAgcGFyYWxsZWxfYml0c2V0X3Zpc2l0ZWRfID0gcHRyXzsKICAgICAgICAgICAgZm9yKGF1dG8gaXRlciA9IHVub3JkZXJlZF9zZXRfdmlzaXRlZF8uYmVnaW4oKTsgaXRlciAhPSB1bm9yZGVyZWRfc2V0X3Zpc2l0ZWRfLmVuZCgpOyArK2l0ZXIpIHsKICAgICAgICAgICAgICAgIHBhcmFsbGVsX2JpdHNldF92aXNpdGVkXy0+QWRkKCppdGVyKTsKICAgICAgICAgICAgfQogICAgICAgIH0KICAgICAgICBpZiAodXNlX3Vub3JkZXJlZF9zZXRfKSB7CiAgICAgICAgICAgIHVub3JkZXJlZF9zZXRfdmlzaXRlZF8uZW1wbGFjZSh2aWQpOwogICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgIHBhcmFsbGVsX2JpdHNldF92aXNpdGVkXy0+QWRkKHZpZCk7CiAgICAgICAgfQogICAgICAgIHNpemVfICs9IDE7CiAgICAgICAgcmV0dXJuIHRydWU7CiAgICB9CgogICAgdm9pZCBDbGVhcigpIHsKICAgICAgICBpZiAodXNlX3Vub3JkZXJlZF9zZXRfKSB7CiAgICAgICAgICAgIHVub3JkZXJlZF9zZXRfdmlzaXRlZF8uY2xlYXIoKTsKICAgICAgICB9IGVsc2UgewogICAgICAgICAgICBwYXJhbGxlbF9iaXRzZXRfdmlzaXRlZF8tPkNsZWFyKCk7CiAgICAgICAgfQogICAgICAgIHNpemVfID0gMDsKICAgIH0KfTsKCmV4dGVybiAiQyIgYm9vbCBQcm9jZXNzKEdyYXBoREIgJiBkYiwgY29uc3Qgc3RkOjpzdHJpbmcgJiByZXF1ZXN0LCBzdGQ6OnN0cmluZyAmIHJlc3BvbnNlKSB7CiAgICBpbnQ2NF90IHJvb3Q7CiAgICBzaXplX3QgZGVwdGg7CiAgICBzdGQ6OnN0cmluZyBsYWJlbDsKICAgIHN0ZDo6c3RyaW5nIGZpZWxkOwogICAgc2l6ZV90IHRocmVzaG9sZF9zaXplID0gMTAwMDA7CiAgICBib29sIGhhc19kdXBsaWNhdGVfZWRnZSA9IGZhbHNlOwogICAgYm9vbCBtdWx0aV90aHJlYWRzID0gdHJ1ZTsKICAgIHRyeSB7CiAgICAgICAganNvbiBpbnB1dCA9IGpzb246OnBhcnNlKHJlcXVlc3QpOwogICAgICAgIHJvb3QgPSBpbnB1dFsicm9vdCJdLmdldDxpbnQ2NF90PigpOwogICAgICAgIGRlcHRoID0gaW5wdXRbImRlcHRoIl0uZ2V0PHNpemVfdD4oKTsKICAgICAgICBsYWJlbCA9IGlucHV0WyJsYWJlbCJdLmdldDxzdGQ6OnN0cmluZz4oKTsKICAgICAgICBmaWVsZCA9IGlucHV0WyJmaWVsZCJdLmdldDxzdGQ6OnN0cmluZz4oKTsKICAgICAgICBpZiAoaW5wdXRbInRocmVzaG9sZF9zaXplIl0uaXNfbnVtYmVyKCkpIHsKICAgICAgICAgICAgdGhyZXNob2xkX3NpemUgPSBpbnB1dFsidGhyZXNob2xkX3NpemUiXS5nZXQ8c2l6ZV90PigpOwogICAgICAgIH0KICAgICAgICBpZiAoaW5wdXRbImhhc19kdXBsaWNhdGVfZWRnZSJdLmlzX2Jvb2xlYW4oKSkgewogICAgICAgICAgICBoYXNfZHVwbGljYXRlX2VkZ2UgPSBpbnB1dFsiaGFzX2R1cGxpY2F0ZV9lZGdlIl0uZ2V0PGJvb2w+KCk7CiAgICAgICAgfQogICAgICAgIGlmIChpbnB1dFsibXVsdGlfdGhyZWFkcyJdLmlzX2Jvb2xlYW4oKSkgewogICAgICAgICAgICBtdWx0aV90aHJlYWRzID0gaW5wdXRbIm11bHRpX3RocmVhZHMiXS5nZXQ8Ym9vbD4oKTsKICAgICAgICB9CiAgICB9IGNhdGNoIChzdGQ6OmV4Y2VwdGlvbiAmIGUpIHsKICAgICAgICBzdGQ6OmNvdXQgPDwgZS53aGF0KCkgPDwgc3RkOjplbmRsOwogICAgICAgIHN0ZDo6Y291dCA8PCAicmVxdWVzdDogIiA8PCByZXF1ZXN0IDw8IHN0ZDo6ZW5kbDsKICAgICAgICB0aHJvdyBzdGQ6OnJ1bnRpbWVfZXJyb3IoZS53aGF0KCkpOwogICAgfQoKICAgIHNpemVfdCBzaXplID0gMDsKICAgIGF1dG8gdHhuID0gZGIuQ3JlYXRlUmVhZFR4bigpOwogICAgc2l6ZV90IHZlcnRleF9sYWJlbF9pZCA9IHR4bi5HZXRWZXJ0ZXhMYWJlbElkKGxhYmVsKTsKICAgIHNpemVfdCB2ZXJ0ZXhfZmllbGRfaWQgPSB0eG4uR2V0VmVydGV4RmllbGRJZCh2ZXJ0ZXhfbGFiZWxfaWQsIGZpZWxkKTsKICAgIGludDY0X3QgdmVydGV4X2lkID0gdHhuLkdldEluZGV4SXRlcmF0b3IodmVydGV4X2xhYmVsX2lkLCB2ZXJ0ZXhfZmllbGRfaWQsIEZpZWxkRGF0YShyb290KSwgRmllbGREYXRhKHJvb3QpKS5HZXRWaWQoKTsKCiAgICBpZiAobXVsdGlfdGhyZWFkcykgewogICAgICAgIGF1dG8gZnJvbnRpZXJUcmF2ZXJzYWwgPSB0cmF2ZXJzYWw6OkZyb250aWVyVHJhdmVyc2FsKGRiLCB0eG4sIDEpOwogICAgICAgIGZyb250aWVyVHJhdmVyc2FsLlNldEZyb250aWVyKHZlcnRleF9pZCk7CiAgICAgICAgZm9yIChzaXplX3QgaSA9IDA7IGkgPCBkZXB0aDsgKytpKSB7CiAgICAgICAgICAgIGZyb250aWVyVHJhdmVyc2FsLlJlc2V0VmlzaXRlZCgpOwogICAgICAgICAgICBmcm9udGllclRyYXZlcnNhbC5FeHBhbmRPdXRFZGdlcygpOwogICAgICAgIH0KICAgICAgICBhdXRvJiBwdiA9IGZyb250aWVyVHJhdmVyc2FsLkdldEZyb250aWVyKCk7CiAgICAgICAgc2l6ZSA9IHB2LlNpemUoKTsKICAgIH0gZWxzZSB7CiAgICAgICAgc2l6ZV90IG51bV92ZXJ0aWNlcyA9IHR4bi5HZXROdW1WZXJ0aWNlcygpOwogICAgICAgIHN0ZDo6dmVjdG9yPGludDY0X3Q+IHNyY192ZXJ0ZXhzOwogICAgICAgIHNyY192ZXJ0ZXhzLnB1c2hfYmFjayh2ZXJ0ZXhfaWQpOwogICAgICAgIHN0ZDo6dmVjdG9yPGludDY0X3Q+IGRzdF92ZXJ0ZXhzOwogICAgICAgIGF1dG8gdml0ID0gdHhuLkdldFZlcnRleEl0ZXJhdG9yKCk7CiAgICAgICAgVW5vcmRlcmVkUGFyYWxsZWxCaXRzZXQgdmlzaXRlZChudW1fdmVydGljZXMsIHRocmVzaG9sZF9zaXplKTsKICAgICAgICBmb3IgKHNpemVfdCBpID0gMDsgaSA8IGRlcHRoOyArK2kpIHsKICAgICAgICAgICAgZm9yIChhdXRvIHZpZCA6IHNyY192ZXJ0ZXhzKSB7CiAgICAgICAgICAgICAgICB2aXQuR290byh2aWQpOwogICAgICAgICAgICAgICAgZm9yIChhdXRvIGVpdCA9IHZpdC5HZXRPdXRFZGdlSXRlcmF0b3IoKTsgZWl0LklzVmFsaWQoKTsgZWl0Lk5leHQoKSkgewogICAgICAgICAgICAgICAgICAgIGludDY0X3QgZHN0ID0gZWl0LkdldERzdCgpOwogICAgICAgICAgICAgICAgICAgIGlmICgoaSA9PSAwICYmICFoYXNfZHVwbGljYXRlX2VkZ2UpIHx8ICghdmlzaXRlZC5IYXMoZHN0KSAmJiB2aXNpdGVkLkFkZChkc3QpKSkgewogICAgICAgICAgICAgICAgICAgICAgICBkc3RfdmVydGV4cy5wdXNoX2JhY2soZHN0KTsKICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgIH0KICAgICAgICAgICAgc3RkOjpzd2FwKHNyY192ZXJ0ZXhzLCBkc3RfdmVydGV4cyk7CiAgICAgICAgICAgIGRzdF92ZXJ0ZXhzLmNsZWFyKCk7CiAgICAgICAgICAgIHZpc2l0ZWQuQ2xlYXIoKTsKICAgICAgICB9CiAgICAgICAgc2l6ZSA9IHNyY192ZXJ0ZXhzLnNpemUoKTsKICAgIH0KICAgIGpzb24gb3V0cHV0OwogICAgb3V0cHV0WyJzaXplIl0gPSBzaXplOwogICAgcmVzcG9uc2UgPSBvdXRwdXQuZHVtcCgpOwogICAgcmV0dXJuIHRydWU7Cn0K'
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
        if (result && result.status) {
            this.$message({
                message: '插件创建成功',
                type: 'success'
            })
        } else {
            this.$message({
                message: '插件创建失败',
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
