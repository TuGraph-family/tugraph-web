const forceOption: any = {
    name: 'euler',
    springLength: 240,
    fit: false,
    springCoeff: 0.0008,
    mass: 20,
    dragCoeff: 1.8,
    gravity: -20,
    pull: 0.009,
    randomize: false,
    padding: 0,
    infinite: true,
    stop: function(ele: any) {}
}
const gridOption: any = {
    name: 'grid',
    fit: true,
    stop: function(ele: any) {}
}
const circleOption: any = {
    name: 'circle',
    fit: true,
    stop: function(ele: any) {}
}
const treeOption: any = {
    name: 'breadthfirst',
    fit: true,
    stop: function(ele: any) {}
}

export { forceOption, gridOption, circleOption, treeOption }
