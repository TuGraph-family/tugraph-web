import http from '../../core/http'

interface options {
    [propName: string]: any
}

export function getUserList() {
    let api_url = `/user/`
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.get(api_url, {}, options)
}
export function getUserInfo(userName: string) {
    let api_url = `/user/${userName}`
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.get(api_url, {}, options)
}

export function getUserGraph(name: string) {
    let api_url = `/user/${name}/graph`

    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.get(api_url, {}, options)
}
export function delUser(name: string) {
    let api_url = `/user/${name}`
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.delete(api_url, {}, options)
}

export function addUser(params: { user: string; password: string; is_admin: boolean; description: string }) {
    let api_url = `/user`
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.post(
        api_url,
        {
            user: params.user,
            password: params.password,
            description: params.description
            // is_admin: params.is_admin
        },
        options
    )
}

// export function getUserAcl(params: { userName: string }) {
//     let options: options = {
//         headers: {
//             Authorization: localStorage.__FMA_TOKEN__
//         }
//     }
//     return http.get(`/acl/?user=${params.userName}`, {}, options)
// }

// export function delUserAcl(params: { userName: string; graphName: string }) {
//     let options: options = {
//         headers: {
//             Authorization: localStorage.__FMA_TOKEN__
//         }
//     }
//     return http.delete(`/acl/?user=${params.userName}&graph=${params.graphName}`, {}, options)
// }

// export function changeUserAcl(params: { userName: string; graphName: string; acl: 'FULL' | 'READ' | 'WRITE' | 'NONE' }) {
//     let options: options = {
//         headers: {
//             Authorization: localStorage.__FMA_TOKEN__
//         }
//     }
//     return http.put(
//         `/acl`,
//         {
//             user: params.userName,
//             graph: params.graphName,
//             acl: params.acl
//         },
//         options
//     )
// }

export function changeUserPwd(params: { name: string; oldPassword?: string; newPassword?: string; isAdmin: boolean }) {
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.put(
        `/user/${params.name}/password`,
        {
            current_password: params.oldPassword,
            new_password: params.newPassword
            //is_admin: params.isAdmin
        },
        options
    )
}

export function setUserRole(params: { name: string; roles: any[] }) {
    let api_url = `/user/${params.name}/role`
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.post(api_url, params.roles, options)
}

export function enableOrDisableUser(params: { name: string; status: string }) {
    let api_url = `/user/${params.name}/${params.status}`
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.post(api_url, {}, options)
}

export function changeUserDesc(params: { name: string; description: string }) {
    let options: options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.put(
        `/user/${params.name}/description`,
        {
            description: params.description
            //is_admin: params.isAdmin
        },
        options
    )
}
