import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import {
    getAllLabel,
    getLabelFormat,
    createLabel,
    getIndex,
    createIndex,
    deleteLabel,
    deleteFieldsFromLabel,
    addFieldsFromLabel,
    alterFieldsFromLabel,
    deleteIndex,
    getLabelDetail,
    importSchema
} from '@/service/create-label/create-label'
interface labelData {
    optional: boolean
    isIndex: boolean
    isUnique: boolean
    type: string
}
@Module({ name: 'CreateLabel' })
export default class CreateLabel extends VuexModule {
    allLabel: any[] = []
    @Mutation
    updateAllLabel(params: { graph: string; allLabel: any[] }) {
        let target = this.allLabel.find((item) => item.graph === params.graph)
        if (target) {
            target.allLabel = params.allLabel
        } else {
            this.allLabel.push(params)
        }
    }
    @Action({ commit: 'updateAllLabel' })
    async getAllLabel(params: { graph: string }) {
        let result = await getAllLabel(params)
        let promiseNodeDetailList: Array<any> = []
        let promiseEdgeDetailList: Array<any> = []
        let allLabel: any[] = []
        if (result.status === 200) {
            let data = result.data
            data.vertex.forEach((item: string) => {
                promiseNodeDetailList.push(getLabelDetail({ graphName: params.graph, labelName: item, labelType: 'vertex' }))
            })
            data.edge.forEach((item: string) => {
                promiseEdgeDetailList.push(getLabelDetail({ graphName: params.graph, labelName: item, labelType: 'edge' }))
            })

            let labelNodeDetailResult = await Promise.all(promiseNodeDetailList)
            let labelEdgeDetailResult = await Promise.all(promiseEdgeDetailList)

            labelNodeDetailResult.forEach((item) => {
                let data = item.data.result[0]
                data = JSON.parse(data)
                let props: any = {}
                data.properties.forEach((prop) => {
                    props[prop.name] = {
                        isIndex: prop.index,
                        isUnique: prop.unique || false,
                        optional: prop.optional,
                        type: prop.type
                    }
                })
                let obj = {
                    name: data.label,
                    type: 'node',
                    primary: data.primary,
                    props: props
                }
                allLabel.push(obj)
            })
            labelEdgeDetailResult.forEach((item) => {
                let data = item.data.result[0]
                data = JSON.parse(data)
                let props: any = {}
                data.properties.forEach((prop) => {
                    props[prop.name] = {
                        isIndex: prop.index,
                        isUnique: prop.unique || false,
                        optional: prop.optional,
                        type: prop.type
                    }
                })
                let obj = {
                    name: data.label,
                    type: 'edge',
                    props: props,
                    constraints: data.constraints
                }
                allLabel.push(obj)
            })
        }

        return {
            graph: params.graph,
            allLabel
        }
    }
    @Action
    async createLabel(params: { graph: string; data: { name: string; fields: any[]; is_vertex: boolean; primary: string; edge_constraints?: any[] } }) {
        let indexList: any[] = []
        let indexPromiseList: any[] = []
        let data: any = {
            name: params.data.name,
            fields: params.data.fields.map((item) => {
                if (!item.optional && item.isIndex && item.name !== params.data.primary) {
                    indexList.push({
                        label: params.data.name,
                        field: item.name,
                        is_unique: item.isUnique
                    })
                }
                return { name: item.name, type: item.type, optional: item.optional }
            }),
            is_vertex: params.data.is_vertex,
            primary: params.data.primary
        }
        if (!params.data.is_vertex) {
            data.edge_constraints = params.data.edge_constraints
        }
        let res = await createLabel({ graph: params.graph, data: data })
        indexList.forEach((item) => {
            indexPromiseList.push(createIndex({ graph: params.graph, data: item }))
        })
        await Promise.all(indexPromiseList)
        if (res.status === 200) {
            return Promise.resolve({
                msg: 'success'
            })
        } else {
            return Promise.resolve({
                msg: 'faild',
                text: res.data.error_message
            })
        }
    }
    @Action
    async deleteLabel(params: { graph: string; labelName: string; labelType: string }) {
        let res = await deleteLabel(params.graph, { labelType: params.labelType, labelName: params.labelName })
        if (res.status === 200) {
            return Promise.resolve({
                msg: 'success'
            })
        } else {
            return Promise.resolve({
                msg: 'faild'
            })
        }
    }
    @Action
    async deleteFieldsFromLabel(params: { graph: string; labelName: string; labelType: string; prop: string }) {
        let res = await deleteFieldsFromLabel(params.graph, { labelName: params.labelName, labelType: params.labelType, fields: [params.prop] })
        if (res.status === 200) {
            return Promise.resolve({
                msg: 'success'
            })
        } else {
            return Promise.resolve({
                msg: 'faild'
            })
        }
    }
    @Action
    async alterFieldsFromLabel(params: { graph: string; labelName: string; labelType: string; labelPropName: string; labelNewProp: labelData; labelOldProp: labelData; isNew: boolean }) {
        let res: any
        if (params.isNew) {
            if (!params.labelNewProp.optional) {
                let type = params.labelNewProp.type
                let defautValue: any = ''
                if (type.includes('int') || type.includes('double') || type.includes('float')) {
                    defautValue = 0
                } else if (type === 'date') {
                    defautValue = '2020-01-01'
                } else if (type === 'datetime') {
                    defautValue = '2020-01-01 00:00:00'
                } else if (type === 'bool') {
                    defautValue = false
                }
                res = await addFieldsFromLabel(params.graph, {
                    labelName: params.labelName,
                    labelType: params.labelType,
                    fields: [[params.labelPropName, params.labelNewProp.type, defautValue, false]]
                })
                if (params.labelNewProp.optional && params.labelNewProp.isIndex) {
                    await createIndex({ graph: params.graph, data: { label: params.labelName, field: params.labelPropName, is_unique: params.labelNewProp.isUnique } })
                }
            } else {
                res = await addFieldsFromLabel(params.graph, { labelName: params.labelName, labelType: params.labelType, fields: [[params.labelPropName, params.labelNewProp.type, null, true]] })
            }
        } else {
            if (!params.labelNewProp.optional) {
                // 调用下面的接口会自动取消index alterFieldsFromLabel
                res = await alterFieldsFromLabel(params.graph, { labelName: params.labelName, labelType: params.labelType, fields: [[params.labelPropName, params.labelNewProp.type, false]] })
                if (params.labelNewProp.isIndex) {
                    res = await createIndex({ graph: params.graph, data: { label: params.labelName, field: params.labelPropName, is_unique: params.labelNewProp.isUnique } })
                }
            } else {
                res = await alterFieldsFromLabel(params.graph, { labelName: params.labelName, labelType: params.labelType, fields: [[params.labelPropName, params.labelNewProp.type, true]] })
            }
        }
        if (res.status === 200) {
            return Promise.resolve({
                msg: 'success'
            })
        } else {
            return Promise.resolve({
                msg: 'faild',
                text: res.data.error_message
            })
        }
    }
    @Action
    async importSchema(params: { graphName: string; description: string }) {
        let res = await importSchema(params)
        if (res.status === 200) {
            return Promise.resolve({
                msg: 'success'
            })
        } else {
            return Promise.resolve({
                msg: 'faild',
                text: res.data.error_message
            })
        }
    }
}
