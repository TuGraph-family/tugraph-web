import http from '../../core/http'

interface options {
    [propName: string]: any
}

export function loadCppPlugin(params: { graph: string; data: { name: string; description: string; code_base64: string; read_only: boolean } }) {
    let api_url = `/db/${params.graph}/cpp_plugin`
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.post(api_url, params.data, options)
}

export function loadPythonPlugin(params: { graph: string; data: { name: string; description: string; code_base64: string; read_only: boolean; code_type: string } }) {
    let api_url = `/db/${params.graph}/python_plugin`
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.post(api_url, params.data, options)
}
export function getCppPlugin(graph: string) {
    let api_url = `/db/${graph}/cpp_plugin`
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.get(api_url, {}, options)
}
export function getPythonPlugin(graph: string) {
    let api_url = `/db/${graph}/python_plugin`
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.get(api_url, {}, options)
}
export function excuteCppPlugin(params: { graph: string; name: string; data: { data: string; timeout: number; in_process: boolean } }) {
    let api_url = `/db/${params.graph}/cpp_plugin/${params.name}`
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.post(api_url, params.data, options)
}

export function excutePythonPlugin(params: { graph: string; name: string; data: { data: string; timeout: number; in_process: boolean } }) {
    let api_url = `/db/${params.graph}/python_plugin/${params.name}`
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.post(api_url, params.data, options)
}
export function deleteCppPlugin(params: { graph: string; name: string }) {
    let api_url = `/db/${params.graph}/cpp_plugin/${params.name}`
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.delete(api_url, {}, options)
}
export function deletePythonPlugin(params: { graph: string; name: string }) {
    let api_url = `/db/${params.graph}/python_plugin/${params.name}`
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.delete(api_url, {}, options)
}
export function getCppPluginDetail(params: { graph: string; name: string }) {
    let api_url = `/db/${params.graph}/cpp_plugin/${params.name}`
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.get(api_url, {}, options)
}

export function getPyPluginDetail(params: { graph: string; name: string }) {
    let api_url = `/db/${params.graph}/python_plugin/${params.name}`
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.get(api_url, {}, options)
}
