import http from '../../core/http'

export function queryByCypher(params: { graph: string; script: string }) {
    let api_url = '/cypher'
    let options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.post(api_url, params, options)
}

export function getSubGraph(params: { graph: string; nodeIds: Array<number> }) {
    // let api_url = `/db/${params.graph}/misc/sub_graph`
    let api_url = `/cypher`
    let options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.post(api_url, { graph: params.graph, script: `call db.subgraph([${params.nodeIds}])` }, options)
}
export function getRelationshipAll(params: { graph: string; src: string }) {
    let api_url = `/db/${params.graph}/node/${params.src}/relationship/all`
    let options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.get(api_url, {}, options)
}
export function addNode(params: { graph: string; data: { label: string; property: { [propName: string]: any } } }) {
    let api_url = `/db/${params.graph}/node`
    let options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.post(api_url, params.data, options)
}
export function addEdge(params: { graph: string; src: string; data: { destination: number; label: string; property: { [propName: string]: any } } }) {
    let api_url = `/db/${params.graph}/node/${params.src}/relationship`
    let options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.post(api_url, params.data, options)
}

export function editNode(params: { graph: string; vertex_id: string; data: any }) {
    let api_url = `/db/${params.graph}/node/${params.vertex_id}`
    let options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.put(api_url, params.data, options)
}
export function editEdge(params: { graph: string; euid: string; data: any }) {
    let api_url = `/db/${params.graph}/relationship/${params.euid}`
    let options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.put(api_url, params.data, options)
}
export function deleteNode(params: { graph: string; vertex_id: string }) {
    let api_url = `/db/${params.graph}/node/${params.vertex_id}`
    let options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.delete(api_url, {}, options)
}
export function deleteEdge(params: { graph: string; euid: string }) {
    let api_url = `/db/${params.graph}/relationship/${params.euid}`
    let options = {
        headers: {
            Authorization: localStorage.__FMA_TOKEN__
        }
    }
    return http.delete(api_url, {}, options)
}
