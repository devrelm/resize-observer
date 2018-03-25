(function(window, undefined) {
    "use strict";

    if (typeof window.ResizeObserver !== 'undefined') {
        return;
    }

    document.resizeObservers = [];
    window.ResizeObserver = ResizeObserver;

    function ResizeObserver(callback) {
        if (typeof callback !== 'function') {
            throw new TypeError();
        }
        document.resizeObservers.push(this);
        this.__callback = callback;
        this.__observationTargets = [];
        this.__activeTargets = [];
    }

    ResizeObserver.prototype.observe = function(target) {
        if (!(target instanceof window.Element)) {
            throw new TypeError();
        }
        var resizeObservationIndex = findTargetIndex(this.__observationTargets, target);
        if (resizeObservationIndex >= 0) {
            return;
        }

        var resizeObservation = new ResizeObservation(target);
        this.__observationTargets.push(resizeObservation);
    };

    ResizeObserver.prototype.unobserve = function(target) {
        if (!(target instanceof window.Element)) {
            throw new TypeError();
        }
        var resizeObservationIndex = findTargetIndex(this.__observationTargets, target);
        if (resizeObservationIndex === -1) {
            return;
        }

        this.__observationTargets.splice(resizeObservationIndex, 1);
    };

    ResizeObserver.prototype.disconnect = function() {
        this.__observationTargets = [];
        this.__activeTargets = [];
    };

    ResizeObserver.prototype.__populateActiveTargets = function() {
        this.__activeTargets = [];
        for (var key in this.__observationTargets) {
            var resizeObservation = this.__observationTargets[key];
            if (resizeObservation.isActive()) {
                this.__activeTargets.push(resizeObservation);
            }
        }
    };

    function ResizeObserverEntry(target) {
        this.__target = target;
        this.__clientWidth = getWidth(target);
        this.__clientHeight = getHeight(target);
    }

    ResizeObserverEntry.target = function() {
        return this.__target;
    };

    ResizeObserverEntry.clientWidth = function() {
        return this.__clientWidth();
    };

    ResizeObserverEntry.clientHeight = function() {
        return this.__clientHeight();
    };

    function ResizeObservation(target) {
        this.__target = target;
        this.__lastBroadcastWidth = getWidth(target);
        this.__lastBroadcastHeight = getHeight(target);
    }

    ResizeObservation.prototype.target = function() {
        return this.__target;
    };

    ResizeObservation.prototype.lastBroadcastWidth = function() {
        return this.__lastBroadcastWidth;
    };

    ResizeObservation.prototype.lastBroadcastHeight = function() {
        return this.__lastBroadcastHeight;
    };

    ResizeObservation.prototype.isActive = function() {
        if (getWidth(this.__target) !== this.lastBroadcastWidth() ||
            getHeight(this.__target) !== this.lastBroadcastHeight()) {
            return true;
        }
        return false;
    };

    function findTargetIndex(collection, target) {
        for (var index = 0; index < collection.length; index += 1) {
            if (collection[index].target() === target) {
                return index;
            }
        }
    }

    function getWidth(target) {
        return target.getBoundingClientRect().width;
    }

    function getHeight(target) {
        return target.getBoundingClientRect().height;
    }

    function gatherActiveObservers() {
        for (var index = 0; index < document.resizeObservers.length; index += 1) {
            document.resizeObservers[index].__populateActiveTargets();
        }
    }

    function broadcastActiveObservations() {
        for (var roIndex = 0; roIndex < document.resizeObservers.length; roIndex++) {
            var resizeObserver = document.resizeObservers[roIndex];
            if (resizeObserver.__activeTargets.length === 0) {
                continue;
            }

            var entries = [];

            for (var atIndex = 0; atIndex < resizeObserver.__activeTargets.length; atIndex += 1) {
                var resizeObservation = resizeObserver.__activeTargets[atIndex];
                var entry = new ResizeObserverEntry(resizeObservation.target());
                entries.push(entry);
                resizeObservation.__lastBroadcastWidth = getWidth(resizeObservation.target());
                resizeObservation.__lastBroadcastHeight = getHeight(resizeObservation.target());
            }

            resizeObserver.__callback(entries);
            resizeObserver.__activeTargets = [];
        }
    }

    function frameHandler() {
        gatherActiveObservers();
        broadcastActiveObservations();

        setFrameWait(frameHandler);
    }

    function setFrameWait(callback) {
        if (typeof window.requestAnimationFrame === 'undefined') {
            window.setTimeout(callback, 1000 / 60);
        } else {
            window.requestAnimationFrame(callback);
        }
    }

    setFrameWait(frameHandler);
})(window, document);
