export const DATABASE_NAME = 'clock-db';

export const DATABASE_VERSION = 4;

export enum DbStore {
    Settings = 'settings',
    Sessions = 'sessions',
    Timers = 'timers',
    Alarms = 'alarms'
}