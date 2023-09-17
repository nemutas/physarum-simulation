import * as THREE from 'three'
import { three } from './core/Three'

/**
 * FBO
 */
export abstract class FBO {
  protected scene = new THREE.Scene()
  private rt: THREE.WebGLRenderTarget

  constructor(
    public readonly width: number,
    public readonly height: number,
    data?: Float32Array,
  ) {
    this.rt = this.createRenderTarget(width, height, data)
  }

  private createRenderTarget(width: number, height: number, data?: Float32Array) {
    const rt = new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
    })

    const _data = data ?? new Float32Array(width * height * 4)
    const texture = new THREE.DataTexture(_data, width, height, THREE.RGBAFormat, THREE.FloatType)
    texture.needsUpdate = true
    rt.texture = texture
    three.addDisposableObject(rt, texture)
    return rt
  }

  protected setSize(width: number, height: number) {
    this.rt.setSize(width, height)
  }

  get texture() {
    return this.rt.texture
  }

  protected render(..._args: any[]) {
    three.renderer.setRenderTarget(this.rt)
    three.renderer.render(this.scene, three.camera)
    three.renderer.setRenderTarget(null)
  }
}

/**
 * PingpongFBO
 */
export abstract class PingpongFBO {
  protected scene = new THREE.Scene()
  private rt_1: THREE.WebGLRenderTarget
  private rt_2: THREE.WebGLRenderTarget
  private current: THREE.WebGLRenderTarget
  private next: THREE.WebGLRenderTarget

  constructor(
    public readonly width: number,
    public readonly height: number,
    data?: Float32Array,
  ) {
    this.rt_1 = this.createRenderTarget(width, height, data)
    this.rt_2 = this.createRenderTarget(width, height, data)
    this.current = this.rt_1
    this.next = this.rt_2
  }

  private createRenderTarget(width: number, height: number, data?: Float32Array) {
    const rt = new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
    })

    const _data = data ?? new Float32Array(width * height * 4)
    const texture = new THREE.DataTexture(_data, width, height, THREE.RGBAFormat, THREE.FloatType)
    texture.needsUpdate = true
    rt.texture = texture
    three.addDisposableObject(rt, texture)
    return rt
  }

  protected setSize(width: number, height: number) {
    this.rt_1.setSize(width, height)
    this.rt_2.setSize(width, height)
  }

  protected swap() {
    this.current = this.current === this.rt_1 ? this.rt_2 : this.rt_1
    this.next = this.current === this.rt_1 ? this.rt_2 : this.rt_1
  }

  get texture() {
    return this.current.texture
  }

  protected render(..._args: any[]) {
    three.renderer.setRenderTarget(this.next)
    three.renderer.render(this.scene, three.camera)
    three.renderer.setRenderTarget(null)
  }
}
