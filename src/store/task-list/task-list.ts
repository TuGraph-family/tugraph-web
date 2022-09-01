import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { getTaskList, killTask } from '@/service/task-list/task-list.ts'
@Module({ name: 'TaskList', namespaced: true })
export default class UserLogin extends VuexModule {
    taskList: any[] = []
    @Mutation
    updateTaskList(params: Array<any>) {
        this.taskList = params
    }

    @Action({ commit: 'updateTaskList' })
    async getTaskList() {
        let res = await getTaskList()
        if (res.status === 200) {
            return res.data
        }
    }

    @Action
    async killTask(params: { taskId: string }) {
        let res = await killTask({ task_id: params.taskId })
        if (res.status === 200) {
            return Promise.resolve({
                status: 'success'
            })
        } else {
            return Promise.resolve({
                status: 'faild'
            })
        }
    }
}
