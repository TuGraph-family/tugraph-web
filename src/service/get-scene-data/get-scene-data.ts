import http from '../../core/http'
let baseUrl = process.env.BASE_URL
interface options {
    [propName: string]: any
}

export function getSceneData(params: { dirName: string; fileName: string; last: string }) {
    let api_url = `${baseUrl}scene_data/${params.dirName}/${params.fileName}.${params.last}`
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.get(api_url, {}, options)
}
