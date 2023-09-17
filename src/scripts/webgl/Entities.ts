import * as THREE from 'three'
import { FBO } from './FBO'
import { three } from './core/Three'
import vertexShader from './shader/entitiesVs.glsl'
import fragmentShader from './shader/entitiesFs.glsl'

export class Entities extends FBO {
  private mesh: THREE.Points<THREE.BufferGeometry, THREE.RawShaderMaterial>

  constructor(width: number, height: number, widthSize: number, heightSize: number) {
    super(width, height)
    this.mesh = this.createMesh(widthSize, heightSize)
  }

  private createMesh(widthSize: number, heightSize: number) {
    const { positions, uvs } = this.createAttributes(widthSize, heightSize)

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2, true))

    const material = new THREE.RawShaderMaterial({
      uniforms: {
        tAgentMap: { value: null },
      },
      vertexShader,
      fragmentShader,
    })

    const mesh = new THREE.Points(geometry, material)

    this.scene.add(mesh)
    three.addDisposableObject(geometry, material)
    return mesh
  }

  private createAttributes(widthSize: number, heightSize: number) {
    const count = widthSize * heightSize
    const positions = new Float32Array(count * 3)
    const uvs = new Float32Array(count * 2)

    let idx: number
    for (let i = 0; i < count; i++) {
      idx = i * 3
      positions[idx + 0] = 0
      positions[idx + 1] = 0
      positions[idx + 2] = 0

      idx = i * 2
      uvs[idx + 0] = (i % widthSize) / widthSize
      uvs[idx + 1] = ~~(i / heightSize) / heightSize
    }

    return { positions, uvs }
  }

  get uniforms() {
    return this.mesh.material.uniforms
  }

  render() {
    this.mesh.visible = true

    super.render()
    this.mesh.visible = false
  }
}
