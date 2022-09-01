import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { getAllLabel, getIndex } from '@/service/create-label/create-label'
import { importTextData, getSchema } from '@/service/import-data/import-data'

@Module({ name: 'ImportData' })
export default class ImportData extends VuexModule {
    @Action
    async getIndex(params: { graph: string; label: string }) {
        let res = await getIndex(params)
        if (res.status === 200) {
            var p = res.data.find((item) => item.is_unique === true)
            if (p) {
                return p.field
            } else {
                return ''
            }
        }
    }
    @Action({ rawError: true })
    async getAllLabels(params: { graph: string; index: number; callback: (x: number, y: any) => void }) {
        let _response = await getAllLabel(params)
        if (_response.status === 200) {
            var v_arr = []
            for (var i = 0; i < _response.data.vertex.length; i++) {
                var o = {
                    value: _response.data.vertex[i],
                    label: _response.data.vertex[i],
                    key: 'node' + i,
                    type: 'node'
                }
                v_arr.push(o)
            }
            var e_arr = []
            for (var j = 0; j < _response.data.edge.length; j++) {
                var p = {
                    value: _response.data.edge[j],
                    label: _response.data.edge[j],
                    key: 'edge' + j,
                    type: 'relationship'
                }
                e_arr.push(p)
            }
            var tempArr = []

            params.callback(params.index, tempArr.concat(v_arr, e_arr))
        }
    }
    @Action({ rawError: true })
    async getVertexLabels(params: { graph: string; callback: (y: any) => void }) {
        let _response = await getAllLabel(params)
        if (_response.status === 200) {
            var v_arr = []
            for (var i = 0; i < _response.data.vertex.length; i++) {
                var o = {
                    value: _response.data.vertex[i],
                    label: _response.data.vertex[i],
                    key: 'node' + i,
                    type: 'node'
                }
                v_arr.push(o)
            }
            params.callback(v_arr)
        }
    }
    @Action({ rawError: true })
    async getSchema(params: { graph: string; type: string; label: string }) {
        let res = await getSchema(params)
        if (res.status === 200) {
            var _response = []
            var obj = {}
            for (var item in res.data) {
                if (item === 'status' || item === '__res__') {
                    continue
                }
                obj = {
                    name: item
                }
                _response.push(obj)
                var innerObj = res.data[item]
                for (var _item in innerObj) {
                    obj[_item] = innerObj[_item] + ''
                }
            }
            console.log(_response)
            return _response
        }
    }

    @Action({ rawError: true })
    async importTextData(params: { graph: string; data: { description: string; data: any; continue_on_error: boolean; delimiter: string } }) {
        let res = await importTextData(params)
        return res
    }
}
