import { motion } from "framer-motion";
import { useSlider } from "./hooks/useSlider";
const TEXT_TRANSITION_HEIGHT = 150;
export const Slider = () => {
  const { curSlide, items, nextSlide, prevSlide, direction } = useSlider();
  let prevIdx = direction === "next" ? curSlide - 1 : curSlide + 1;
  if (prevIdx === items.length) {
    prevIdx = 0;
  } else if (prevIdx === -1) {
    prevIdx = items.length - 1;
  }
  return (
    <div className="grid place-content-center h-full select-none overflow-hidden pointer-events-none relative z-10">
      {/* MIDDLE CONTAINER */}
      <div className="h-auto w-screen aspect-square max-h-[75vh] md:w-auto md:h-[75vh] md:aspect-[3/4] relative max-w-[100vw]">

        {/* MIDDLE ARROWS */}
        <button
          className="absolute left-4 md:-left-14 top-1/2 -translate-y-1/2 pointer-events-auto"
          onClick={prevSlide}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 stroke-white hover:opacity-50 transition-opacity duration-300 ease-in-out"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </button>
        <button
          className="absolute right-4 md:-right-14 top-1/2 -translate-y-1/2 pointer-events-auto"
          onClick={nextSlide}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 stroke-white hover:opacity-50 transition-opacity duration-300 ease-in-out"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </button>
      
      </div>
    </div>
  );
};
