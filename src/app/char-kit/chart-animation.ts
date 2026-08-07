import { AnimatedPoint, DonutArc, SvgPoint } from "./chart-point";

export type AnimationCallback = (progress: number) => void;

export function animate(
    duration: number,
    callback: AnimationCallback,
    finished?: () => void
) {
    const start = performance.now();
    const frame = (time: number) => {
        const progress = Math.min((time - start) / duration, 1);
        callback(ease(progress));

        if (progress < 1) {
            requestAnimationFrame(frame);
        } else {
            finished?.();
        }
    }

    requestAnimationFrame(frame);
}

export function lerp(
    from: number,
    to: number,
    progress: number
): number {
    return from + (to - from) * progress;
}

export function lerpArray(
    from: number[],
    to: number[],
    progress: number
): number[] {
    return from.map((value, index) => lerp(value, to[index], progress));
}

function ease(t: number): number {
    return 1 - Math.pow(1 - t, 3);
}

export function interpolateDonut(
    previous: DonutArc[],
    next: DonutArc[],
    progress: number
): DonutArc[] {
    return next.map((target, index) => {
        const source = previous[index] ?? target;

        return {
            ...target,
            startAngle: lerp(
                source.startAngle,
                target.startAngle,
                progress
            ),
            endAngle: lerp(
                source.endAngle,
                target.endAngle,
                progress
            )
        };
    });
}

export function morphPoints(
    current: AnimatedPoint[],
    target: SvgPoint[],
    update: (points: AnimatedPoint[]) => void
) {
    if (!current.length) {
        update(target.map(p => ({
            ...p,
            currentX: p.x,
            currentY: p.y
        })))
        return;
    }

    const start = structuredClone(current);

    animate(800, progress => {
        update(target.map((point, i) => {
            const old = start[i] ?? {
                currentX: point.x,
                currentY: point.y
            }

            return {
                ...point,
                currentX: lerp(old.currentX, point.x, progress),
                currentY: lerp(old.currentY, point.y, progress),
            }
        }))
    })
}