import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'
import vertex from './shader/vertexShader.glsl'
import fragment from './shader/fragmentShader.glsl'

class Model {
    constructor (obj) {
        // console.log(obj)
        this.name = obj.name
        this.file = obj.file
        this.scene = obj.scene
        this.placeOnLoad = obj.placeOnLoad

        this.color1 = obj.color1
        this.color2 = obj.color2

        this.loader = new GLTFLoader()
        this.dracoLoader = new DRACOLoader()
        this.dracoLoader.setDecoderPath('./draco/')
        this.loader.setDRACOLoader(this.dracoLoader)
        
        this.init()
    }

    init() {
        this.loader.load(this.file, (response) => {

            /*------------------------------
            Original Mesh
            ------------------------------*/
            this.mesh = response.scene.children[0]

            /*------------------------------
            Material Mesh
            ------------------------------*/
            // this.material = new THREE.MeshBasicMaterial({
            //     color: 'red',
            //     wireframe: true
            // })
            // this.mesh.material = this.material
            // this.scene.add(this.mesh)

            /*------------------------------
            Geometry Mesh
            ------------------------------*/
            this.geometry = this.mesh.geometry
            // console.log(this.geometry)


            /*------------------------------
            Particles Material
            ------------------------------*/
            // this.particlesMaterial = new THREE.PointsMaterial({
            //     color: 'red',
            //     size: 0.02
            // })
            this.particlesMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    uColor1: { value: new THREE.Color(this.color1)},
                    uColor2: { value: new THREE.Color(this.color2)}
                },
                vertexShader: vertex,
                fragmentShader: fragment,
                transparent: true,
                depthTest: false,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            })


            /*------------------------------
            Particles Geometry
            ------------------------------*/
            const sampler = new MeshSurfaceSampler(this.mesh).build()
            const numParticles = 20000
            this.particlesGeometry = new THREE.BufferGeometry()
            const particlesPostion = new Float32Array(numParticles * 3)

            for (let i = 0; i < numParticles; i++) {
                const newPosition = new THREE.Vector3()
                sampler.sample(newPosition)
                particlesPostion.set([
                    newPosition.x,
                    newPosition.y,
                    newPosition.z
                ], i * 3)
            }

            this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPostion, 3))
            
            console.log(this.particlesGeometry)

            /*------------------------------
            Particles
            ------------------------------*/
            this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial)


            /*------------------------------
            Place On Load
            ------------------------------*/
            if (this.placeOnLoad) {
                this.add()
            }
        })
    }

    add() {
        this.scene.add(this.particles)
    }

    remove() {
        this.scene.remove(this.particles)
    }
}
export default Model