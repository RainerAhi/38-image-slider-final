import { Canvas, useFrame } from "@react-three/fiber";
import { motion, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { ImageSlider } from "./ImageSlider";
import { Slider } from "./Slider";
import { useSlider } from "./hooks/useSlider";

function App() {
  return (
    <>
      <main className="bg-black">
      <section className="h-screen grid place-content-center one">
          <p className="text-white">section 1</p>
        </section>
        <section className="w-full h-screen relative two">
          {/* <Slider /> */}
          <Canvas
            camera={{ position: [0, 0, 5], fov: 30 }}
            className="top-0 left-0"
            style={{
              // Overriding the default style applied by R3F
              width: "100%",
              height: "100%",
              position: "absolute",
            }}
          >
            <ImageSlider />
          </Canvas>
        </section>
        <section className="h-screen grid place-content-center three">
          <p className="text-white">section 3</p>
        </section>
      </main>
    </>
  );
}

const AnimatedBackground = () => {
  const bgColor = useRef();
  const { curSlide, items } = useSlider();
  const animatedColor = useSpring(items[curSlide].color);
  useEffect(() => {
    if (bgColor.current) {
      animatedColor.set(items[curSlide].color);
    }
  }, [curSlide]);
  useFrame(() => {
    if (bgColor.current) {
      bgColor.current.set(animatedColor.get());
    }
  });
  return <color attach="background" args={[items[0].color]} ref={bgColor} />;
};

export default App;
