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
    if (params.user && params.password) {
        return http.post(api_url, params, options)
    }
}

export function refreshToken(params: { jwt: string }) {
    let api_url = '/refresh'
    let options: options = {
        headers: {
            Authorization: params.jwt
        }
    }
    return http.post(api_url, params, options)
}

export function logout(params: { jwt: string }) {
    let api_url = '/logout'
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.post(api_url, params, options)
}
