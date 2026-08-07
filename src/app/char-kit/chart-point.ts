export interface ChartPoint {
    label: string;
    value: number;
}

export interface SvgPoint {
    x: number;
    y: number;
    label: string;
    value: number;
    length: number;
}

export interface DonutArc {
    label: string;
    value: number;
    startAngle: number;
    endAngle: number;
    percent: number;
}

export interface DonutRenderArc extends DonutArc {
    currentStart: number;
    currentEnd: number;
}

export interface AnimatedPoint extends SvgPoint {
    currentX: number;
    currentY: number;
}