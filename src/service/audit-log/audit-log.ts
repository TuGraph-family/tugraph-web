import http from '../../core/http'

interface options {
    [propName: string]: any
}
export function getLog(params: { begin_time: string; end_time: string; user: string; num_log: string }) {
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.get(`/info/log/?begin_time=${params.begin_time}&end_time=${params.end_time}&user=${params.user}&num_log=${params.num_log}&log_order=true`, {}, options)
}
