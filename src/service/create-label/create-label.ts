import http from '../../core/http'

export function getAllLabel(params: { graph: string }) {
    let api_url = `/db/${params.graph}/label`
    let options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.get(api_url, {}, options)
}

export function getLabelFormat(params: { graph: string; type: string; name: string }) {
    let api_url = `/db/${params.graph}/label/${params.type}/${params.name}`
    let options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.get(api_url, {}, options)
}

export function createLabel(params: { graph: string; data: { name: string; fields: any[]; is_vertex: boolean; edge_constraints?: string } }) {
    let api_url = `/db/${params.graph}/label`
    let options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.post(api_url, params.data, options)
}

export function createIndex(params: { graph: string; data: { label: string; field: string; is_unique: boolean } }) {
    let api_url = `/db/${params.graph}/index`
    let options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.post(api_url, params.data, options)
}

export function deleteIndex(params: { graph: string; label: string; prop: string }) {
    let api_url = `/db/${params.graph}/index/${params.label}/${params.prop}`
    let options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.delete(api_url, {}, options)
}

export function getIndex(params: { graph: string; label: string }) {
    let api_url = `/db/${params.graph}/index/${params.label}`
    let options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.get(api_url, {}, options)
}

// 删除label
export function deleteLabel(currentGraph: string, params: { labelName: string; labelType: string }) {
    let cypher = `CALL db.deleteLabel('${params.labelType}', '${params.labelName}')`
    let options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.post('/cypher', { graph: currentGraph, script: cypher }, options)
}
// 删除label中的属性
// fields ['field_name','field_name','field_name']
export function deleteFieldsFromLabel(currentGraph: string, params: { labelName: string; labelType: string; fields: [string] }) {
    let fields = JSON.stringify(params.fields)
    let cypher = `CALL db.alterLabelDelFields('${params.labelType}', '${params.labelName}',${fields})`
    let options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.post('/cypher', { graph: currentGraph, script: cypher }, options)
}

// 新增label的属性
// fields [[field_name, field_type, 'optional'],[field_name, field_type, 'optional']] optional为可选，不传递optional时：[field_name, field_type]
export function addFieldsFromLabel(currentGraph: string, params: { labelName: string; labelType: string; fields: [Array<any>] }) {
    let props: any = ``
    params.fields.forEach((prop) => {
        if (prop[2] === null || prop[1] === 'bool' || prop[1].includes('int') || prop[1].includes('double') || prop[1].includes('float')) {
            props = `["${prop[0]}",${prop[1]},${prop[2]},${prop[3]}]`
        } else {
            props = `["${prop[0]}",${prop[1]},"${prop[2]}",${prop[3]}]`
        }
    })
    let cypher = `CALL db.alterLabelAddFields('${params.labelType}', '${params.labelName}',${props})`
    let options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.post('/cypher', { graph: currentGraph, script: cypher }, options)
}

// 修改label的属性
// fields [[field_name, field_type, 'optional'],[field_name, field_type, 'optional']] optional为可选，不传递optional时：[field_name, field_type]
export function alterFieldsFromLabel(currentGraph: string, params: { labelName: string; labelType: string; fields: [any[]] }) {
    let props: any = []
    params.fields.forEach((prop) => {
        props = `["${prop[0]}",${prop[1]},${prop[2]}]`
    })
    props = props.toString()
    let cypher = `CALL db.alterLabelModFields('${params.labelType}', '${params.labelName}',${props})`
    let options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.post('/cypher', { graph: currentGraph, script: cypher }, options)
}

export function getLabelDetail(params: { labelName: string; labelType: string; graphName: string }) {
    let api_url = '/cypher'
    let cypher = params.labelType === 'vertex' ? `CALL db.getVertexSchema('${params.labelName}')` : `CALL db.getEdgeSchema('${params.labelName}')`
    let options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.post(
        api_url,
        {
            graph: params.graphName,
            script: cypher
        },
        options
    )
}

export function importSchema(params: { description: string; graphName: string }) {
    let api_url = `/db/${params.graphName}/schema/text`
    let options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.post(
        api_url,
        {
            description: params.description
        },
        options
    )
}
