import * as THREE from 'three'
import { three } from './core/Three'
import vertexShader from './shader/quadVs.glsl'
import fragmentShader from './shader/screenFs.glsl'
import { Trails } from './Trails'
import { Agents } from './Agents'
import { Entities } from './Entities'

export class Canvas {
  private trails!: Trails
  private agents!: Agents
  private entities!: Entities
  private screen!: THREE.Mesh<THREE.BufferGeometry, THREE.RawShaderMaterial>
  private outlineTextures: THREE.Texture[] = []
  private fps = document.querySelector<HTMLElement>('.fps')!
  private counter = 0

  constructor(canvas: HTMLCanvasElement) {
    this.loadTextures().then((outlineTextures) => {
      this.outlineTextures = outlineTextures

      this.init(canvas)
      this.createFBO()
      this.screen = this.createScreen()
      this.addEvents()
      three.animation(this.anime)
    })
  }

  private async loadTextures() {
    const loader = new THREE.TextureLoader()
    const paths = ['three.jpg', 'webgl.jpg']

    return await Promise.all(
      paths.map(async (path) => {
        const texture = await loader.loadAsync(import.meta.env.BASE_URL + 'images/' + path)
        texture.name = path.split('.')[0]
        return texture
      }),
    )
  }

  private init(canvas: HTMLCanvasElement) {
    three.setup(canvas)
  }

  private createFBO() {
    const size = 512
    let widthSize, heightSize
    if (1 < three.size.aspect) {
      heightSize = size
      widthSize = Math.trunc(heightSize * three.size.aspect)
    } else {
      widthSize = size
      heightSize = Math.trunc(widthSize * (1 / three.size.aspect))
    }

    const { width, height } = three.size

    this.trails = new Trails(width, height)
    this.agents = new Agents(widthSize, heightSize)
    this.entities = new Entities(width, height, widthSize, heightSize)

    this.trails.uniforms.tEntityMap.value = this.entities.texture
    this.agents.uniforms.tTrailMap.value = this.trails.texture
    this.entities.uniforms.tAgentMap.value = this.agents.texture

    this.trails.uniforms.tOutline.value = this.outlineTextures.find(({ name }) => name === 'three')
  }

  private createScreen() {
    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        tTrailMap: { value: this.trails.texture },
        uUvTransform: { value: three.coveredScale(this.trails.width / this.trails.height) },
      },
      vertexShader,
      fragmentShader,
    })
    const mesh = new THREE.Mesh(geometry, material)
    three.scene.add(mesh)
    three.addDisposableObject(geometry, material)
    return mesh
  }

  private addEvents() {
    three.addEventListener('resize', () => {
      this.screen.material.uniforms.uUvTransform.value = three.coveredScale(this.trails.width / this.trails.height)
    })
  }

  private anime = () => {
    this.counter++

    if (this.counter % 10 === 0) {
      this.fps.innerText = (1 / three.time.delta).toFixed(0)
    }

    if (this.counter % 800 === 0) {
      this.trails.uniforms.tOutline.value = this.outlineTextures[(this.counter / 800) % this.outlineTextures.length]
    }

    this.trails.render()
    this.agents.render()
    this.entities.render()

    three.render()
  }

  dispose() {
    three.dispose()
  }
}
