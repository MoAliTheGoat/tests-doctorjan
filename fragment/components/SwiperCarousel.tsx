import { NavBtnL, NavBtnR } from "@/src/components/elements/SliderNavBtn";
import { CodeComponentMeta } from "@plasmicapp/host";
import { CSSProperties, useRef, useState } from "react";
import { Mousewheel, Navigation } from "swiper/modules";
import { Swiper } from "swiper/react";

type Props = {
  slides: React.ReactNode;
  spaceBetween?: number;
  slidesPerView?: number;
  autoSlidesPerView: boolean;
  loop?: boolean;
  className?: string;
  parentStyle?: CSSProperties;
  enableMousewheel?: boolean;
  enableFreeMode?: boolean;
  showNavButtons?: boolean;
};

export const SwiperCarousel = ({
  slides,
  spaceBetween = 10,
  slidesPerView = 1,
  loop = true,
  autoSlidesPerView = false,
  className,
  parentStyle,
  enableMousewheel = false,
  enableFreeMode = false,
  showNavButtons = true,
}: Props) => {
  const [_, setInit] = useState();

  const PrevRef = useRef<HTMLButtonElement | null>(null);
  const NextRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className="relative" style={parentStyle}>
      {showNavButtons && ( // Conditionally render navigation buttons
        <>
          <NavBtnR prevRef={PrevRef} />
          <NavBtnL nextRef={NextRef} />
        </>
      )}
      <Swiper
        className={className + `${autoSlidesPerView ? " auto-width" : ""}`}
        spaceBetween={spaceBetween}
        slidesPerView={autoSlidesPerView ? "auto" : slidesPerView}
        loop={loop}
        pagination={{ clickable: true }}
        navigation={{
          prevEl: PrevRef.current,
          nextEl: NextRef.current,
        }}
        mousewheel={
          enableMousewheel
            ? {
                forceToAxis: true, // Ensures gestures are interpreted along one axis only
              }
            : undefined
        }
        freeMode={
          enableFreeMode ? { enabled: true, momentumBounce: false } : undefined
        }
        scrollbar={{ enabled: true }}
        onInit={() => {
          // @ts-ignore
          setInit(true);
        }}
        modules={[Navigation, Mousewheel]}
      >
        {slides}
      </Swiper>
    </div>
  );
};

export const SwiperCarouselMeta: CodeComponentMeta<Props> = {
  name: "SwiperCarousel",
  displayName: "Fragment/SwiperCarousel",
  importPath: "./../../../src/fragment/components/SwiperCarousel",
  props: {
    slides: {
      displayName: "Slides",
      type: "slot",
    },
    className: {
      displayName: "Class name",
      type: "string",
    },
    parentStyle: {
      displayName: "Container style",
      type: "object",
    },
    autoSlidesPerView: {
      displayName: "Auto slides per view",
      type: "boolean",
      description: "Show as many slides as possible per view.",
      defaultValue: false,
    },
    slidesPerView: {
      displayName: "Slides per view",
      type: "number",
      description: "Number of slides to show per view.",
      hidden: (props) => props.autoSlidesPerView,
      defaultValue: 1,
    },
    spaceBetween: {
      displayName: "Space Between",
      type: "number",
      defaultValue: 10,
    },
    loop: {
      displayName: "Loop",
      type: "boolean",
      defaultValue: true,
    },
    enableMousewheel: {
      displayName: "mousewheel",
      type: "boolean",
      defaultValue: false,
    },
    enableFreeMode: {
      displayName: "freeMode",
      type: "boolean",
      defaultValue: false,
    },
    showNavButtons: {
      displayName: "NavigationButtons",
      type: "boolean",
      defaultValue: true,
    },
  },
};
