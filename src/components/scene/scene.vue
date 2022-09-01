<i18n src="./scene-lang.json"></i18n>
<template>
    <div class="scene">
        <div class="scene-item" v-for="(item, index) in sceneList" :key="item.key">
            <div :class="item.key" class="left">
                <div class="scene-name">{{ item.name }}</div>
                <el-button size="mini" class="create-scene" @click="createScene(item, index)">创建示例</el-button>
            </div>
            <div class="right">
                <el-steps direction="vertical" :active="item.active" process-status="finish">
                    <el-step :status="step.status" v-for="step in item.steps" :key="step.text" :title="step.text" :icon="step.icon"></el-step>
                </el-steps>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import SubGraphManageStore from '@/store/subgraph-manage/subgraph-manage'
import { getModule } from 'vuex-module-decorators'
import HelpStore from '@/store/help/help'
import UserLoginStore from '@/store/user-login/user-login'

@Component
export default class SceneComponent extends Vue {
    subGraphManageStore: SubGraphManageStore = getModule(SubGraphManageStore, store)
    helpStore: HelpStore = getModule(HelpStore, store)
    userLoginStore: UserLoginStore = getModule(UserLoginStore, store)
    sceneList: any = []
    loading: boolean = true
    created() {
        import('./config').then((res) => {
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
            this.sceneList = res.default
        })
    }
    refreshStoreData(scene, index) {
        this.sceneList[index] = scene
        this.sceneList = [...this.sceneList]
        this.subGraphManageStore.getUserGraph(this.userLoginStore.userName)
    }
    async createSubGraph(scene: any, index: number) {
        let n = 1
        let subGraphNames: Array<string> = Object.keys(this.subGraphManageStore.allSubGraphList || [])
        subGraphNames.forEach((item) => {
            item.startsWith(scene.name) && n++
        })
        let option = {
            name: scene.name + n,
            config: {
                max_size_GB: 1,
                async: true,
                description: scene.description
            }
        }
        scene.steps[0].icon = 'el-icon-loading'
        scene.active = 0
        this.sceneList[index] = scene
        this.sceneList = [...this.sceneList]
        let result = await this.subGraphManageStore.createSubGraph(option)
        if (result.status == 200) {
            scene.steps[0].icon = ''
            scene.steps[0].status = 'success'
        } else {
            scene.steps[0].status = 'error'
        }
        this.refreshStoreData(scene, index)
        return { graphName: option.name, ...result }
    }
    async createLabel(graphName: string, scene, index) {
        scene.steps[1].icon = 'el-icon-loading'
        scene.active = 1
        this.sceneList[index] = scene
        let creaeteLabelScripts = scene.createLabelScript
        let result = await this.helpStore.createLabels({ graph: graphName, scripts: creaeteLabelScripts })
        if (result.status === 'success') {
            scene.steps[1].icon = ''
            scene.steps[1].status = 'success'
        } else {
            scene.steps[1].status = 'error'
        }
        this.refreshStoreData(scene, index)
        return { graphName: graphName, ...result }
    }
    async createData(graphName: string, scene: any, index: number) {
        scene.steps[2].icon = 'el-icon-loading'
        scene.active = 2
        this.sceneList[index] = scene
        let list = await scene.data()
        let result = await this.helpStore.createData({ graph: graphName, dataList: list })
        if (result && result.status === 'success') {
            scene.steps[2].icon = ''
            scene.steps[2].status = 'success'
        } else {
            scene.steps[2].status = 'error'
        }
        this.refreshStoreData(scene, index)
        return result
    }
    finishProcess(graphName: string, scene: any, index: number) {
        scene.steps[3].icon = ''
        scene.steps[3].status = 'success'
        this.refreshStoreData(scene, index)
        this.subGraphManageStore.updateSelectedSubGraph(graphName)
    }
    // 需要优化代码的美感，嵌套调用丑爆了 —— 诗源
    async createScene(scene, index: number) {
        let createGraphResult = await this.createSubGraph(scene, index)
        if (createGraphResult.status == 200) {
            let graphName = createGraphResult.graphName
            let createLabelResult = await this.createLabel(graphName, scene, index)
            if (createLabelResult.status == 'success') {
                let createDataResult = await this.createData(graphName, scene, index)
                if (createDataResult.status == 'success') {
                    this.finishProcess(graphName, scene, index)
                }
            }
        }
    }
}
</script>
<style lang="less" scoped>
.scene {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    padding: 10px 0 20px 0;
    justify-content: space-between;
    .loading-container {
        width: 100%;
        height: 180px;
    }
    .scene-item {
        margin-top: 10px;
        width: 295px;
        height: 180px;
        border: 1px dashed #ccc;
        border-radius: 8px;
        display: flex;
    }
    .scene-name {
        width: 100%;
        text-align: center;
        padding: 15px 0;
    }
    .left {
        width: 120px;
        height: 100%;
        background-repeat: no-repeat;
        background-size: 80px;
        background-position: center;
        border-right: 1px dashed #ccc;
        position: relative;
        .create-scene {
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
        }
    }
    .right {
        flex-grow: 1;
        padding: 5px 10px;
        transform: scale(0.85);
    }
    .movie {
        background-image: url('../../assets/scene/movie.png');
    }
    .covid {
        background-image: url('../../assets/scene/covid.png');
    }
}
</style>
