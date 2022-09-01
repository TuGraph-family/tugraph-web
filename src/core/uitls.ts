// 下载
export function downloadFile(fileName: string, content: Blob) {
    let aLink = document.createElement('a')
    let blob = content // new Blob([content]);
    let evt = document.createEvent('HTMLEvents')
    evt.initEvent('click', true, true) // initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
    aLink.download = fileName
    aLink.href = URL.createObjectURL(blob)

    //  aLink.dispatchEvent(evt);
    aLink.click()
}

export function formatSeconds(value) {
    var theTime: number = parseInt(value) // 需要转换的时间秒
    var theTime1: number = 0 // 分
    var theTime2: number = 0 // 小时
    var theTime3: number = 0 // 天
    if (theTime > 60) {
        theTime1 = parseInt((theTime / 60).toString())
        theTime = parseInt((theTime % 60).toString())
        if (theTime1 > 60) {
            theTime2 = parseInt((theTime1 / 60).toString())
            theTime1 = parseInt((theTime1 % 60).toString())
            if (theTime2 > 24) {
                // 大于24小时
                theTime3 = parseInt((theTime2 / 24).toString())
                theTime2 = parseInt((theTime2 % 24).toString())
            }
        }
    }
    var result = ''
    if (theTime > 0) {
        result = '' + parseInt(theTime.toString()) + '秒'
    }
    if (theTime1 > 0) {
        result = '' + parseInt(theTime1.toString()) + '分' + result
    }
    if (theTime2 > 0) {
        result = '' + parseInt(theTime2.toString()) + '小时' + result
    }
    if (theTime3 > 0) {
        result = '' + parseInt(theTime3.toString()) + '天' + result
    }
    return result
}

export function throttle(fn: Function, delay: number) {
    let valid = true
    return function() {
        if (!valid) {
            //休息时间 暂不接客
            return false
        }
        // 工作时间，执行函数并且在间隔期内把状态位设为无效
        valid = false
        setTimeout(() => {
            fn()
            valid = true
        }, delay)
    }
}

export function copyToClipboardAsync(str) {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(str)
        return {
            text: 'ok'
        }
    }
    return {
        text: 'The Clipboard API is not available.'
    }
}
