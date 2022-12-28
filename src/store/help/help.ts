import { VuexModule, Module, Action } from 'vuex-module-decorators'
import { queryByCypher } from '@/service/cypher/cypher'
import { importTextData } from '@/service/import-data/import-data'
import { loadCppPlugin, loadPythonPlugin } from '@/service/plugin/plugin'
interface user {
    userName: string
    userRight: string
    graphList: {
        [propName: string]: string
    }
}
async function cypherScript(params: { graph: string; scripts: Array<any> }) {
    // let promiseList = []
    // params.scripts.forEach((item) => {
    //     promiseList.push()
    // })
    // let res: any = await Promise.all(promiseList)
    let n: number = params.scripts.length
    let status: string = 'success'
    let res
    for (let i = 0; i < n; i++) {
        res = await queryByCypher({ graph: params.graph, script: params.scripts[i] })
        if (res.status !== 200) {
            status = 'error'
            break
        }
    }
    console.log(res.data)
    if (status === 'success') {
        return {
            status: 'success'
        }
    } else {
        return {
            status: 'faild',
            error_messsage: res.data.error_message
        }
    }
}
@Module({ name: 'Help' })
export default class Help extends VuexModule {
    @Action
    async createLabels(params: { graph: string; scripts: Array<any> }) {
        let res = await cypherScript(params)
        return res
    }
    @Action
    async createIndexes(params: { graph: string; scripts: Array<any> }) {
        let res = await cypherScript(params)
        return res
    }
    @Action
    async createData(params: { graph: string; dataList: any[] }) {
        try {
            let len = params.dataList.length
            for (let i = 0; i < len; i++) {
                await importTextData({ graph: params.graph, data: params.dataList[i] })
            }
            return {
                status: 'success'
            }
        } catch (error) {
            return {
                status: 'faild',
                error_message: error
            }
        }
    }
    @Action
    async createPlugins(params: { graph: string; datalist: any[] }) {
        let promiseList = []
        params.datalist.forEach((item) => {
            if (item.code_type === 'py') {
                promiseList.push(loadPythonPlugin({ graph: params.graph, data: item }))
            } else {
                promiseList.push(loadCppPlugin({ graph: params.graph, data: item }))
            }
        })
        let res: any = await Promise.all(promiseList)
        let status = 'success'
        let errList = []
        res.forEach((item) => {
            if (item.status !== 200) {
                status = 'faild'
                errList.push(item.data.error_message)
            }
        })
        return {
            status: status,
            errors: errList
        }
    }
}
