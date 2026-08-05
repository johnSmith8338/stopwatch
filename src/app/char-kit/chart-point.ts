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
