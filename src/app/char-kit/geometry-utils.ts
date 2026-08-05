export function polarToCartession(
    cx: number,
    cy: number,
    radius: number,
    angle: number
) {
    return {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle)
    }
}