import http from '../../core/http'

interface options {
    [propName: string]: any
}

export function getTaskList() {
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.get('/task', {}, options)
}

export function killTask(params) {
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    let url = `/task/${params.task_id}`
    return http.delete(url, {}, options)
}
