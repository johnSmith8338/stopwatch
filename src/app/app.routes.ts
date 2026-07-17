import { Routes } from '@angular/router';
import { Stopwatch } from './pages/stopwatch/stopwatch';
import { Timer } from './pages/timer/timer';
import { Home } from './pages/home/home';
import { NotFound } from './pages/not-found/not-found';
import { Settings } from './pages/settings/settings';

export const routes: Routes = [
    {
        path: '',
        component: Home,
        data: {
            title: 'home-page',
            showInMenu: false,
        }
    },
    {
        path: 'stopwatch',
        component: Stopwatch,
        data: {
            title: 'stopwatch',
            showInMenu: true,
            icon: '',
            order: 1
        }
    },
    {
        path: 'timer',
        component: Timer,
        data: {
            title: 'timer',
            showInMenu: true,
            icon: '',
            order: 2
        }
    },
    {
        path: 'settings',
        component: Settings,
        data: {
            title: 'settings',
            showInMenu: true,
            icon: '',
            order: 3
        }
    },
    {
        path: '404',
        component: NotFound,
        data: {
            title: '404',
            showInMenu: false,
        }
    },
];
