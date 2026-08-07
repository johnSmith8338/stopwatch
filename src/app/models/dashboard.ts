export type DashboardActivityType = 'alarm' | 'timer' | 'stopwatch';

export interface DashboardLastActivity {
    type: DashboardActivityType;
    timestamp: number;
    title: string;
    subtitle: string;
}

export interface ActivityDay {
    day: number;
    date: number;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
}

export interface ActivityWeek {
    label: string;
    days: ActivityDay[];
}

export interface DashboardStatCard {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: string;
    color?: 'green' | 'blue' | 'orange' | 'red' | 'purple';
    trend?: {
        value: number;
        direction: 'up' | 'down' | 'flat';
    };
}