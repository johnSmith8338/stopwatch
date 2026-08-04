export type DashboardActivityType = 'alarm' | 'timer' | 'stopwatch';

export interface DashboardLastActivity {
    type: DashboardActivityType;
    timestamp: number;
    title: string;
    subtitle: string;
}