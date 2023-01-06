import http from '../../core/http'

interface CreateSubGraph {
    name: string
    config: {
        max_size_GB: number
        async: boolean
        description: string
    }
}
interface options {
    [propName: string]: any
}
export function createSubGraph(params: CreateSubGraph) {
    let api_url = '/db'
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.post(api_url, params, options)
}

export function deleteSubGraph(params: string) {
    let api_url = '/db/' + params
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.delete(api_url, {}, options)
}

export function getAllSubGraph() {
    let api_url = '/db'
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.get(api_url, {}, options)
}
