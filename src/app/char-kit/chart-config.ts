export type ChartEasing = 'linear' | 'ease' | 'easeInOut' | 'bounce';

export interface ChartOptions {
    animate: boolean;
    duration: number;
    easing: ChartEasing;
    colors: string[];
    showLegend: boolean;
    showTooltip: boolean;
    showGrid: boolean;
    showLabels: boolean;
    strokeWidth: number;
    padding: number;
    animationDelay: number;
}

export const DEFAULT_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#14b8a6', '#ec4899'];

export const DEFAULT_CHART_OPTIONS: ChartOptions = {
    animate: true,
    duration: 600,
    easing: 'ease',
    colors: DEFAULT_COLORS,
    showLegend: true,
    showTooltip: true,
    showGrid: true,
    showLabels: true,
    strokeWidth: 4,
    padding: 8,
    animationDelay: 0
}