import VanillaTilt, { TiltOptions } from "vanilla-tilt";

interface BackgroundStyle {
  backgroundColor: string;
  backgroundImage: string;
  clipPath: string;
}

const backgroundStyle = (style: {
  backgroundColor: string;
  backgroundImage: string;
}) => {
  return {
    backgroundColor: style.backgroundColor,
    backgroundImage: style.backgroundImage,
    clipPath: "none",
  } as BackgroundStyle;
};

const tiltOptions: TiltOptions = {};

function useLanternVFX(
  ref: React.RefObject<HTMLDivElement>,
  setBackgroundStyle: React.Dispatch<React.SetStateAction<BackgroundStyle>>,
  circleSize: number,
  setCircleSize: React.Dispatch<React.SetStateAction<number>>,
  style: { backgroundColor: string; backgroundImage: string }
) {
  ref.current?.addEventListener("mousemove", (e: any) => {
    setBackgroundStyle({
      backgroundColor: style.backgroundColor,
      backgroundImage: style.backgroundImage,
      clipPath: `circle(${circleSize}px at ${e.clientX}px ${e.clientY}px)`,
    });
  });

  ref.current?.addEventListener("wheel", (e) => {
    if (e.deltaY > 0 && circleSize < 360) {
      setCircleSize(circleSize + 8);
      setBackgroundStyle((prevState) => ({
        ...prevState,
        clipPath: `circle(${circleSize}px at ${e.clientX}px ${e.clientY}px)`,
      }));
    }
    if (e.deltaY < 0 && circleSize > 32) {
      setCircleSize(circleSize - 8);
      setBackgroundStyle((prevState) => ({
        ...prevState,
        clipPath: `circle(${circleSize}px at ${e.clientX}px ${e.clientY}px)`,
      }));
    }
  });
}

function useTiltVFX(ref: React.RefObject<HTMLDivElement>) {
  VanillaTilt.init(ref.current!);
}
export default { useLanternVFX, useTiltVFX, backgroundStyle, tiltOptions };
