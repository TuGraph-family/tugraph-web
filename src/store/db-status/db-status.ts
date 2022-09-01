import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { getDBInfo, getStatic } from '@/service/db-info/db-info.ts'

@Module({ name: 'DbStatus', namespaced: true })
export default class DbStatus extends VuexModule {
    cpuData: {
        self: number
        server: number
        unit: string
        warning_1: number
        warning_2: number
    } = {
        self: 0,
        server: 0,
        unit: '',
        warning_1: localStorage.__FMA_CPU_WARNING__ ? JSON.parse(localStorage.__FMA_CPU_WARNING__).warning_1 : 60,
        warning_2: localStorage.__FMA_CPU_WARNING__ ? JSON.parse(localStorage.__FMA_CPU_WARNING__).warning_2 : 90
    }
    memData: {
        server_total: number
        server_avail: number
        self: number
        unit: string
        warning_1: number
        warning_2: number
    } = {
        server_total: 0,
        server_avail: 0,
        self: 0,
        unit: '',
        warning_1: localStorage.__FMA_MEM_WARNING__ ? JSON.parse(localStorage.__FMA_MEM_WARNING__).warning_1 : 60,
        warning_2: localStorage.__FMA_MEM_WARNING__ ? JSON.parse(localStorage.__FMA_MEM_WARNING__).warning_2 : 90
    }
    dbSpace: {
        disk_avail: number
        disk_total: number
        space: number
        unit: string
        warning_1: number
        warning_2: number
    } = {
        disk_avail: 0,
        disk_total: 0,
        space: 0,
        unit: '',
        warning_1: localStorage.__FMA_DISK_WARNING__ ? JSON.parse(localStorage.__FMA_DISK_WARNING__).warning_1 : 60,
        warning_2: localStorage.__FMA_DISK_WARNING__ ? JSON.parse(localStorage.__FMA_DISK_WARNING__).warning_2 : 90
    }
    requestData: {
        failure_rate: number
        requests_second: number
        running_tasks: number
        writes_second: number
        warning_1: number
        warning_2: number
    } = {
        failure_rate: 0,
        requests_second: 0,
        running_tasks: 0,
        writes_second: 0,
        warning_1: localStorage.__FMA_REQUEST_WARNING__ ? JSON.parse(localStorage.__FMA_REQUEST_WARNING__).warning_1 : 20,
        warning_2: localStorage.__FMA_REQUEST_WARNING__ ? JSON.parse(localStorage.__FMA_REQUEST_WARNING__).warning_2 : 50
    }
    ioData: {
        read: number
        write: number
        unit: string
    } = {
        read: 0,
        write: 0,
        unit: 'B/s'
    }
    get isWarning(): any {
        let cpustatus: boolean = false
        let memStatus: boolean = false
        let dbSpace: boolean = false
        let reqStatus: boolean = false
        this.cpuData.server > this.cpuData.warning_2 && (cpustatus = true)
        this.cpuData.server > this.cpuData.warning_1 && (cpustatus = true)
        this.memData.server_avail / this.memData.server_total < 1 - this.memData.warning_2 && (memStatus = true)
        this.memData.server_avail / this.memData.server_total < 1 - this.memData.warning_1 / 100 && (memStatus = true)
        this.dbSpace.disk_avail / this.dbSpace.disk_total < 1 - this.dbSpace.warning_2 / 100 && (dbSpace = true)
        this.dbSpace.disk_avail / this.dbSpace.disk_total < 1 - this.dbSpace.warning_1 / 100 && (dbSpace = true)
        this.requestData.failure_rate > this.requestData.warning_2 && (reqStatus = true)
        this.requestData.failure_rate > this.requestData.warning_1 && (reqStatus = true)
        return {
            CPU: {
                status: cpustatus,
                value: this.cpuData.server + '%'
            },
            Memory: {
                status: memStatus,
                value: ((1 - this.memData.server_avail / this.memData.server_total) * 100).toFixed(2) + '%'
            },
            Disk: {
                status: dbSpace,
                value: ((1 - this.dbSpace.disk_avail / this.dbSpace.disk_total) * 100).toFixed(2) + '%'
            },
            Request: {
                status: reqStatus,
                value: this.requestData.failure_rate + '%'
            }
        }
    }
    @Mutation
    updateDbStatus(params: any) {
        // cpu
        let cpu = params.dbData.cpu
        this.cpuData.self = cpu.self
        this.cpuData.server = cpu.server
        this.cpuData.unit = cpu.unit
        // memory
        let mem = params.dbData.memory
        this.memData.self = mem.self
        this.memData.server_avail = mem.server_avail
        this.memData.server_total = mem.server_total
        this.memData.unit = mem.unit
        // db_space
        let dbSpace = params.dbData.db_space
        this.dbSpace.disk_avail = dbSpace.disk_avail
        this.dbSpace.disk_total = dbSpace.disk_total
        this.dbSpace.space = dbSpace.space
        this.dbSpace.unit = dbSpace.unit
        // request
        let requestData = params.dbStatic
        this.requestData.failure_rate = requestData.failure_rate
        this.requestData.requests_second = requestData['requests/second']
        this.requestData.running_tasks = requestData.running_tasks
        this.requestData.writes_second = requestData['writes/second']
        // IOPS
        let ioData = params.dbData.disk
        if (ioData) {
            this.ioData.read = ioData.read
            this.ioData.write = ioData.write
            this.ioData.unit = ioData.unit
        }
    }
    @Mutation
    updateDbWarning(params: { type: string; data: { warning_1: number; warning_2: number } }) {
        if (params.type === 'cpu') {
            localStorage.__FMA_CPU_WARNING__ = JSON.stringify(params.data)
            this.cpuData.warning_1 = params.data.warning_1
            this.cpuData.warning_2 = params.data.warning_2
        } else if (params.type === 'memory') {
            localStorage.__FMA_MEM_WARNING__ = JSON.stringify(params.data)
            this.memData.warning_1 = params.data.warning_1
            this.memData.warning_2 = params.data.warning_2
        } else if (params.type === 'disk') {
            localStorage.__FMA_DISK_WARNING__ = JSON.stringify(params.data)
            this.dbSpace.warning_1 = params.data.warning_1
            this.dbSpace.warning_2 = params.data.warning_2
        } else if (params.type === 'request') {
            localStorage.__FMA_REQUEST_WARNING__ = JSON.stringify(params.data)
            this.requestData.warning_1 = params.data.warning_1
            this.requestData.warning_2 = params.data.warning_2
        }
    }
    @Action({ rawError: true, commit: 'updateDbStatus' })
    async getStatus() {
        let res = await Promise.all([getDBInfo(), getStatic()])
        if (res && res.length) {
            return {
                dbData: res[0].data,
                dbStatic: res[1].data
            }
        }
    }
}
