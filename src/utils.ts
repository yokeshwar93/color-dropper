export const convertRgbToHex = (red: number, green: number,blue: number) => {
    return "#" + componentToHex(red) + componentToHex(green) + componentToHex(blue);
}
const componentToHex = (component: number): string => {
    const hex = component.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}