const cyConfig: any = {
    // very commonly used options
    container: undefined,
    elements: {
        nodes: [],
        edges: []
    },
    style: [
        {
            selector: 'node',
            style: {
                label: 'data(displayName)',
                'text-margin-y': 20,
                width: 155,
                height: 24,
                'font-family': 'Microsoft YaHei',
                color: '#44527C',
                'font-size': '14px',
                'background-color': '#fff',
                'border-color': '#E9E9E9',
                shape: 'rectangle',
                'border-width': 1,
                'border-opacity': 1,
                'text-wrap': 'ellipsis',
                'text-max-width': 150,
                'z-index': 66,
                'overlay-opacity': 0
            }
        },
        {
            selector: '.hover',
            style: {
                'border-width': 1,
                'border-color': '#3E8CF6',
                'z-index': 9999
            }
        },
        {
            selector: 'node[type = "header"]',
            style: {
                width: 310,
                height: 24,
                'font-family': 'Microsoft YaHei',
                color: '#fff',
                'font-size': '14px',
                'background-color': '#44527C',
                'border-width': 0,
                'border-opacity': 0,
                'text-wrap': 'ellipsis',
                'text-max-width': 300
            }
        },
        {
            selector: 'node[type = "TableFather"]',
            style: {
                label: 'data(displayName)',
                'text-halign': 'left',
                'text-margin-x': -13,
                'background-color': '#E6EAF2',
                'border-color': 'transparent',
                'font-family': 'Microsoft YaHei',
                'font-size': '14px',
                color: '#44527C',
                padding: 0,
                'border-width': 0
            }
        },
        {
            selector: 'node[type = "introText"]',
            style: {
                width: 850,
                'text-max-width': 800,
                label: 'data(displayName)',
                'background-color': '#E6EAF2',
                'border-color': 'transparent',
                'font-family': 'Microsoft YaHei',
                'font-size': '14px',
                color: '#3E8CF6',
                padding: 0,
                'border-width': 0
            }
        },
        {
            selector: 'node[type = "label"]',
            style: {
                height: 48,
                'line-height': 1.5,
                'text-margin-y': 2,
                'text-wrap': 'wrap',
                'text-max-width': 150,
                'text-valign': 'center',
                'z-index': 9999,
                'border-color': '#E6EAF2',
                padding: 0,
                'border-width': 2
            }
        },
        {
            selector: 'node[type = "csvColParent"]',
            style: {
                'z-index': 9999,
                'background-color': '#E6EAF2',
                'border-color': '#E6EAF2',
                padding: 0,
                'border-width': 2
            }
        },
        {
            selector: 'edge',
            style: {
                width: 1,
                'line-color': '#44527C',
                'edge-text-rotation': 'autorotate',
                'font-family': 'Microsoft YaHei',
                'font-size': '14px',
                padding: 3,
                'curve-style': 'bezier',
                'control-point-step-size': 20,
                'target-arrow-shape': 'vee',
                'target-arrow-color': '#44527C',
                'text-background-opacity': 1,
                // 'target-distance-from-node': 10,
                'source-endpoint': '0deg',
                'target-endpoint': '180deg'
            }
        },
        {
            selector: 'edge:selected',
            style: {
                'line-color': '#3E8CF6 ',
                'edge-text-rotation': 'autorotate',
                'font-family': 'Microsoft YaHei',
                'font-size': '14px',
                padding: 3,
                'curve-style': 'bezier',
                'control-point-step-size': 20,
                'target-arrow-shape': 'vee',
                'target-arrow-color': '#3E8CF6 ',
                'text-background-opacity': 1,
                // 'target-distance-from-node': 10,
                'source-endpoint': '0deg',
                'target-endpoint': '180deg'
            }
        }
    ],
    layout: { name: 'preset' },
    minZoom: 0.05,
    maxZoom: 3,
    radius: undefined,
    zoomingEnabled: true,
    userZoomingEnabled: true,
    panningEnabled: true,
    userPanningEnabled: true,
    boxSelectionEnabled: false,
    selected: true,
    selectionType: 'single',
    touchTapThreshold: 8,
    desktopTapThreshold: 4,
    autolock: true,
    autoungrabify: false,
    autounselectify: false,
    // rendering options:
    headless: false,
    styleEnabled: true,
    hideEdgesOnViewport: false,
    hideLabelsOnViewport: false,
    textureOnViewport: false,
    motionBlur: false,
    motionBlurOpacity: 0.2,
    wheelSensitivity: 0.2,
    pixelRatio: 'auto'
}
export default cyConfig
