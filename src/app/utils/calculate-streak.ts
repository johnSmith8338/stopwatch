export function calculateStreak(days: number[]): number {
    if (!days.length) return 0;

    const today = Math.floor(Date.now() / 86_400_000);
    const unique = [...new Set(days)].sort((a, b) => b - a);

    if (unique[0] !== today && unique[0] !== today - 1) return 0;

    let steak = 1;

    for (let i = 1; i < unique.length; i++) {
        if (unique[i - 1] - unique[i] === 1) {
            steak++;
        } else {
            break;
        }
    }

    return steak;
}