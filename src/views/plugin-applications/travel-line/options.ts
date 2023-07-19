import { mapZHName } from './mapzhname'
const planePath =
    'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z'
export const option: any = {
    // backgroundColor: '#020305',
    title: {
        // text: '环球旅行',
        // // subtext: '数据仅供演示',
        // left: 'center',
        // textStyle: {
        //     color: '#fff',
        //     fontSize: 38
        // }
    },
    geo: {
        type: 'map',
        map: 'world',
        zoom: 1.1,
        roam: true,
        itemStyle: {
            areaColor: 'rgba(0,0,0,0.5)',
            borderColor: 'rgba(255,255,255,0.3)',
            borderWidth: 1
        },
        nameMap: { ...mapZHName },
        emphasis: {
            itemStyle: {
                areaColor: 'rgba(0,0,0,0.8)'
            },
            label: {
                color: '#fff'
            }
        }
    },
    tooltip: {
        trigger: 'item'
    },
    series: [
        {
            type: 'lines',
            symbolSize: 20,
            symbol: ['none', planePath],
            lineStyle: {
                curveness: 0.3,
                width: 2,
                color: 'yellow',
                opcity: 0
            },
            data: [],
            effect: {
                show: true,
                period: 10,
                trailLength: 0,
                symbol: planePath,
                symbolSize: 20
            }
        }
    ]
}
