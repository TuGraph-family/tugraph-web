import axios from 'axios'
import Vue from 'vue'
let baseUrl = '/'

interface params {
    [propName: string]: any
}

//   参数预处理函数
function prepareParams(params: params): params {
    let newParams: params = {}
    if (params) {
        for (let key in params) {
            if (params[key] === '' || params[key] === null) {
                continue
            }
            newParams[key] = params[key]
        }
    }
    return params
}
//   请求成功
const onSuccess = function(response: params): params {
    return response
}
//   请求失败
const onError = function(error: params): params {
    console.log(error.response)
    // if (error.response.status === 500) {
    //     Vue.prototype.$message({
    //         message: error.response.statusText,
    //         type: 'error'
    //     })
    //     return
    // }
    return error.response
}

class HttpClient {
    private httpClient: any
    public constructor() {
        let httpClient = axios.create({
            baseURL: baseUrl,
            withCredentials: false
        })
        //   添加请求拦截器
        axios.interceptors.request.use(
            (config) => {
                //   在发送请求之前做些什么
                return config
            },
            function(error) {
                //   对请求错误做些什么
                return Promise.reject(error)
            }
        )

        //   添加响应拦截器
        axios.interceptors.response.use(
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
