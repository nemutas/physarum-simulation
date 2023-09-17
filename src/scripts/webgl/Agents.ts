import * as THREE from 'three'
import { PingpongFBO } from './FBO'
import { three } from './core/Three'
import vertexShader from './shader/quadVs.glsl'
import fragmentShader from './shader/agentsFs.glsl'
import { gui } from './Gui'

export class Agents extends PingpongFBO {
  private mesh: THREE.Mesh<THREE.BufferGeometry, THREE.RawShaderMaterial>

  constructor(width: number, height: number) {
    super(width, height, Agents.createDatas(width, height))
    this.mesh = this.createMesh(width, height)
    this.setControls()
  }

  private static createDatas(width: number, height: number) {
    const count = width * height
    const datas = new Float32Array(count * 4)

    let idx: number
    for (let i = 0; i < count; i++) {
      idx = i * 4
      // const x = Math.random() // pos x
      // const y = Math.random() // pos y
      const x = 0.002 * Math.sin(Math.random() * Math.PI * 2) + 0.5
      const y = 0.002 * Math.cos(Math.random() * Math.PI * 2) + 0.5

      datas[idx + 0] = x // pos x
      datas[idx + 1] = y // pos y
      datas[idx + 2] = Math.random() // angle
      datas[idx + 3] = 1
    }

    return datas
  }

  private createMesh(width: number, height: number) {
    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        tTrailMap: { value: null },
        tPrev: { value: null },
        uPx: { value: [1 / width, 1 / height] },
        uTime: { value: 0 },
        uSa: { value: Number((Math.PI / 6).toFixed(2)) }, // センサーの開き(角度)
        uRa: { value: Number((Math.PI / 20).toFixed(2)) }, // Agentの回転角
        uSo: { value: 8 }, // センサーの長さ
        uSs: { value: 1.4 }, // Agentの移動量
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
    const folder = gui.addFolder('Agents')
    folder.add(this.uniforms.uSa, 'value', 0.1, 1.0, 0.01).name('ditection angle')
    folder.add(this.uniforms.uRa, 'value', 0.1, 1.0, 0.01).name('rotation angle')
    folder.add(this.uniforms.uSo, 'value', 5, 20, 0.1).name('senser length')
    folder.add(this.uniforms.uSs, 'value', 0, 2, 0.01).name('movement')
  }

  get uniforms() {
    return this.mesh.material.uniforms
  }

  render() {
    this.swap()
    this.mesh.visible = true

    this.uniforms.tPrev.value = this.texture
    this.uniforms.uTime.value += three.time.delta

    super.render()
    this.mesh.visible = false
  }
}
