import { shaderMaterial, useTexture } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useSpring } from "framer-motion";
import { useEffect, useLayoutEffect, useRef } from "react";
import { MirroredRepeatWrapping } from "three";
import { MathUtils } from "three/src/math/MathUtils.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PUSH_FORCE = 0.5;

const ImageSliderMaterial = shaderMaterial(
  {
    uProgression: 1.0,
    uPushForce: PUSH_FORCE,
    uTexture: undefined,
    uDispTexture: undefined,
    uDirection: 1,
    uMousePosition: [0, 0],
  },
  /*glsl*/ `
    varying vec2 vUv;
    varying float vPushed;
    uniform float uPushForce;
    uniform vec2 uMousePosition;
    void main() {
      vUv = uv;
      vec2 centeredUv = (vUv - 0.5) * vec2(-2.0, -2.0);
      float pushed = length(centeredUv - uMousePosition);
      pushed = 1.0 - smoothstep(0.0, 1.5, pushed);
      pushed = -uPushForce * pushed;
      vPushed = pushed;
      vec3 dispPosition = position;
      dispPosition.z = pushed;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(dispPosition, 1.0);
    }`,
  /*glsl*/ ` 
  varying vec2 vUv;
  varying float vPushed;
  uniform sampler2D uTexture;
  uniform sampler2D uDispTexture;
  uniform float uProgression;
  uniform int uDirection;

  void main() {
    vec2 uv = vUv;
    float dispTexture = texture2D(uDispTexture, uv).r;
    vec2 distortedPosition = vec2(uv.x - float(uDirection) * (1.0 - uProgression) * dispTexture, uv.y);
    vec4 curTexture = texture2D(uTexture, distortedPosition + vec2(vPushed * 0.05));
    gl_FragColor = curTexture;
  }`
);

extend({
  ImageSliderMaterial,
});

export const ImageSlider = ({ width = 3, height = 2, fillPercent = 0.5 }) => {
  const image = "dwbusiness.png";
  const texture = useTexture(image);
  const dispTexture = useTexture("displacement/TCom_Ice_Cracked_header.jpg");
  texture.wrapS = texture.wrapT = MirroredRepeatWrapping;
  const material = useRef();
  const progression = useSpring(0, {
    stiffness: 1500,
    damping: 250,
    mass: 2,
  });

  const imageMesh = useRef();

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: ".two",
      start: "top bottom",
      end: "90% bottom", 
      scrub: 1,
      onUpdate: (self) => {
        progression.set(self.progress); 
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  useLayoutEffect(() => {
    const tl = gsap.timeline();
    let mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 800px)",
      isMobile: "(max-width: 799px)"
    }, (context) => {
      let { isMobile, isDesktop } = context.conditions;

      tl.to(imageMesh.current.scale, {
        x: 1.6,
        z: 1.6,
        y: 1.6,
        scrollTrigger: {
          trigger: ".two",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          immediateRender: false,
        },
      });
    });
  }, []);

  useFrame(({ mouse }) => {
    material.current.uMousePosition = [
      MathUtils.lerp(
        material.current.uMousePosition[0],
        -1.0 * material.current.uProgression,
        0.05
      ),
      MathUtils.lerp(
        material.current.uMousePosition[1],
        -1.0 * material.current.uProgression,
        0.05
      ),
    ];

    material.current.uProgression = progression.get();

    material.current.uPushForce = MathUtils.lerp(
      material.current.uPushForce,
      -PUSH_FORCE * 3 * Math.sin(material.current.uProgression * 3.14),
      0.025
    );
  });

  return (
    <mesh
      scale={[1, 1, 1]}
      ref={imageMesh}
    >
      <planeGeometry args={[1.75, 1.25, 32, 32]} />
      <imageSliderMaterial
        ref={material}
        uTexture={texture}
        uDispTexture={dispTexture}
        uDirection={1}
        transparent
      />
    </mesh>
  );
};

useTexture.preload("dwbusiness.png");
useTexture.preload("displacement/TCom_Ice_Cracked_header.jpg");



