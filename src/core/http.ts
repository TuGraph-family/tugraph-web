import axios from 'axios'
import Vue from 'vue'
import router from '../router/index'
let baseUrl = '/'

function getType(data: any): string {
    let type: string = ''
    type = Object.prototype.toString
        .call([])
        .replace(/\[|]/gi, '')
        .split(/\s/)[1]
    return type
}

interface params {
    [propName: string]: any
}

//   参数预处理函数
function prepareParams(params: params): params {
    if (getType(params) === 'Object') {
        let newParams: params = {}
        for (let key in params) {
            if (params[key] === '' || params[key] === null) {
                continue
            }
            newParams[key] = params[key]
        }
        return newParams
    }
    if (getType(params) === 'Array') {
        return params
    }
}
//   请求成功
const onSuccess = function(response: params): params {
    return response
}
//   请求失败
const onError = function(error: params): params {
    // console.log(error.response)
    if (error.response && error.response.status === 401 && error.response.data.error_message.includes('token')) {
        router.push({ name: 'UserLogin' })
        localStorage.__FMA_TOKEN__ = ''
        // localStorage.__FMA_USERINFO__ = ''
    }
    return error.response
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time))
}
class HttpClient {
    private httpClient: any
    public constructor() {
        let httpClient = axios.create({
            baseURL: baseUrl,
            withCredentials: false
        })
        //   添加请求拦截器
        httpClient.interceptors.request.use(
            async (config) => {
                // 在发送请求之前做些什么
                // 如果请求时候，与刷新token发生碰撞，进行3秒延迟
                if (!config.headers.Authorization && config.url !== '/login' && config.url !== '/refresh') {
                    await sleep(3000)
                    console.log(localStorage.__FMA_TOKEN__)
                    config.headers.Authorization = localStorage.__FMA_TOKEN__
                    return config
                } else {
                    return config
                }
            },
            function(error) {
                //   对请求错误做些什么
                console.log(error)
                return Promise.reject(error)
            }
        )

        //   添加响应拦截器
        httpClient.interceptors.response.use(
            (response) => {
                //   对响应数据做点什么
                return response
            },
            (error) => {
                //   对响应错误做点什么
                return Promise.reject(error)
            }
        )
        this.httpClient = httpClient
    }

    //  GET
    public get(url: string, params: params, options: params) {
        return this.httpClient
            .get(url, {
                params: prepareParams(params),
                ...options
            })
            .then(onSuccess)
            .catch(onError)
    }

    //   POST
    public post(url: string, params: params, options: params) {
        return this.httpClient
            .post(url, prepareParams(params), options)
            .then(onSuccess)
            .catch(onError)
    }

    //   PUT
    public put(url: string, params: params, options: params) {
        return this.httpClient
            .put(url, (params = prepareParams(params)), options)
            .then(onSuccess)
            .catch(onError)
    }

    //   DELETE
    public delete(url: string, params: params, options: params) {
        return this.httpClient
            .delete(url, {
                params: prepareParams(params),
                ...options
            })
            .then(onSuccess)
            .catch(onError)
    }
}

export default new HttpClient()
