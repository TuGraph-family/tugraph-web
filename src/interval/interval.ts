function intervalTask() {
    let n = 0
}

class Interval {
    private taskList: { [p: string]: any } = {}
    private status: string = 'stop'
    // time执行间隔时间 s
    registTask(params: { time: number; fun: any }): string {
        let taskId = new Date().getTime() + ''
        this.taskList[taskId] = {
            time: params.time,
            fun: params.fun
        }
        return taskId
    }
    deleteTask(params: { taskId: string }) {
        Reflect.deleteProperty(this.taskList, params.taskId)
    }
    start() {
        if (this.status === 'stop') {
            let n = 0
            this.status = 'start'
            setInterval(() => {
                n++
                Object.keys(this.taskList).forEach((item: any) => {
                    if (n % this.taskList[item].time === 0) {
                        this.taskList[item].fun()
                    }
                })
            }, 1000)
        } else {
            console.warn('interval status is started')
        }
    }
}

export default Interval
