export interface ClockLabel {
    value: number;
    degrees: number;
}

export interface PositionedClockLabel {
    value: number;
    x: number;
    y: number;
}

export function buildTicks(count: number): number[] {
    return Array.from(
        { length: count },
        (_, i) => i
    )
}

export function buildLabels(
    centerX: number,
    centerY: number,
    radius: number,
    labels: ClockLabel[]
): PositionedClockLabel[] {
    return labels.map(label => {
        const radians = (label.degrees - 90) * Math.PI / 180;
        return {
            value: label.value,
            x: centerX + radius * Math.cos(radians),
            y: centerY + radius * Math.sin(radians),
        }
    })
}

export function buildFiveSecondLabels(
    firstValue: 0 | 60
): ClockLabel[] {
    return Array.from({ length: 12 }, (_, i) => ({
        value: i == 0 ? firstValue : i * 5,
        degrees: i * 30
    }))
}