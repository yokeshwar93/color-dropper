import { useCallback, useEffect, useRef, useState } from "react";
import { useMouse, useMouseOverZoom } from "./hooks";
import { convertRgbToHex } from "./utils";
import './Canvas.css';

type Props = {
    image: string;
    setSelectedColor: (color: string) => void;
    setIsDropperSelected: (value: boolean) => void;
    isDropperSelected: boolean
}
const Canvas = ({image, setSelectedColor, isDropperSelected, setIsDropperSelected} : Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const target = useRef<HTMLCanvasElement>(null);
    const cursor = useRef<HTMLDivElement>(null);

    const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
    const [circleColor, setCircleColor] = useState<string>('');
    const [isMouseOnCanvas, setIsMouseOnCanvas] = useState<boolean>(false);

    // Custom hook for getting current mouse poistion
    const { x, y } = useMouse(canvasRef);

    
    // Custom hook for zoom image on mouse hover
    useMouseOverZoom(canvasRef, target, cursor, 25);

    // Save canvas context and add event listeners
    useEffect(() => {
        const currentRef = canvasRef.current
        if(currentRef) {
            const context = canvasRef.current.getContext('2d', { willReadFrequently: true });
            setCanvasContext(context);
            currentRef.addEventListener('mousemove', canvasOnMouseHandler);
            currentRef.addEventListener('mouseenter', canvasMouseEnterHandler);
            currentRef.addEventListener('mouseleave', canvasMouseLeaveHandler);
            currentRef.addEventListener('click', dropperClick);
        }
        return () => {
            currentRef?.removeEventListener('mousemove', canvasOnMouseHandler);
            currentRef?.removeEventListener('mouseenter', canvasMouseEnterHandler);
            currentRef?.removeEventListener('mouseleave', canvasMouseLeaveHandler);
            currentRef?.removeEventListener('click', dropperClick);
        }
    },[canvasRef.current, isDropperSelected, isMouseOnCanvas, circleColor])

    // Mouse enter handler for canvas
    const canvasMouseEnterHandler = useCallback(() => {
        setIsMouseOnCanvas(true);
    },[]);

    // Mouse leave handler for canvas
    const canvasMouseLeaveHandler = useCallback(() => {
        setIsMouseOnCanvas(false);
    },[]);

    // Get the current mouse position and get color from canvas
    const canvasOnMouseHandler = useCallback((event: MouseEvent) => {
        if(canvasRef.current && canvasContext) {
            const position = {
                x:canvasRef.current?.offsetLeft || 0,
                y:canvasRef.current?.offsetTop || 0
            }
            const x = event.pageX - position.x;
            const y = event.pageY - position.y;
            const imageData = canvasContext.getImageData(x,y, 20, 1).data;
            const red = imageData?.[0] || 0;
            const green = imageData?.[1] || 0;
            const blue = imageData?.[2] || 0;

            setCircleColor(convertRgbToHex(red, green, blue));
        }
    },[setCircleColor, canvasContext]);

    // Click handler for dropper
    const dropperClick = useCallback(() => {
        if(isDropperSelected) {
            setSelectedColor(circleColor);
            setIsDropperSelected(false);
        }
    },[circleColor, isDropperSelected, setSelectedColor, setIsDropperSelected]);

    // Draw the source image on canvas
    useEffect(() => {
        if(canvasRef.current && canvasContext) {
            const imageElement = new Image();
            imageElement.src = image
            imageElement.onload = () => {          
                canvasContext.drawImage(imageElement, 0, 0);        
            };
        }
    },[image, canvasContext])

    // Set the canvas which has the zoomed image to mouse position and update border color
    useEffect(() => {
        if (cursor.current) {
            cursor.current.style.left = `${x - 105}px`;
            cursor.current.style.top = `${y - 70}px`;
            cursor.current.style.borderColor = circleColor;
        }
      }, [x, y, circleColor]);
    

    return (
        <>
        { isDropperSelected && isMouseOnCanvas && 
        <div ref={cursor} className='cursor'>
            <canvas className='zoom-canvas' ref={target}  />
            <span className='color-cursor'>{circleColor}</span>
        </div> }
          
        <canvas ref={canvasRef} 
                width={window.innerWidth} 
                height={window.innerHeight}
                className={`${isDropperSelected ? 'crosshair' : ''}`}>
                
        </canvas>
        </> 
    )
}
export default Canvas;