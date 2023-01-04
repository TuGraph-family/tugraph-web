import http from '../../core/http'

// interface data {
//     description: string
//     data: any
//     continue_on_error: boolean
// }
interface options {
    [propName: string]: any
}
export function importTextData(params: { graph: string; data: { description: string; data: any; continue_on_error: boolean } }) {
    let api_url = `/db/${params.graph}/import/text`
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.post(api_url, params.data, options)
}

export function getSchema(params: { graph: string; type: string; label: string }) {
    let api_url = `/db/${params.graph}/label/${params.type}/${params.label}`
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.get(api_url, {}, options)
}
