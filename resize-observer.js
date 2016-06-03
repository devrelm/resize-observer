if (!document.resizeObservers) {
    document.resizeObservers = [];
}

export class ResizeObserver {
    constructor(callback) {
        document.resizeObservers.push(this);
        this._callback = callback;
        this._observationTargets = [];
        this._activeTargets = [];
    }

    observe(target) {
        let resizeObservationIndex = this._observationTargets.findIndex(ro => ro.target === target);
        if (typeof resizeObservation >= 0) {
            return;
        }

        resizeObservation = new ResizeObservation(target);
        this._observationTargets.push(resizeObservation);
    }

    unobserve(target) {
        let resizeObservationIndex = this._observationTargets.findIndex(ro => ro.target === target);
        if (resizeObservationIndex === -1) {
            return;
        }

        this._observationTargets.splice(resizeObservationIndex, 1);
    }

    disconnect() {
        this._observationTargets = [];
        this._activeTargets = [];
    }

    _populateActiveTargets() {
        this._activeTargets = [];
        for (let resizeObservation of this._observationTargets) {
            if (resizeObservation.isActive()) {
                this._activeTargets.push(resizeObservation);
            }
        }
    }
}

export class ResizeObserverEntry {
    constructor(target) {
        this._target = target;
        this._clientWidth = target.getBoundingClientRect().width;
        this._clientHeight = target.getBoundingClientRect().height;
    }

    get target() {
        return this._target;
    }

    get clientWidth() {
        return this._clientWidth();
    }

    get clientHeight() {
        return this._clientHeight();
    }
}

class ResizeObservation {
    constructor(target) {
        this._target = target;
        this._lastBroadcastWidth = target.getBoundingClientRect().width;
        this._lastBroadcastHeight = target.getBoundingClientRect().height;
    }

    get target() {
        return this._target;
    }

    get lastBroadcastWidth() {
        return this._lastBroadcastWidth;
    }

    get lastBroadcastHeight() {
        return this._lastBroadcastHeight;
    }

    isActive() {
        if (this.target.getBoundingClientRect().width !== this.lastBroadcastWidth ||
            this.target.getBoundingClientRect().height !== this.lastBroadcastHeight) {
            return true;
        }
        return false;
    }
}


function gatherActiveObservers() {
    for (let resizeObserver of document.resizeObservers) {
        resizeObserver._populateActiveTargets();
    }
}

function hasActiveObservations() {
    for (let resizeObserver of document.resizeObservers) {
        if (resizeObserver._activeTargets.length > 0) {
            return true;
        }
    }
    return false;
}

function broadcastActiveObservations() {
    for (let resizeObserver of document.resizeObservers) {
        const entries = [];

        for (let resizeObservation of resizeObserver._activeTargets) {
            const entry = new ResizeObserverEntry(resizeObservation.target);
            entries.push(entry);
            resizeObservation._lastBroadcastWidth =
                resizeObservation.target.getBoundingClientRect().width;
            resizeObservation._lastBroadcastHeight =
                resizeObservation.target.getBoundingClientRect().height;
        }

        resizeObserver._callback(entries);
        resizeObserver._activeTargets = [];
    }
}

function deliverResizeLimitErrorNotification() {
    const errorEvent = new ErrorEvent('ResizeObserver loop limit exceeded.');
    window.dispatch(errorEvent);
}

function frameHandler() {
    gatherActiveObservers();
    broadcastActiveObservations();
}
