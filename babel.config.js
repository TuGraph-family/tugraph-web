let transformRemoveConsolePlugin = []
if (process.env.NODE_ENV === 'production') {
    transformRemoveConsolePlugin = ['transform-remove-console']
}
module.exports = {
    presets: [['@vue/cli-plugin-babel/preset', { modules: false }]],
    plugins: [
        [
            'component',
            {
                libraryName: 'element-ui',
                styleLibraryName: 'theme-chalk'
            },
            ...transformRemoveConsolePlugin
        ]
    ]
}
