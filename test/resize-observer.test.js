// tslint:disable:no-unused-expression
const { expect } = require('chai');
const { JSDOM } = require('jsdom');
const MockRaf = require('mock-raf');
const sinon = require('sinon');

describe('ResizeObserver', () => {
    let mockRaf;

    beforeEach(() => {
        global.window = (new JSDOM(`<!DOCTYPE html/><html><body></body></html>`)).window;
        global.document = window.document;

        mockRaf = MockRaf();
        window.requestAnimationFrame = mockRaf.raf;
        window.cancelAnimationFrame = mockRaf.cancel;
        sinon.stub(window, 'requestAnimationFrame', mockRaf.raf);
        cancelAnimationFrameSpy = sinon.stub(window, 'cancelAnimationFrame', mockRaf.cancel);

        if (window.ResizeObserver) {
            throw new Error('ResizeObserver should not exist on window inside beforeEach');
        }
        require('../dist/resize-observer.min');
    });

    afterEach(() => {
        delete require.cache[require.resolve('../dist/resize-observer.min')];
        delete window.ResizeObserver;
    });

    it('is attached to window', () => {
        expect(window.ResizeObserver).not.to.be.undefined;
    });

    describe('constructor', () => {
        it('throws a TypeError if constructed with `undefined`', () => {
            expect(() => {
                new window.ResizeObserver();
            }).to.throw(TypeError, 'Failed to construct \'ResizeObserver\': 1 argument required, but only 0 present.');
        });

        it('throws a TypeError if constructed with a non-function', () => {
            expect(() => {
                new window.ResizeObserver('blah');
            }).to.throw(
                TypeError,
                'Failed to construct \'ResizeObserver\': The callback provided as parameter 1 is not a function.'
            );
        });

        it('creates a new ResizeObserver', () => {
            const ro = new window.ResizeObserver(() => undefined);
            expect(ro).to.be.an.instanceof(window.ResizeObserver);
        });
    });

    describe('observe', () => {
        let resizeObserver;

        beforeEach(() => {
            resizeObserver = new window.ResizeObserver(() => undefined);
        });

        it('throws a TypeError if called with a `undefined`', () => {
            expect(() => {
                resizeObserver.observe();
            }).to.throw(
                TypeError,
                'Failed to execute \'observe\' on \'ResizeObserver\': 1 argument required, but only 0 present.'
            );
        });

        it('throws a TypeError if called with a non-function', () => {
            expect(() => {
                resizeObserver.observe('test');
            }).to.throw(
                TypeError,
                'Failed to execute \'observe\' on \'ResizeObserver\': parameter 1 is not of type \'Element\'.'
            );
        });
    });

    describe('unobserve', () => {
        let resizeObserver;

        beforeEach(() => {
            resizeObserver = new window.ResizeObserver(() => undefined);
        });

        it('throws a TypeError if called with a `undefined`', () => {
            expect(() => {
                resizeObserver.unobserve();
            }).to.throw(
                TypeError,
                'Failed to execute \'unobserve\' on \'ResizeObserver\': 1 argument required, but only 0 present.'
            );
        });

        it('throws a TypeError if called with a non-function', () => {
            expect(() => {
                resizeObserver.unobserve('test');
            }).to.throw(
                TypeError,
                'Failed to execute \'unobserve\' on \'ResizeObserver\': parameter 1 is not of type \'Element\'.'
            );
        });
    });

    describe('when observing one element', () => {
        let element;
        let callback;
        let elementWidth;
        let elementHeight;
        let resizeObserver;
        let mockGcs;

        beforeEach(() => {
            element = document.createElement('div');
            elementWidth = '0';
            elementHeight = '0';
            mockGcs = sinon.stub(window, 'getComputedStyle', () => {
                return {
                    height: elementHeight,
                    width: elementWidth,
                };
            });
            document.body.appendChild(element);
            callback = sinon.spy();

            resizeObserver = new window.ResizeObserver(callback);

            resizeObserver.observe(element);
        });

        it('begins waiting', () => {
            expect(window.requestAnimationFrame.callCount).to.equal(1);
        });

        it('watches the element for height changes', () => {
            expect(callback.callCount).to.equal(0);

            elementHeight = '10px';
            mockRaf.step();

            expect(callback.callCount).to.equal(1);
        });

        it('watches the element for width changes', () => {
            expect(callback.callCount).to.equal(0);

            elementWidth = '10px';
            mockRaf.step();

            expect(callback.callCount).to.equal(1);
        });

        it('does not dispatch when width and height do not change', () => {
            expect(callback.callCount).to.equal(0);

            elementWidth = '10px';

            mockRaf.step();

            expect(callback.callCount).to.equal(1);

            mockRaf.step();

            expect(callback.callCount).to.equal(1);

            mockRaf.step();

            expect(callback.callCount).to.equal(1);
        });

        it('dispatches the callback once per requestAnimationFrame', () => {
            expect(callback.callCount).to.equal(0);

            elementWidth = '10px';

            mockRaf.step();

            expect(callback.callCount).to.equal(1);

            elementWidth = '20px';

            mockRaf.step();

            expect(callback.callCount).to.equal(2);
        });

        describe('attempting to observe the same element twice', () => {
            beforeEach(() => {
                resizeObserver.observe(element);
            });

            it('does not observe the element a second time', () => {
                expect(resizeObserver.$$observationTargets.length).to.equal(1);
            });

            it('only dispatches callback once', () => {
                expect(callback.callCount).to.equal(0);

                elementWidth = '10px';

                mockRaf.step();

                expect(callback.callCount).to.equal(1);
                expect(callback.getCall(0).args[0].length).to.equal(1,
                    'expect the callback to be passed one entry');
            });
        });

        describe('after unobserve', () => {
            beforeEach(() => {
                resizeObserver.unobserve(element);
            });

            it('no longer dispatches when the element resizes', () => {
                elementWidth = '10px';
                elementHeight = '10px';

                mockGcs.reset();
                mockRaf.step();

                expect(callback.callCount).to.equal(0);
                expect(mockGcs.callCount).to.equal(0);
            });
        });

        describe('after last element unobserved', () => {
            beforeEach(() => {
                resizeObserver.unobserve(element);
            });

            it('calls cancelAnimationFrame once', () => {
                expect(cancelAnimationFrameSpy.callCount).to.equal(1);
            });

            it('no longer dispatches when the element resizes', () => {
                elementWidth = '10px';
                elementHeight = '10px';

                mockGcs.reset();
                mockRaf.step();

                expect(callback.callCount).to.equal(0);
                expect(mockGcs.callCount).to.equal(0);
            });

            it('allows further elements to be observed', () => {
                resizeObserver.observe(element);

                elementWidth = '10px';
                elementHeight = '10px';

                mockGcs.reset();
                mockRaf.step();

                expect(callback.callCount).to.equal(1);
                expect(mockGcs.callCount).to.equal(3,
                    'expect getComputedStyle call count to be 3 (1x ResizeObserverEntry, 2x gather active obs.)');
            });
        });

        describe('after disconnect', () => {
            beforeEach(() => {
                resizeObserver.disconnect();
            });

            it('calls cancelAnimationFrame once', () => {
                expect(cancelAnimationFrameSpy.callCount).to.equal(1);
            });

            it('no longer dispatches when the element resizes', () => {
                elementWidth = '10px';
                elementHeight = '10px';

                mockGcs.reset();
                mockRaf.step();

                expect(callback.callCount).to.equal(0);
                expect(mockGcs.callCount).to.equal(0);
            });

            it('allows further elements to be observed', () => {
                resizeObserver.observe(element);

                elementWidth = '10px';
                elementHeight = '10px';

                mockGcs.reset();
                mockRaf.step();

                expect(callback.callCount).to.equal(1);
                expect(mockGcs.callCount).to.equal(3,
                    'expect getComputedStyle call count to be 3 (1x ResizeObserverEntry, 2x gather active obs.)');
            });
        });
    });

    describe('when observing two elements', () => {
        let callback;
        let elements;
        let elementWidths;
        let elementHeights;
        let mockGcs;
        let resizeObserver;

        beforeEach(() => {
            elements = [];
            elementWidths = [];
            elementHeights = [];
            elements[0] = document.createElement('div');
            elements[0].innerText = 'Element 1';
            elements[1] = document.createElement('div');
            elements[1].innerText = 'Element 2';
            elementWidths[0] = elementWidths[1] = '0';
            elementHeights[0] = elementHeights[1] = '0';

            callback = sinon.spy();
            resizeObserver = new window.ResizeObserver(callback);

            mockGcs = sinon.stub(window, 'getComputedStyle', el => {
                const index = elements.indexOf(el);
                return {
                    height: elementHeights[index],
                    width: elementWidths[index],
                };
            });
            elements.forEach(el => {
                document.body.appendChild(el);
                resizeObserver.observe(el);
            });

        });

        it('calls the callback when either element\'s size has changed', () => {
            expect(callback.callCount).to.equal(0);

            elementWidths[0] = '10px';
            mockRaf.step();

            expect(callback.callCount).to.equal(1);

            elementWidths[1] = '10px';
            mockRaf.step();

            expect(callback.callCount).to.equal(2);
        });

        it('calls the callback once when both elements\' sizes have changed', () => {
            expect(callback.callCount).to.equal(0);

            elementWidths[0] = '10px';
            elementWidths[1] = '10px';

            mockRaf.step();

            expect(callback.callCount).to.equal(1);

            mockRaf.step();

            expect(callback.callCount).to.equal(1);
        });

        describe('attempting to observe the both elements twice', () => {
            beforeEach(() => {
                resizeObserver.observe(elements[0]);
                resizeObserver.observe(elements[1]);
            });

            it('does not observe either element a second time', () => {
                expect(resizeObserver.$$observationTargets.length).to.equal(2);
            });

            it('calls the callback once when the first element\'s size changed', () => {
                expect(callback.callCount).to.equal(0);

                elementWidths[0] = '10px';

                mockRaf.step();

                expect(callback.callCount).to.equal(1);
                expect(callback.getCall(0).args[0].length).to.equal(1,
                    'expect the callback to be passed one entry');
            });

            it('calls the callback once when the second element\'s size changed', () => {
                expect(callback.callCount).to.equal(0);

                elementWidths[1] = '10px';

                mockRaf.step();

                expect(callback.callCount).to.equal(1);
                expect(callback.getCall(0).args[0].length).to.equal(1,
                    'expect the callback to be passed one entry');
            });

            it('calls the callback once when both elements\' sizes have changed', () => {
                expect(callback.callCount).to.equal(0);

                elementWidths[0] = '10px';
                elementWidths[1] = '10px';

                mockRaf.step();

                expect(callback.callCount).to.equal(1);
                expect(callback.getCall(0).args[0].length).to.equal(2,
                    'expect the callback to be passed two entries');
            });
        });

        describe('after unobserving the first element', () => {
            beforeEach(() => {
                resizeObserver.unobserve(elements[0]);
            });

            it('stops observing that element', () => {
                elementWidths[0] = '10px';
                elementHeights[0] = '10px';

                callback.reset();
                mockGcs.reset();
                mockRaf.step();

                expect(callback.callCount).to.equal(0,
                    'expect callback call count to be 0');
                expect(mockGcs.callCount).to.equal(1,
                    'expect getComputedStyle call count to be 1');
            });

            it('still observes the second element', () => {
                elementWidths[1] = '10px';
                elementHeights[1] = '10px';

                callback.reset();
                mockGcs.reset();
                mockRaf.step();

                expect(callback.callCount).to.equal(1,
                    'expect callback call count to be 1');
                expect(mockGcs.callCount).to.equal(3,
                    'expect getComputedStyle call count to be 3 (1x ResizeObserverEntry, 2x gather active obs.)');
                expect(mockGcs.getCall(0).args[0]).to.equal(elements[1],
                    'expect getComputedStyle to be passed the second element');
            });
        });

        describe('after unobserving the second element', () => {
            beforeEach(() => {
                resizeObserver.unobserve(elements[1]);
            });

            it('stops observing that element', () => {
                elementWidths[1] = '10px';
                elementHeights[1] = '10px';

                callback.reset();
                mockGcs.reset();
                mockRaf.step();

                expect(callback.callCount).to.equal(0,
                    'expect callback call count to be 0');
                expect(mockGcs.callCount).to.equal(1,
                    'expect getComputedStyle call count to be 1');
            });

            it('still observes the first element', () => {
                elementWidths[0] = '10px';
                elementHeights[0] = '10px';

                callback.reset();
                mockGcs.reset();
                mockRaf.step();

                expect(callback.callCount).to.equal(1,
                    'expect callback call count to be 1');
                expect(mockGcs.callCount).to.equal(3,
                    'expect getComputedStyle call count to be 3 (1x ResizeObserverEntry, 2x gather active obs.)');
                expect(mockGcs.getCall(0).args[0]).to.equal(elements[0],
                    'expect getComputedStyle to be passed the first element');
            });
        });

        describe('after unobserving both elements', () => {
            beforeEach(() => {
                resizeObserver.unobserve(elements[0]);
                resizeObserver.unobserve(elements[1]);
            });

            it('stops the requestAnimationFrame loop', () => {
                mockGcs.reset();
                window.requestAnimationFrame.reset();
                mockRaf.step();

                expect(callback.callCount).to.equal(0,
                    'expect callback call count to be 0');
                expect(mockGcs.callCount).to.equal(0,
                    'expect getComputedStyle call count to be 0');
                expect(window.requestAnimationFrame.callCount).to.equal(0,
                    'expect requestAnimationFrame call count to be 0');
            });
        });
    });
});
