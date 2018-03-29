import { ResizeObserver } from './ResizeObserver';
import { ResizeObserverEntry } from './ResizeObserverEntry';

export type ResizeObserverCallback =
    (entries: ResizeObserverEntry[], observer: ResizeObserver) => void;
