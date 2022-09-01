import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { getLog } from '@/service/audit-log/audit-log.ts'

@Module({ name: 'AuditLog', namespaced: true })
export default class AuditLog extends VuexModule {
    logList: Array<any> = []
    @Mutation
    updateLogList(params: any) {
        this.logList = params ? params.data : []
    }
    @Action({ rawError: true, commit: 'updateLogList' })
    async getLog(params: { begin_time: string; end_time: string; num_log: string; user: string }) {
        let res = await getLog(params)
        if (res && res.status === 200) {
            return res
        }
    }
}
