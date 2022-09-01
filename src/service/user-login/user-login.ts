import http from '../../core/http'

interface userLoginParams {
    user: string
    password: string
}
interface options {
    [propName: string]: any
}
export function userLogin(params: userLoginParams) {
    let api_url = '/login'
    let options: options = {}
    return http.post(api_url, params, options)
}
