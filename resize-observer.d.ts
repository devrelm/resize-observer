export interface ResizeObserver {
    constructor(callback: ResizeObserverCallback);
    observationTargets: ResizeObservation[];
    activeTargets: ResizeObservation[];
    observe(target: Element): void;
    unobserve(target: Element): void;
    disconnect(): void;
}

export interface ResizeObserverCallback {
    (entries: ResizeObserverEntry[], observer: ResizeObserver): void;
}

export interface ResizeObserverEntry {
    constructor(target: Element)
    target: Element;
    clientWidth: number;
    clientHeight: number;
}

export interface ResizeObservation {
    constructor(target: Element)
    target: Element;
    lastBroadcastWidth: number;
    lastBroadcastHeight: number;
    isActive(): boolean;
}
