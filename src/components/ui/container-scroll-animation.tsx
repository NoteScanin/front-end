"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

type ScreenSize = "mobile" | "tablet" | "desktop";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [screenSize, setScreenSize] = React.useState<ScreenSize>("desktop");

  React.useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize("mobile");
      } else if (width < 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const scaleDimensions = (): [number, number] => {
    switch (screenSize) {
      case "mobile":
        return [0.75, 0.95];
      case "tablet":
        return [0.85, 0.95];
      default:
        return [1.15, 1.1];
    }
  };

  const rotateValues = (): [number, number] => {
    switch (screenSize) {
      case "mobile":
        return [12, 0];
      case "tablet":
        return [16, 0];
      default:
        return [20, 0];
    }
  };

  const translateValues = (): [number, number] => {
    switch (screenSize) {
      case "mobile":
        return [0, -30];
      case "tablet":
        return [0, -60];
      default:
        return [0, -100];
    }
  };

  const rotate = useTransform(scrollYProgress, [0, 1], rotateValues());
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], translateValues());

  return (
    <div
      className="h-[32rem] sm:h-[40rem] md:h-[50rem] lg:h-[60rem] flex items-center justify-center relative px-3 py-2 sm:p-6 md:p-10 lg:p-16"
      ref={containerRef}
    >
      <div
        className="py-4 sm:py-8 md:py-12 lg:py-16 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div max-w-5xl mx-auto text-center px-2 sm:px-6"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="max-w-[1400px] w-[95%] -mt-4 sm:-mt-6 md:-mt-12 mx-auto h-auto border-2 sm:border-3 md:border-4 border-[#6C6C6C] p-1 sm:p-2 md:p-4 lg:p-6 bg-[#222222] rounded-2xl sm:rounded-[24px] md:rounded-[30px] shadow-2xl"
    >
      <div className="h-full w-full overflow-hidden rounded-xl sm:rounded-2xl bg-gray-100 dark:bg-zinc-900 p-0.5 sm:p-1 md:p-4">
        {children}
      </div>
    </motion.div>
  );
};
