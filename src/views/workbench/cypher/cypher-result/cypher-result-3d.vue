<template>
    <div class="workbench-cypher-result-graph-3d" ref="workbenchCypherResultGraph">
        <div class="graph-3d" ref="graph3D"></div>
    </div>
</template>
<script lang="ts">
import * as THREE from 'three'
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

import store from '@/store/index'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'

@Component
export default class WorkbenchCypherResultGraph3D extends Vue {
    public $refs!: {
        graph3D: HTMLElement
    }
    mounted() {
        camera.position.set(0, 0, 100)
        camera.lookAt(0, 0, 0)
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })

        const points = []
        points.push(new THREE.Vector3(-10, 0, 0))
        points.push(new THREE.Vector3(0, 10, 0))
        points.push(new THREE.Vector3(10, 0, 0))
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        const line = new THREE.Line(geometry, material)
        scene.add(line)
        renderer.render(scene, camera)
        this.$refs['graph3D'].appendChild(renderer.domElement)
    }
}
</script>
