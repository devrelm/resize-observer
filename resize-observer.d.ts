declare module 'resize-observer' {

}

declare class ResizeObserver {
    constructor(callback: ResizeObserverCallback);
    observe(target: Element): void;
    unobserve(target: Element): void;
    disconnect(): void;
}

declare interface ResizeObserverCallback {
    (entries: ResizeObserverEntry[], observer: ResizeObserver): void;
}

declare class ResizeObserverEntry {
    constructor(target: Element);
    target: Element;
    clientWidth: number;
    clientHeight: number;
}
