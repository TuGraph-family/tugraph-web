<template>
    <div class="travel-line">
        <div class="travel-line-select">
            <div>
                条件：
                <el-select size="small" v-model="care">
                    <el-option :value="1" label="经济优先"></el-option>
                    <el-option :value="2" label="时间优先"></el-option>
                </el-select>
            </div>
            <div>
                起点：
                <el-select size="small" v-model="src">
                    <el-option v-for="item in cityList" :key="item" :value="item" :label="item"></el-option>
                </el-select>
            </div>
            <div>
                终点：<el-select size="small" v-model="dst">
                    <el-option v-for="item in cityList" :key="item" :value="item" :label="item"></el-option>
                </el-select>
            </div>
            <div>
                <el-button size="small" @click="queryPath">查询</el-button>
            </div>
        </div>
        <div ref="chart" style="width: 100%; height: 100%;"></div>
        <div class="travel-line-table">
            <el-table :data="lineTableData" height="250" border style="width: 100%">
                <el-table-column prop="src" label="起点城市" width="180"></el-table-column>
                <el-table-column prop="dst" label="终点城市" width="180"></el-table-column>
                <el-table-column prop="time" label="旅程耗时"> </el-table-column>
                <el-table-column prop="price" label="旅程花费"> </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import SubGraphManageStore from '@/store/subgraph-manage/subgraph-manage'
import * as echarts from 'echarts'
import World from './world.json'
import { option } from './options'
import dark from 'echarts/theme/dark-mushroom'
import { queryByCypher } from '@/service/cypher/cypher'
@Component
export default class TravelLine extends Vue {
    public $refs!: {
        chart: HTMLDivElement
    }
    care: number = 1
    src: string = ''
    dst: string = ''
    cityList: any[] = []
    chart: any = null
    lineTableData: any[] = [
        {
            src: '北京',
            dst: '伦敦',
            time: '5h',
            price: '100$'
        },
        {
            src: '北京',
            dst: '伦敦',
            time: '5h',
            price: '100$'
        },
        {
            src: '北京',
            dst: '伦敦',
            time: '5h',
            price: '100$'
        }
    ]
    created() {
        this.getAllData()
    }
    mounted() {}
    async getAllData() {
        let res = await queryByCypher({ graph: 'TravelLine', script: ' MATCH  (n) RETURN n' })
        let cityList = []
        res.data.result.forEach((item) => {
            let n = JSON.parse(item[0])
            cityList.push(n.properties['名称'])
        })
        this.cityList = [...new Set(cityList)]
        this.createChart()
    }

    createChart() {
        let dom = this.$refs.chart

        echarts.registerMap('world', World)
        const chart = echarts.init(dom)
        chart.setOption(option)
        this.chart = chart
    }
    async queryPath() {
        let cypher = `MATCH  p=(n)-[r:航班]-(m) RETURN p limit 7`
        let res = await queryByCypher({ graph: 'TravelLine', script: cypher })
        res.data.result.forEach((item) => {
            let p = JSON.parse(item)
            option.series[0].data.push({
                name: p[1].properties['航班名称'],
                coords: [
                    [p[0].properties.lon, p[0].properties.lat],
                    [p[2].properties.lon, p[2].properties.lat]
                ]
            })
        })
        this.chart.setOption(option)
    }
}
</script>
<style lang="less" scoped>
.travel-line {
    width: 100%;
    height: 100%;
    position: relative;
    background-image: url('../../../assets/applications/travle-line/bg.jpg');
    background-size: 100%;
    .travel-line-select {
        position: absolute;
        left: 50px;
        top: 30px;
        display: flex;
        width: 900px;
        background: rgba(255, 255, 255, 0.8);
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 2;
        > div {
            line-height: 32px;
        }
    }
    .el-button {
        border-radius: 5px;
    }
    .travel-line-table {
        position: absolute;
        bottom: 20px;
        left: 20px;
        width: 900px;
        border-radius: 10px;
        overflow: hidden;
        opacity: 0.8;
    }
}
</style>
