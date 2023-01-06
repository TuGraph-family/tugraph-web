import http from '../../core/http'

interface options {
    [propName: string]: any
}

export function getRoleList() {
    let api_url = `/role/`
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.get(api_url, {}, options)
}

export function setRolePermissions(params: { roleName: string; data: any }) {
    let api_url = `/role/${params.roleName}/permissions`
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.post(api_url, { ...params.data }, options)
}

export function setRoleDescription(params: { roleName: string; description: string }) {
    let api_url = `/role/${params.roleName}/description`
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.post(api_url, { description: params.description }, options)
}

export function delRole(name: string) {
    let api_url = `/role/${name}`
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.delete(api_url, {}, options)
}

export function enableOrDisableRole(params: { name: string; status: string }) {
    let api_url = `/role/${params.name}/${params.status}`
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.post(api_url, {}, options)
}

export function addRole(params: { role: string; description: string }) {
    let api_url = `/role`
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.post(api_url, { role: params.role, description: params.description }, options)
}
