import * as THREE from 'three'
import { PingpongFBO } from './FBO'
import { gui } from './Gui'
import { three } from './core/Three'
import vertexShader from './shader/quadVs.glsl'
import fragmentShader from './shader/trailsFs.glsl'

export class Trails extends PingpongFBO {
  private mesh: THREE.Mesh<THREE.BufferGeometry, THREE.RawShaderMaterial>

  constructor(width: number, height: number) {
    super(width, height)
    this.mesh = this.createMesh(width, height)
    this.setControls()
  }

  private createMesh(width: number, height: number) {
    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        tEntityMap: { value: null },
        tPrev: { value: null },
        tOutline: { value: null },
        uOutlinePower: { value: 1 },
        uUvTransform: { value: [this.width / this.height, 1] },
        uPx: { value: [1 / width, 1 / height] },
        uDecay: { value: 0.9 },
      },
      vertexShader,
      fragmentShader,
    })
    const mesh = new THREE.Mesh(geometry, material)
    this.scene.add(mesh)
    three.addDisposableObject(geometry, material)
    return mesh
  }

  private setControls() {
    const folder = gui.addFolder('Trails')
    folder.add(this.uniforms.uDecay, 'value', 0.5, 0.99, 0.01).name('pheromone decay')
    folder.add(this.uniforms.uOutlinePower, 'value', 0, 1, 0.01).name('outline power')
  }

  get uniforms() {
    return this.mesh.material.uniforms
  }

  render() {
    this.swap()
    this.mesh.visible = true

    this.uniforms.tPrev.value = this.texture

    super.render()
    this.mesh.visible = false
  }
}
