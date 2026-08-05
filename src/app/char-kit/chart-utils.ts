import { hidden } from "@angular/forms/signals";
import { ChartPoint, SvgPoint } from "./chart-point";

export function minValue(points: ChartPoint[]): number {
    return Math.min(...points.map(p => p.value));
}

export function maxValue(points: ChartPoint[]): number {
    return Math.max(...points.map(p => p.value));
}

export function normalizeValues(points: ChartPoint[]): number[] {
    if (!points.length) return [];

    const min = minValue(points);
    const max = maxValue(points);

    if (min === max) return points.map(() => 0.5);

    return points.map(point => (point.value - min) / (max - min));
}

export function buildPolyline(
    points: ChartPoint[],
    width: number,
    height: number,
    padding = 8
): string {
    return buildPoints(points, width, height, padding)
        .map(p => `${p.x},${p.y}`).join(' ');
}

export function normalizeToPercent(points: ChartPoint[]): number[] {
    if (!points.length) return [];

    const max = maxValue(points);

    if (max === 0) return points.map(() => 0);

    return points.map(point => point.value / max * 100);
}

export function buildPoints(
    points: ChartPoint[],
    width: number,
    height: number,
    padding = 8
): SvgPoint[] {
    if (!points.length) return [];

    const normalized = normalizeValues(points);
    const step = points.length === 1 ? 0 : (width - padding * 2) / (points.length - 1);
    return normalized.map((value, index) => ({
        x: padding + index * step,
        y: height - padding - value * (height - padding * 2),
        label: points[index].label,
        value: points[index].value
    }))
}

export function buildArea(
    points: ChartPoint[],
    width: number,
    height: number,
    padding = 8
): string {
    const svgPoints = buildPoints(points, width, height, padding);

    if (!svgPoints.length) return '';

    const start = `${padding},${height - padding}`;
    const end = `${width - padding},${height - padding}`;

    return [
        start,
        ...svgPoints.map(p => `${p.x},${p.y}`),
        end
    ].join(' ');
}