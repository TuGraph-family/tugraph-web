import { getApplicationData } from '@/service/get-public-data/get-public-data'
const Applications = [
    {
        name: 'TravelLine',
        key: 'TravelLine',
        createLabelScript: [
            `CALL db.createVertexLabel('城市', '名称' , '名称' ,STRING, false, '天气' ,STRING, false, 'lon', STRING, false, 'lat', STRING, false)`,
            `CALL db.createEdgeLabel('航班','[["城市","城市"]]','出发时间', STRING, false,'飞行时间', STRING, false,'航班名称', STRING, false,'价格', STRING, false,'到达时间', STRING, false)`
        ],
        data: async () => {
            let dirName = 'travel_line'
            let fileNames = [
                {
                    name: 'city',
                    description: {
                        files: [{ format: 'CSV', label: '城市', columns: ['名称', '天气', 'lon', 'lat'], header: 0 }]
                    }
                },
                {
                    name: 'flight',
                    description: {
                        files: [{ format: 'CSV', label: '航班', columns: ['出发时间', '飞行时间', '航班名称', '价格', '到达时间', 'SRC_ID', 'DST_ID'], header: 0, SRC_ID: '城市', DST_ID: '城市' }]
                    }
                }
            ]
            let dataPromiseList = []
            fileNames.forEach((item) => {
                dataPromiseList.push(getApplicationData({ dirName: dirName, fileName: item.name, last: 'csv' }))
            })
            let res = await Promise.all(dataPromiseList)
            let data = res.map((item, index) => {
                return { description: JSON.stringify(fileNames[index].description), continue_on_error: true, delimiter: ',', data: item.data }
            })
            return data
        }
    }
]

export default Applications
