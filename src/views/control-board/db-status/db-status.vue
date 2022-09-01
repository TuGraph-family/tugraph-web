<i18n src="./db-status-lang.json"></i18n>
<template>
    <div class="control-db-status">
        <div class="db-status-header">
            {{ $t('t6') }}
        </div>
        <div class="db-status-body">
            <div class="cpu chart-box" :class="(cpuData.server > cpuData.warning_2 && 'warning2') || (cpuData.server > cpuData.warning_1 && 'warning1')">
                <span class="chart-icon cpu"></span>
                <span class="chart-name">CPU</span>
                <div ref="cpu" class="chart"></div>
                <div class="thresholdSet" @click="setThreshold('cpu')"></div>
                <i class="el-icon-warning iconWarning" :class="(cpuData.server > cpuData.warning_2 && 'warning2') || (cpuData.server > cpuData.warning_1 && 'warning1')"></i>
                <span class="alarmText" :class="(cpuData.server > cpuData.warning_2 && 'warning2') || (cpuData.server > cpuData.warning_1 && 'warning1')">
                    <span v-if="cpuData.server > cpuData.warning_2">{{ $t('t21') + cpuData.warning_2 }}%</span>
                    <span v-else-if="cpuData.server > cpuData.warning_1">{{ $t('t21') + cpuData.warning_1 }}%</span>
                </span>
                <div v-if="showCpuThreshold" class="thresholdModal">
                    <div class="inpuDiv">{{ $t('t3') }}<el-input v-model.number="cpuWarningData.warning_1"></el-input>%</div>
                    <div class="inpuDiv">{{ $t('t2') }} <el-input v-model.number="cpuWarningData.warning_2"></el-input>%</div>
                    <div class="buttonContainer">
                        <div class="thresholdButton" @click="upDateThreshold('cpu')">
                            {{ $t('t4') }}
                        </div>
                        <div class="thresholdButton2" @click="showCpuThreshold = false">
                            {{ $t('t5') }}
                        </div>
                    </div>
                </div>
                <div class="cpu-average">{{ $t('t27') }}：{{ averageCpu }} %</div>
                <div class="cpu-max">{{ $t('t28') }}：{{ maxCpu }} %</div>
            </div>
            <div
                class="memory chart-box"
                :class="
                    (memData.server_avail / memData.server_total < 1 - memData.warning_2 && 'warning2') || (memData.server_avail / memData.server_total < 1 - memData.warning_1 / 100 && 'warning1')
                "
            >
                <span class="chart-icon memory"></span>
                <span class="chart-name">{{ $t('t7') }}</span>
                <div ref="memory" class="chart"></div>
                <span class="chart-text">
                    <span class="num"> {{ memData && ((memData.self / memData.server_total) * 100).toFixed(1) }}% </span>
                    <span class="name">{{ $t('t8') }}</span>
                </span>
                <div class="thresholdSet" @click="setThreshold('memory')"></div>
                <i
                    class="el-icon-warning iconWarning"
                    :class="
                        (memData.server_avail / memData.server_total < 1 - memData.warning_2 / 100 && 'warning2') ||
                            (memData.server_avail / memData.server_total < 1 - memData.warning_1 / 100 && 'warning1')
                    "
                ></i>
                <span
                    class="alarmText"
                    :class="
                        (memData.server_avail / memData.server_total < 1 - memData.wawarning_2rning2 / 100 && 'warning2') ||
                            (memData.server_avail / memData.server_total < 1 - memData.warning_1 / 100 && 'warning1')
                    "
                >
                    <span v-if="memData.server_avail / memData.server_total < 1 - memData.warning_2 / 100 && 'warning2'">{{ $t('t26') }}{{ memData.warning_2 }}%</span>
                    <span v-else-if="memData.server_avail / memData.server_total < 1 - memData.warning_1 / 100 && 'warning1'">{{ $t('t26') }}{{ memData.warning_1 }}%</span>
                </span>
                <div v-if="showMemThreshold" class="thresholdModal">
                    <div class="inpuDiv">{{ $t('t3') }}<el-input v-model.number="memWarningData.warning_1"></el-input>%</div>
                    <div class="inpuDiv">
                        {{ $t('t2') }}
                        <el-input v-model.number="memWarningData.warning_2"></el-input>%
                    </div>
                    <div class="buttonContainer">
                        <div class="thresholdButton" @click="upDateThreshold('memory')">
                            {{ $t('t4') }}
                        </div>
                        <div class="thresholdButton2" @click="showMemThreshold = false">
                            {{ $t('t5') }}
                        </div>
                    </div>
                </div>
                <div class="memory-average">{{ $t('t27') }}：{{ averageRam }} %</div>
                <div class="memory-max">{{ $t('t28') }}：{{ maxRam }} %</div>
            </div>
            <div
                class="disk chart-box"
                :class="(dbSpace.disk_avail / dbSpace.disk_total < 1 - dbSpace.warning_2 / 100 && 'warning2') || (dbSpace.disk_avail / dbSpace.disk_total < 1 - dbSpace.warning_1 / 100 && 'warning1')"
            >
                <span class="chart-icon disk"></span>
                <span class="chart-name">{{ $t('t9') }}</span>
                <div ref="disk" class="chart"></div>
                <span class="chart-text">
                    <span class="num"> {{ dbSpace && ((dbSpace.space / dbSpace.disk_total) * 100).toFixed(1) }}% </span>
                    <span class="name">{{ $t('t10') }}</span>
                </span>
                <div class="thresholdSet" @click="setThreshold('disk')"></div>
                <i
                    class="el-icon-warning iconWarning"
                    :class="
                        (dbSpace.disk_avail / dbSpace.disk_total < 1 - dbSpace.warning_2 / 100 && 'warning2') || (dbSpace.disk_avail / dbSpace.disk_total < 1 - dbSpace.warning_1 / 100 && 'warning1')
                    "
                ></i>
                <span
                    class="alarmText"
                    :class="
                        (dbSpace.disk_avail / dbSpace.disk_total < 1 - dbSpace.wawarning_2 / 100 && 'warning2') || (dbSpace.disk_avail / dbSpace.disk_total < 1 - dbSpace.warning_1 / 100 && 'warning1')
                    "
                >
                    <span v-if="dbSpace.disk_avail / dbSpace.disk_total < 1 - dbSpace.warning_2 / 100 && 'warning2'">{{ $t('t25') }}{{ dbSpace.warning_2 }}%</span>
                    <span v-else-if="dbSpace.disk_avail / dbSpace.disk_total < 1 - dbSpace.warning_1 / 100 && 'warning1'">{{ $t('t25') }}{{ dbSpace.warning_1 }}%</span>
                </span>
                <div v-if="showDiskThreshold" class="thresholdModal">
                    <div class="inpuDiv">{{ $t('t3') }}<el-input v-model.number="diskWarningData.warning_1"></el-input>%</div>
                    <div class="inpuDiv">
                        {{ $t('t2') }}
                        <el-input v-model.number="diskWarningData.warning_2"></el-input>%
                    </div>
                    <div class="buttonContainer">
                        <div class="thresholdButton" @click="upDateThreshold('disk')">
                            {{ $t('t4') }}
                        </div>
                        <div class="thresholdButton2" @click="showDiskThreshold = false">
                            {{ $t('t5') }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="request chart-box" :class="(requestData.failure_rate > requestData.warning_2 / 100 && 'warning2') || (requestData.failure_rate > requestData.warning_1 && 'warning1')">
                <span class="chart-icon request"></span>
                <span class="chart-name"
                    >{{ $t('t11') }} <span style="font-size:12px;">{{ $t('t12') }}</span></span
                >
                <div ref="request" class="chart"></div>
                <div class="thresholdSet" @click="setThreshold('request')"></div>
                <i
                    class="el-icon-warning iconWarning"
                    :class="(requestData.failure_rate > requestData.warning_2 / 100 && 'warning2') || (requestData.failure_rate > requestData.warning_1 && 'warning1')"
                ></i>
                <span class="alarmText" :class="(requestData.failure_rate > requestData.warning_2 / 100 && 'warning2') || (requestData.failure_rate > requestData.warning_1 && 'warning1')">
                    <span v-if="requestData.failure_rate > requestData.warning_2 / 100 && 'warning2'">{{ $t('t14') }}{{ requestData.warning_2 }}%</span>
                    <span v-else-if="requestData.failure_rate > requestData.warning_1 && 'warning1'">{{ $t('t14') }}{{ requestData.warning_1 }}%</span>
                </span>
                <div v-if="showRequestThreshold" class="thresholdModal">
                    <div class="inpuDiv">{{ $t('t3') }}<el-input v-model.number="requestWarningData.warning_1"></el-input>%</div>
                    <div class="inpuDiv">
                        {{ $t('t2') }}
                        <el-input v-model.number="requestWarningData.warning_2"></el-input>%
                    </div>
                    <div class="buttonContainer">
                        <div class="thresholdButton" @click="upDateThreshold('request')">
                            {{ $t('t4') }}
                        </div>
                        <div class="thresholdButton2" @click="showRequestThreshold = false">
                            {{ $t('t5') }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="cpu chart-box" :class="(cpuData.server > cpuData.warning_2 && 'warning2') || (cpuData.server > cpuData.warning_1 && 'warning1')">
                <span class="chart-icon io"></span>
                <span class="chart-name">IO</span>
                <div ref="io" class="chart"></div>
                <div class="io-average">{{ $t('t27') }}：{{ $t('t29') }} {{ averageReadDisplay }}{{ unitDisplay }} {{ $t('t30') }} {{ averageWriteDisplay }}{{ unitDisplay }}</div>
                <div class="io-max">{{ $t('t28') }}：{{ $t('t29') }} {{ maxReadDisplay }}{{ unitDisplay }} {{ $t('t30') }} {{ maxWriteDisplay }}{{ unitDisplay }}</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { formatSeconds } from '@/core/uitls.ts'
import { getModule } from 'vuex-module-decorators'
import DbStatusStore from '@/store/db-status/db-status'
import * as echarts from 'echarts'
import moment from 'moment'
@Component
export default class DbStatus extends Vue {
    public $refs!: {
        cpu: HTMLDivElement
        memory: HTMLDivElement
        disk: HTMLDivElement
        request: HTMLDivElement
    }
    cpuChart: any = null
    memoryChart: any = null
    diskChart: any = null
    requestChart: any = null
    ioChart: any = null
    showCpuThreshold: boolean = false
    showMemThreshold: boolean = false
    showDiskThreshold: boolean = false
    showRequestThreshold: boolean = false
    dbStatusStore: any = getModule(DbStatusStore, store)
    averageRam: number = 0
    maxRam: number = 0
    ramList: any[] = []
    averageCpu: number = 0
    maxCpu: number = 0
    averageRead: number = 0
    averageWrite: number = 0
    readList: any[] = []
    writeList: any[] = []
    maxRead: number = 0
    maxWrite: number = 0
    startTime: number = new Date().getTime()
    maxWriteDisplay: string = ''
    maxReadDisplay: string = ''
    averageReadDisplay: string = ''
    averageWriteDisplay: string = ''
    unitDisplay: string = ''
    cpuWarningData: any = {
        warning_1: 0,
        warning_2: 0
    }
    memWarningData: any = {
        warning_1: 0,
        warning_2: 0
    }
    diskWarningData: any = {
        warning_1: 0,
        warning_2: 0
    }
    requestWarningData: any = {
        warning_1: 0,
        warning_2: 0
    }
    options: any = {
        // backgroundColor: '#ffffff',
        tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
        },
        series: [
            {
                type: 'pie',
                hoverAnimation: false,
                stillShowZeroSum: false,
                radius: [88, 108],
                center: ['50%', '50%'],
                // roseType: 'area',
                data: [],
                label: {
                    formatter: `{b}:\n\n{c}`,
                    fontFamily: 'PingFangSC-Regular',
                    fontSize: '14px',
                    color: '#44527C',
                    textAlign: 'center'
                },
                labelLine: {
                    lineStyle: {
                        color: '#838ba7'
                    }
                }
            }
        ]
    }

    staticLineOption: any = {
        color: ['#3e8cf6', '#666666'],
        title: {
            text: ''
        },
        legend: {
            data: [
                {
                    name: this.$t('t17'),
                    icon: 'roundRect'
                },
                { name: this.$t('t18'), icon: 'roundRect' }
            ],
            bottom: 35
        },
        xAxis: {
            type: 'category',
            boundaryGap: false
        },
        yAxis: {
            axisLabel: {
                formatter: function(val) {
                    return val
                }
            }
        },

        series: [
            {
                name: this.$t('t17'),
                type: 'line',
                smooth: true,
                showSymbol: false,
                areaStyle: {
                    color: '#3e8cf6'
                },
                lineStyle: {
                    color: '#3e8cf6'
                },
                data: []
            },
            {
                name: this.$t('t18'),
                type: 'line',
                smooth: true,
                showSymbol: false,
                areaStyle: {
                    color: '#666666'
                },
                lineStyle: {
                    color: '#666666'
                },
                data: []
            }
        ]
    }

    cpuLineOption: any = {
        color: ['#82b5f9', '#c7ddfc'],
        title: {
            text: ''
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            },
            formatter: '{c} %'
        },
        legend: {
            data: [
                {
                    name: this.$t('t15'),
                    icon: 'roundRect'
                },
                { name: this.$t('t16'), icon: 'roundRect' }
            ],
            bottom: 35
        },
        xAxis: {
            type: 'category',
            boundaryGap: false
        },
        yAxis: {
            max: 100,
            axisLabel: {
                formatter: function(val) {
                    return val + '%'
                }
            }
        },

        series: [
            {
                name: this.$t('t15'),
                type: 'line',
                smooth: true,
                showSymbol: false,
                areaStyle: {
                    color: '#82b5f9'
                },
                lineStyle: {
                    color: '#82b5f9'
                },
                data: []
            },
            {
                name: this.$t('t16'),
                type: 'line',
                smooth: true,
                showSymbol: false,
                areaStyle: {
                    color: '#c7ddfc'
                },
                lineStyle: {
                    color: '#c7ddfc'
                },
                data: []
            }
        ]
    }

    ioLineOption: any = {
        color: ['#3e8cf6', '#666666'],
        title: {
            text: ''
        },
        grid: {
            left: '10%'
        },
        legend: {
            data: [
                {
                    name: this.$t('t29'),
                    icon: 'roundRect'
                },
                { name: this.$t('t30'), icon: 'roundRect' }
            ],
            bottom: 35
        },
        xAxis: {
            type: 'category',
            boundaryGap: false
        },
        yAxis: {
            name: '',
            axisLabel: {
                formatter: function(val) {
                    return val
                }
            }
        },

        series: [
            {
                name: this.$t('t29'),
                type: 'line',
                smooth: true,
                showSymbol: false,
                areaStyle: {
                    color: '#3e8cf6'
                },
                lineStyle: {
                    color: '#3e8cf6'
                },
                data: []
            },
            {
                name: this.$t('t30'),
                type: 'line',
                smooth: true,
                showSymbol: false,
                areaStyle: {
                    color: '#666666'
                },
                lineStyle: {
                    color: '#666666'
                },
                data: []
            }
        ]
    }

    get cpuData() {
        this.cpuWarningData.warning_1 = this.dbStatusStore.cpuData.warning_1
        this.cpuWarningData.warning_2 = this.dbStatusStore.cpuData.warning_2
        return this.dbStatusStore.cpuData
    }
    get memData() {
        this.memWarningData.warning_1 = this.dbStatusStore.memData.warning_1
        this.memWarningData.warning_2 = this.dbStatusStore.memData.warning_2
        return this.dbStatusStore.memData
    }
    get dbSpace() {
        this.diskWarningData.warning_1 = this.dbStatusStore.dbSpace.warning_1
        this.diskWarningData.warning_2 = this.dbStatusStore.dbSpace.warning_2
        return this.dbStatusStore.dbSpace
    }
    get requestData() {
        this.requestWarningData.warning_1 = this.dbStatusStore.requestData.warning_1
        this.requestWarningData.warning_2 = this.dbStatusStore.requestData.warning_2
        return this.dbStatusStore.requestData
    }

    get ioData() {
        return this.dbStatusStore.ioData
    }

    get languageData() {
        return store && store.state.language
    }
    @Watch('languageData')
    onChangeLanguage() {
        this.changeLegend(this.cpuLineOption, 't15', 't16')
        this.changeLegend(this.staticLineOption, 't17', 't18')
        this.changeLegend(this.ioLineOption, 't29', 't30')
        this.draw()
    }
    created() {
        this.dbStatusStore.getStatus()
    }
    intervalTaskId: string = ''
    mounted() {
        var cpuChart = echarts.init(this.$refs['cpu'])
        var memoryChart = echarts.init(this.$refs['memory'])
        var diskChart = echarts.init(this.$refs['disk'])
        var requestChart = echarts.init(this.$refs['request'])
        var ioChart = echarts.init(this.$refs['io'])
        this.cpuChart = cpuChart
        this.memoryChart = memoryChart
        this.diskChart = diskChart
        this.requestChart = requestChart
        this.ioChart = ioChart
        setTimeout(() => {
            this.draw()
        }, 300)
        this.intervalTaskId = this.$interval.registTask({ time: 2, fun: this.draw })
    }
    changeLegend(data: any, a: string, b: string) {
        data.legend.data[0].name = this.$t(a)
        data.legend.data[1].name = this.$t(b)
        data.series[0].name = this.$t(a)
        data.series[1].name = this.$t(b)
    }
    bToGb(val) {
        return (val / 1073741824).toFixed(2)
        // return (val / 1024 / 1024 / 1024).toFixed(2)
    }
    kbToGb(val) {
        return (val / 1048576).toFixed(2)
        // return (val / 1024 / 1024).toFixed(2)
    }
    draw() {
        this.dbStatusStore.getStatus()
        this.drawCpuChart()
        this.drawRamChart()
        this.drawDiskChart()
        this.drawStaticLine()
        this.drawIoLine()
    }
    drawCpuChart() {
        let self = this.cpuData.self
        let other = this.cpuData.server
        this.cpuLineOption.series[0].data.push(self)
        this.cpuLineOption.series[1].data.push(other)
        let averageself = this.cpuLineOption.series[0].data.reduce((prev, cur) => {
            return prev + cur
        })
        let averageother = this.cpuLineOption.series[1].data.reduce((prev, cur) => {
            return prev + cur
        })
        this.averageCpu = parseFloat(((averageself + averageother) / 2 / this.cpuLineOption.series[0].data.length).toFixed(2))
        self + other > this.maxCpu && (this.maxCpu = parseFloat((self + other).toFixed(2)))
        this.cpuChart.setOption(this.cpuLineOption)
    }
    drawRamChart() {
        let self: any = this.kbToGb(this.memData.self)
        let avail = this.kbToGb(this.memData.server_avail)
        let other: any = this.kbToGb(this.memData.server_total - this.memData.self - this.memData.server_avail)
        let v = 1 - this.memData.server_avail / this.memData.server_total
        this.ramList.push(v)
        v * 100 > this.maxRam && (this.maxRam = parseFloat((v * 100).toFixed(2)))
        let total: any = this.ramList.reduce((prev, cur) => {
            return prev + cur
        })

        this.averageRam = parseFloat(((total / this.ramList.length) * 100).toFixed(2))
        var data = [
            {
                name: this.$t('t19'),
                value: avail,
                itemStyle: { color: '#f8f6fe' },
                emphasis: { itemStyle: { color: '#f8f6fe' } }
            },
            {
                name: this.$t('t20'),
                value: other,
                itemStyle: { color: '#d8caff' },
                emphasis: { itemStyle: { color: '#d8caff' } }
            },
            {
                name: this.$t('t15'),
                value: self,
                itemStyle: { color: '#a888f4' },
                emphasis: { itemStyle: { color: '#a888f4' } }
            }
        ]
        let option = JSON.parse(JSON.stringify(this.options))
        option.series[0].data = data
        option.tooltip.formatter = `{b} : {c}  GB({d}%)`
        option.series[0].label.formatter = `{b}:\n\n{c} GB`
        this.memoryChart.setOption(option)
    }
    drawDiskChart() {
        let self = this.bToGb(this.dbSpace.space)
        let avail = this.bToGb(this.dbSpace.disk_avail)
        let other = this.bToGb(this.dbSpace.disk_total - this.dbSpace.space - this.dbSpace.disk_avail)
        var data = [
            {
                name: this.$t('t15'),
                value: self,
                itemStyle: { color: '#9ce1d3' },
                emphasis: { itemStyle: { color: '#9ce1d3' } }
            },
            {
                name: this.$t('t20'),
                value: other,
                itemStyle: { color: '#d2f1eb' },
                emphasis: { itemStyle: { color: '#d2f1eb' } }
            },
            {
                name: this.$t('t19'),
                value: avail,
                itemStyle: { color: '#f7fdfc' },
                emphasis: { itemStyle: { color: '#f7fdfc' } }
            }
        ]
        let option = JSON.parse(JSON.stringify(this.options))
        option.series[0].data = data
        option.tooltip.formatter = `{b} : {c}  GB({d}%)`
        option.series[0].label.formatter = `{b}:\n\n{c} GB`
        this.diskChart.setOption(option)
    }
    drawStaticLine() {
        this.staticLineOption.series[0].data.push(this.requestData['requests_second'])
        this.staticLineOption.series[1].data.push(this.requestData['writes_second'])
        this.requestChart.setOption(this.staticLineOption)
    }
    drawIoLine() {
        var a = this.ioData['read']
        var b = this.ioData['write']
        this.readList.push(a)
        this.writeList.push(b)
        this.maxRead < a && (this.maxRead = parseFloat(a.toFixed(0)))
        this.maxWrite < b && (this.maxWrite = parseFloat(b.toFixed(0)))
        let dataList1: any[] = []
        let dataList2: any[] = []
        let maxWriteDisplay: string = ''
        let maxReadDisplay: string = ''
        let averageReadDisplay: string = ''
        let averageWriteDisplay: string = ''
        let unitDisplay: string = ''
        if ((this.maxWrite > 1024 && this.maxWrite <= 1024 * 1024) || (this.maxRead > 1024 && this.maxRead <= 1024 * 1024)) {
            dataList1 = this.readList.map((item) => item / 1024)
            dataList2 = this.writeList.map((item) => item / 1024)
            maxWriteDisplay = (this.maxWrite / 1024).toFixed(0)
            maxReadDisplay = (this.maxRead / 1024).toFixed(0)
            unitDisplay = 'KB/s'
            let averageRead = dataList1.reduce((prev, cur) => {
                return prev + cur
            })
            let averageWrite = dataList2.reduce((prev, cur) => {
                return prev + cur
            })
            averageReadDisplay = (averageRead / dataList1.length).toFixed(0)
            averageWriteDisplay = (averageWrite / dataList2.length).toFixed(0)
        } else if (this.maxWrite > 1024 * 1024 || this.maxRead > 1024 * 1024) {
            dataList1 = this.readList.map((item) => item / 1024 / 1024)
            dataList2 = this.writeList.map((item) => item / 1024 / 1024)
            maxWriteDisplay = (this.maxWrite / 1024 / 1024).toFixed(0)
            maxReadDisplay = (this.maxRead / 1024 / 1024).toFixed(0)
            unitDisplay = 'MB/s'
            let averageRead = dataList1.reduce((prev, cur) => {
                return prev + cur
            })
            let averageWrite = dataList2.reduce((prev, cur) => {
                return prev + cur
            })
            averageReadDisplay = (averageRead / dataList1.length).toFixed(0)
            averageWriteDisplay = (averageWrite / dataList2.length).toFixed(0)
        } else {
            dataList1 = this.readList.map((item) => item)
            dataList2 = this.writeList.map((item) => item)
            maxWriteDisplay = this.maxWrite.toFixed(0)
            maxReadDisplay = this.maxRead.toFixed(0)
            unitDisplay = 'B/s'
            let averageRead = dataList1.reduce((prev, cur) => {
                return prev + cur
            })
            let averageWrite = dataList2.reduce((prev, cur) => {
                return prev + cur
            })
            averageReadDisplay = (averageRead / dataList1.length).toFixed(0)
            averageWriteDisplay = (averageWrite / dataList2.length).toFixed(0)
        }
        this.ioLineOption.series[0].data = dataList1
        this.ioLineOption.series[1].data = dataList2
        this.maxWriteDisplay = maxWriteDisplay
        this.maxReadDisplay = maxReadDisplay
        this.averageReadDisplay = averageReadDisplay
        this.averageWriteDisplay = averageWriteDisplay
        this.ioLineOption.yAxis.name = unitDisplay
        this.unitDisplay = unitDisplay
        this.ioChart.setOption(this.ioLineOption)
    }
    setThreshold(type: string) {
        if (type === 'cpu') {
            this.showCpuThreshold = true
        } else if (type === 'memory') {
            this.showMemThreshold = true
        } else if (type === 'disk') {
            this.showDiskThreshold = true
        } else if (type === 'request') {
            this.showRequestThreshold = true
        }
    }
    beforeDestroy() {
        this.$interval.deleteTask({ taskId: this.intervalTaskId })
    }
    upDateThreshold(type: string) {
        let data = {
            warning_1: 0,
            warning_2: 0
        }
        if (type === 'cpu') {
            data.warning_1 = this.cpuWarningData.warning_1
            data.warning_2 = this.cpuWarningData.warning_2
        } else if (type === 'memory') {
            data.warning_1 = this.memWarningData.warning_1
            data.warning_2 = this.memWarningData.warning_2
        } else if (type === 'disk') {
            data.warning_1 = this.diskWarningData.warning_1
            data.warning_2 = this.diskWarningData.warning_2
        } else if (type === 'request') {
            data.warning_1 = this.requestWarningData.warning_1
            data.warning_2 = this.requestWarningData.warning_2
        }
        if (data.warning_1 < 0 || data.warning_2 < 0) {
            this.$message({
                type: 'error',
                message: '阈值不能小于0'
            })
            return
        }
        if (data.warning_1 > 100 || data.warning_2 > 100) {
            this.$message({
                type: 'error',
                message: this.$t('t23') as string
            })
            return
        }
        if (data.warning_1 >= data.warning_2) {
            this.$message({
                type: 'error',
                message: this.$t('t24') as string
            })
            return
        }

        this.dbStatusStore.updateDbWarning({ type: type, data: data })
        if (type === 'cpu') {
            this.showCpuThreshold = false
        } else if (type === 'memory') {
            this.showMemThreshold = false
        } else if (type === 'disk') {
            this.showDiskThreshold = false
        } else if (type === 'request') {
            this.showRequestThreshold = false
        }
        if (data.warning_1 < 0 || data.warning_2 < 0) {
            this.$message({
                type: 'error',
                message: this.$t('t22') as string
            })
            return
        }
    }
}
</script>
<style lang="less" scope>
.control-db-status {
    position: relative;
    width: 100%;
    height: 100%;
    .db-status-header {
        background: #ffffff;
        box-shadow: 0 1px 0 0 #dedfdf;
        width: 100%;
        height: 60px;
        font-family: OpenSans;
        font-size: 24px;
        color: #44527c;
        line-height: 60px;
        padding-left: 25px;
    }
    .db-status-body {
        width: 100%;
        height: calc(100% - 60px);
        padding: 20px;
        background: #e6eaf2;
        display: flex;
        box-sizing: border-box;
        overflow: auto;
        flex-wrap: wrap;
        align-content: flex-start;
    }
    .chart-box {
        width: 440px;
        height: 340px;
        background: #ffffff;
        box-shadow: 0 4px 20px 0 rgba(119, 133, 162, 0.2);
        border-radius: 4px;
        flex-grow: 0;
        flex-shrink: 0;
        margin-bottom: 20px;
        margin-right: 20px;
        position: relative;
        &.warning2 {
            box-shadow: 0 0 30px red inset;
            animation: alert1 1s infinite;
        }
        &.warning1 {
            box-shadow: 0 0 30px darkorange inset;
            animation: alert2 1s infinite;
        }
        .cpu-average,
        .memory-average,
        .io-average {
            font-size: 12px;
            position: absolute;
            bottom: 10px;
            left: 40px;
        }
        .cpu-max,
        .memory-max,
        .io-max {
            font-size: 12px;
            position: absolute;
            bottom: 10px;
            right: 40px;
        }
    }
    .chart {
        width: 100%;
        height: 100%;
    }
    .chart-icon {
        position: absolute;
        width: 15px;
        height: 8px;
        border-radius: 4px;
        border-radius: 4px;
        z-index: 10;
        top: 17px;
        left: 8px;
        &.cpu {
            background: #3e8cf6;
        }
        &.disk {
            background: #39bda3;
        }
        &.memory {
            background: #7341ee;
        }
        &.request {
            background: #323457;
        }
        &.io {
            background: #787878;
        }
    }
    .chart-name {
        position: absolute;
        font-family: PingFangSC-Regular;
        font-size: 20px;
        color: #44527c;
        z-index: 10;
        left: 34px;
        top: 6px;
    }
    .chart-text {
        position: absolute;
        display: flex;
        flex-direction: column;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        text-align: center;
        .num {
            font-family: OpenSans-Semibold;
            font-size: 30px;
            color: #44527c;
        }
        .name {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #44527c;
        }
    }
    .thresholdSet {
        position: absolute;
        right: 0;
        top: 0;
        width: 28px;
        height: 28px;
        cursor: pointer;
        background-image: url('../../../assets/server-status/set.png');
    }
    .thresholdSet:hover {
        background-image: url('../../../assets/server-status/set-h.png');
        background-repeat: no-repeat;
    }
    .thresholdModal {
        width: 160px;
        height: 106px;
        padding: 20px;
        border-radius: 6px;
        position: absolute;
        left: 150px;
        top: 126px;
        background: #c0dafb;
        font-size: 14px;
        font-family: OpenSans;
        color: #313748;
        .inpuDiv {
            display: flex;
            justify-content: space-between;
        }
        input {
            width: 26px;
            height: 20px;
            /* margin-left: 10px; */
            margin-right: 5px;
            margin-left: auto;
            color: #44527c;
        }
        .buttonContainer {
            display: flex;
            justify-content: space-between;
        }
        .thresholdButton {
            cursor: pointer;
            margin-top: 10px;
            padding: 0 10px;
            height: 22px;
            line-height: 22px;
            text-align: center;
            background: #2774de;
            color: #fff;
            font-size: 12px;
            border-radius: 4px;
        }
        .thresholdButton2 {
            cursor: pointer;
            margin-top: 10px;
            padding: 0 10px;
            height: 22px;
            line-height: 22px;
            text-align: center;
            background: #fff;
            color: #000;
            font-size: 12px;
            border-radius: 4px;
        }
    }
    .el-input {
        height: 20px;
        width: 32px;
        input {
            padding: 0;
        }
    }
    .el-icon-warning {
        display: none;
    }
    .el-icon-warning.warning1 {
        display: inline-block;
        color: darkorange;
    }
    .el-icon-warning.warning2 {
        display: inline-block;
        color: red;
    }
    .warning1 {
        color: darkorange;
    }
    .warning2 {
        color: red;
    }
    .alarmText {
        position: absolute;
        top: 1px;
        right: 46px;
        font-family: PingFangSC-Regular;
    }
    .iconWarning {
        position: absolute;
        top: 5px;
        right: 26px;
        cursor: pointer;
    }
    @keyframes alert1 {
        0% {
            box-shadow: 0 0 0px red inset;
        }
        50% {
            box-shadow: 0 0 30px red inset;
        }
        100% {
            box-shadow: 0 0 0px red inset;
        }
    }
    @keyframes alert2 {
        0% {
            box-shadow: 0 0 0px darkorange inset;
        }
        50% {
            box-shadow: 0 0 30px darkorange inset;
        }
        100% {
            box-shadow: 0 0 0px darkorange inset;
        }
    }
}
</style>
