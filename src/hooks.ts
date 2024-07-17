import React, { useEffect, useMemo, useState } from "react";

// Custom hook for getting zoomed image and rendering it in canvas
export const useMouseOverZoom = (source: React.RefObject<HTMLCanvasElement>,
    target: React.RefObject<HTMLCanvasElement>, cursor: React.RefObject<HTMLElement>, radius: number) => {

        const { x, y } = useMouse(source);
        
        const zoomBounds = useMemo(() => {
            return {
              left: x - radius,
              top: y - radius,
              width: radius * 2,
              height: radius * 2,
            }
        }, [x, y,radius]);

        // Get the zoom image and draw it on canvas
        useEffect(() => {
            if (source.current && target.current) {
              const { left, top, width, height } = zoomBounds;
              const ctx = target.current.getContext("2d");
              const imageRatio = 1;
              if (ctx) {
                ctx.drawImage(
                  source.current,
                  left * imageRatio,
                  top * imageRatio,
                  width * imageRatio,
                  height * imageRatio,
                  0,
                  0,
                  target.current.width,
                  target.current.height
                );
              }
            }
        }, [zoomBounds, source, target])
}

// Returns currrent mouse position
export const useMouse = (ref: React.RefObject<HTMLElement>) => {
    const [mouse, setMouse] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    useEffect(() => {
      if (ref.current) {
        const handleMouseMove = (e: MouseEvent) => {
          // get mouse position relative to ref
          const rect = ref.current?.getBoundingClientRect();
          if (rect) {
            setMouse({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });
          }
        };
        ref.current.addEventListener("mousemove", handleMouseMove);
        return () => {
          ref.current!.removeEventListener("mousemove", handleMouseMove)
        };
      }
    });
    
    return mouse;
}
