let indexDB = window.indexedDB

let db

let dbName = 'TuGraphIndexDB'
let version = 1
const request = indexedDB.open(dbName, version)

request.onsuccess = (event: any) => {
    let db = event.target.result
    console.log('数据库打开成功')
}

request.onerror = (event: any) => {
    console.log('数据库打开失败')
}
