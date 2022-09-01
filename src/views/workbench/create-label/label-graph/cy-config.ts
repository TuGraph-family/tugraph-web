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
                width: 'data(size)',
                height: 'data(size)',
                'border-width': 3,
                'border-color': 'data(borderColor)',
                content: 'data(displayName)',
                color: '#fff',
                'text-outline-color': 'data(color)',
                'text-outline-width': 2,
                'text-valign': 'center',
                'text-halign': 'center',
                'background-color': 'data(color)'
            }
        },
        {
            selector: 'node.active',
            style: {
                'border-color': '#e2e2e2',
                'border-width': 10
            }
        },
        {
            selector: 'node.hover',
            style: {
                'border-width': 10,
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
            selector: 'edge',
            style: {
                width: 'data(size)',
                'line-color': 'data(color)',
                content: 'data(displayName)',
                'edge-text-rotation': 'autorotate',
                'font-size': 14,
                padding: 3,
                'curve-style': 'bezier',
                'control-point-step-size': 40,
                'target-arrow-shape': 'vee',
                'target-arrow-color': 'data(color)',
                'text-background-opacity': 1,
                color: '#fff',
                'text-background-color': 'data(color)',
                'text-background-shape': 'roundrectangle',
                'text-border-color': '#000',
                'text-wrap': 'wrap',
                'text-valign': 'top',
                'text-halign': 'center',
                'text-background-padding': 3
            }
        },
        {
            selector: 'edge.active',
            style: {
                'line-color': '#44527C',
                'target-arrow-color': '#44527C',
                'text-background-color': '#44527C',
                width: 3
            }
        },
        {
            selector: 'edge.noConstraint',
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

export default CYTOSCAPECONFIG
