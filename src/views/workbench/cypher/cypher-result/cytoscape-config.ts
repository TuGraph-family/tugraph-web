const CYTOSCAPECONFIG: any = {
    container: null,
    elements: {
        nodes: [],
        edges: []
    },
    style: [
        {
            selector: 'node',
            style: {
                width: function(ele: any) {
                    let size = ele.data('size') || 0
                    return size
                },
                height: function(ele: any) {
                    let size = ele.data('size') || 0
                    return size
                },
                'border-width': function(ele: any) {
                    let size = ele.data('size') || 0
                    return size / 20
                },
                'font-size': function(ele: any) {
                    let size = ele.data('size') || 0
                    return size / 4
                },
                'border-color': function(ele: any) {
                    let color = ele.data('borderColor')
                    return color || '#98ACC3'
                },
                content: function(ele: any) {
                    let properties = ele.data('properties') || {}
                    let sysProperties = ele.data('sysPropties') || {}
                    let displayName = ele.data('displayName')
                    let displayNameSource = ele.data('displayNameSource')
                    let name = ''
                    if (displayNameSource === 'props') {
                        name = properties[displayName]
                    } else {
                        name = sysProperties[displayName]
                    }
                    return name + ''
                },
                color: '#fff',
                'text-outline-color': function(ele: any) {
                    let color = ele.data('color')
                    return color || '#98ACC3'
                },
                'text-outline-width': function(ele: any) {
                    let size = ele.data('size') || 0
                    return size / 30
                },
                'text-valign': 'center',
                'text-halign': 'center',
                'background-color': function(ele: any) {
                    let color = ele.data('color')
                    return color || '#98ACC3'
                }
            }
        },
        {
            selector: 'node.large',
            style: {}
        },
        {
            selector: 'node.active',
            style: {
                'border-width': function(ele: any) {
                    let size = ele.data('size')
                    return size / 6
                },
                'border-color': '#44527C'
            }
        },
        {
            selector: 'node.source',
            style: {
                'border-width': 10,
                'border-color': '#d6d6d6',
                content: '起点'
            }
        },
        {
            selector: 'node.end',
            style: {
                'border-width': 10,
                'border-color': '#d6d6d6',
                content: '终点'
            }
        },
        {
            selector: 'node.hover',
            style: {
                'border-width': function(ele: any) {
                    let size = ele.data('size')
                    return size / 6
                },
                'border-color': '#d6d6d6'
            }
        },
        {
            selector: 'node.hidden',
            style: {
                width: 0,
                height: 0
            }
        },
        {
            selector: 'node.isMerge',
            style: {
                width: 0,
                height: 0
            }
        },
        {
            selector: 'edge',
            style: {
                width: function(ele) {
                    let size = ele.data('size')
                    isNaN(size) && (size = 1)
                    return size || 0
                },
                'line-color': function(ele: any) {
                    let color = ele.data('color')
                    return color || '#98ACC3'
                },
                content: function(ele: any) {
                    let properties = ele.data('properties') || {}
                    let sysProperties = ele.data('sysPropties') || {}
                    let displayName = ele.data('displayName')
                    let displayNameSource = ele.data('displayNameSource')
                    let name = ''
                    if (displayNameSource === 'props') {
                        name = properties[displayName]
                    } else {
                        name = sysProperties[displayName]
                    }
                    return name || '' + ''
                },
                'edge-text-rotation': 'autorotate',
                'font-size': 14,
                padding: 3,
                'curve-style': 'bezier',
                'control-point-step-size': 80,
                'target-arrow-shape': 'vee',
                'target-arrow-color': function(ele: any) {
                    let color = ele.data('color')
                    return color || '#98ACC3'
                },
                'text-background-opacity': 1,
                'arrow-scale': 1.5,
                color: '#fff',
                'text-background-color': function(ele: any) {
                    let color = ele.data('color')
                    return color || '#98ACC3'
                },
                'text-background-shape': 'roundrectangle',
                'text-border-color': '#000',
                'text-wrap': 'wrap',
                'text-valign': 'top',
                'text-halign': 'center',
                'text-background-padding': 3
                // 'loop-direction': '0deg',
                // 'loop-sweep': '-100deg'
            }
        },
        {
            selector: 'edge.active',
            style: {
                'line-color': '#44527C',
                'target-arrow-color': '#44527C',
                'text-background-color': '#44527C',
                width: function(ele: any) {
                    return ele.data('size') + 4
                }
            }
        },
        {
            selector: 'edge.hover',
            style: {
                width: 3
            }
        },
        {
            selector: 'edge.merge',
            style: {
                width: function(ele: any) {
                    return 0
                }
            }
        },
        {
            selector: 'edge.merge.first',
            style: {
                width: function(ele: any) {
                    return 3
                },
                content: function(ele: any) {
                    let properties = ele.data('properties') || {}
                    let sysProperties = ele.data('sysPropties') || {}
                    let displayName = ele.data('displayName')
                    let num = ele.data('mergeData').length
                    let displayNameSource = ele.data('displayNameSource')
                    let name = ''
                    if (displayNameSource === 'props') {
                        ele.data('mergeData').forEach((data: any) => {
                            name += `[${data.properties[displayName]}] `
                        })
                    } else {
                        ele.data('mergeData').forEach((data: any) => {
                            if (displayName === 'label') {
                                name = `[${data.sysPropties[displayName]}] `
                            } else {
                                name += `[${data.sysPropties[displayName]}] `
                            }
                        })
                    }
                    return name + ` 合并数目: ${num}`
                }
            }
        },
        {
            selector: 'edge.hidden',
            style: {
                width: 0
            }
        }
    ],
    layout: { name: 'grid' },
    // initial viewport state:
    // zoom: 0.1,
    // pan: { x: '50%', y: '50%' },
    // interaction options:
    minZoom: 0.05,
    maxZoom: 3,
    zoomingEnabled: true,
    userZoomingEnabled: true,
    panningEnabled: true,
    userPanningEnabled: true,
    boxSelectionEnabled: false,
    selectionType: 'single',
    touchTapThreshold: 8,
    desktopTapThreshold: 4,
    autolock: false,
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
    // wheelSensitivity: 1,
    pixelRatio: 'auto'
}
const ADDEDGEOPTION = {
    canConnect: function(sourceNode, targetNode) {
        // whether an edge can be created between source and target
        // return !sourceNode.same(targetNode) // e.g. disallow loops
        return true
    },
    edgeParams: (sourceNode, targetNode) => {
        // for edges between the specified source and target
        // return element object to be passed to cy.add() for edge
        let id = new Date().getTime()
        return {
            data: {
                id: sourceNode.data('id') + '_' + targetNode.data('id') + '_' + id,
                color: '#98ACC3',
                size: 1,
                type: 'edge',
                properties: {},
                sysPropties: { uid: '', label: '' },
                displayName: '',
                displayNameSource: ''
            },
            classes: ['add-new-edge']
        }
    },

    hoverDelay: 0, // time spent hovering over a target node before it is considered selected
    snap: false, // when enabled, the edge can be drawn by just moving close to a target node (can be confusing on compound graphs)
    snapThreshold: 0, // the target node must be less than or equal to this many pixels away from the cursor/finger
    snapFrequency: 0, // the number of times per second (Hz) that snap checks done (lower is less expensive)
    noEdgeEventsInDraw: false, // set events:no to edges during draws, prevents mouseouts on compounds
    disableBrowserGestures: true // during an edge drawing gesture, disable browser gestures such as two-finger trackpad swipe and pinch-to-zoom
}
export { CYTOSCAPECONFIG, ADDEDGEOPTION }
