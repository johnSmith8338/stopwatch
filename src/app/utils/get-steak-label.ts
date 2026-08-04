export function getStreakLabel(streak: number): string {
    switch (true) {
        case streak === 0:
            return 'start today';

        case streak === 1:
            return 'nice start';

        case streak < 7:
            return 'keep going';

        case streak < 30:
            return 'one week+';

        case streak < 100:
            return 'amazing';

        case streak < 365:
            return 'legend';

        default:
            return 'unstoppable';
    }
}