import http from '../../core/http'

interface options {
    [propName: string]: any
}

export function getDBInfo() {
    let api_url = `/info`
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.get(api_url, {}, options)
}

export function getStatic() {
    let api_url = `/info/statistics`
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.get(api_url, {}, options)
}

export function getDBInfoPeers() {
    let api_url = `/info/peers`
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.get(api_url, {}, options)
}
