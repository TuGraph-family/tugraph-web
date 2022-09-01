const _self: Worker = self as any

// 把字符串按照逗号分隔成数组，"func1,"def add(a,b,c):\n z=a+b+c;return z",0"
// 解决双引号中有逗号和其他字符导致分隔不出来的问题
function CSVtoArray(text) {
    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g
    // Return NULL if input string is not well formed CSV string.
    // if (!re_valid.test(text)) return null
    var a = [] // Initialize array to receive values.
    text.replace(
        re_value, // "Walk" the string using replace with callback.
        function(m0, m1, m2, m3) {
            // Remove backslash from \' in single quoted values.
            if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"))
            // Remove backslash from \" in double quoted values.
            else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'))
            else if (m3 !== undefined) a.push(m3)
            return '' // Return empty string.
        }
    )
    // Handle special case of empty last value.
    if (/,\s*$/.test(text)) a.push('')
    return a
}
// 将大于16兆的数据进行切片
function getBufferData(data: Uint8Array, step: number, returnIndexList: Array<number>, start: number, bufferData: any[], startLine: number) {
    if (start + step < data.length) {
        // 向后查15兆的数据，如果没超过数据的大小
        // let index2: any = returnIndexList.findIndex((item: any) => {
        //     if (item > step + start) {
        //         return item
        //     }
        // })
        // 使用for循环提高性能
        // start 和 end 用来切割数据，
        let index: number
        for (let i = 1; i < returnIndexList.length; i++) {
            if (returnIndexList[i] > step + start) {
                index = i
                break
            }
        }
        let end = returnIndexList[index - 1] + 1

        let dataParams = data.slice(start, end)

        let obj = {
            startLine: startLine,
            endLine: index,
            data: dataParams
        }

        bufferData.push(obj)
        start = end
        getBufferData(data, step, returnIndexList, start, bufferData, index + 1)
    } else {
        let dataParams = data.slice(start, data.length)
        let obj = {
            startLine: startLine,
            endLine: returnIndexList.length,
            data: dataParams
        }
        bufferData.push(obj)
    }
}

// e.data.method [uploadData:导入数据，getTableData:获取展示数据]
// e.data.returnIndexList 如果存在就不分行，不存在就分行
_self.addEventListener('message', (e) => {
    let mapData = [] // 模板表格数据
    let snippet = null // 模板流数据
    let modelSize = 1000 * 1000 * 15 // 模板数据大小 15兆

    console.time('Uint8Array')
    var buffer = new Uint8Array(e.data.buffer)
    console.timeEnd('Uint8Array')
    var returnIndexList: Array<number> = e.data.returnIndexList || []
    if (!e.data.returnIndexList) {
        console.time('分行')
        let forLength = 100000000 // for循环极限
        let n = Math.ceil(buffer.length / forLength)
        // 双循环优化forEach，性能提示6倍
        for (let i = 0; i < n; i++) {
            let b = buffer.slice(i * forLength, (i + 1) * forLength)
            for (let j = 0; j < b.length; j++) {
                if (b[j] === 10) {
                    returnIndexList.push(j + i * forLength)
                }
            }
        }
        // buffer.forEach((item, index) => {
        //     if (item === 10) {
        //         returnIndexList.push(index)
        //     }
        // })
        console.timeEnd('分行')
    }

    let fileDecode = e.data.fileDecode
    if (buffer.length > modelSize) {
        let lastIndex = returnIndexList.findIndex((item) => item > modelSize)
        console.time('解析')
        snippet = new TextDecoder(fileDecode).decode(buffer.slice(0, returnIndexList[lastIndex]))
        console.timeEnd('解析')
    } else {
        console.time('解析')
        snippet = new TextDecoder(fileDecode).decode(buffer)
        console.timeEnd('解析')
    }

    console.time('组装表格')
    snippet
        .trim()
        .split(/\n/)
        .forEach((item, index) => {
            if (index < 10) {
                mapData.push({
                    arr: CSVtoArray(item)
                })
            }
        })
    console.timeEnd('组装表格')

    var bufferData: any = []
    console.time('切数据')
    let importDataBuffer = getBufferData(buffer, modelSize, returnIndexList, 0, bufferData, 1)
    // console.log(bufferData)
    _self.postMessage({ mapData, returnIndexList, importDataBuffer: bufferData })
    console.timeEnd('切数据')
    console.log('<-------------------------------------->')
})

_self.addEventListener('error', (e) => {})
