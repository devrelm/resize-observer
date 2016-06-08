const {expect} = require('chai');
const MockBrowser = require('mock-browser').mocks.MockBrowser;
const mockRaf = require('mock-raf')();
const sinon = require('sinon');

describe('One ResizeObserver', () => {
    beforeEach(() => {
        global.window = MockBrowser.createWindow();
        global.document = MockBrowser.createDocument();

        window.requestAnimationFrame = mockRaf.raf;
        sinon.stub(window, 'requestAnimationFrame', mockRaf.raf);
        require('../resize-observer');
    });

    afterEach(() => {
        delete require.cache[require.resolve('../resize-observer')];
    });

    it('is attached to window', () => {
        expect(window.ResizeObserver).not.to.be.undefined;
    });

    it('begins waiting', () => {
        expect(window.requestAnimationFrame.calledOnce).to.equal(true);
    });

    describe('constructor', () => {
        it('creates a new ResizeObserver', () => {
            const ro = new window.ResizeObserver();
            expect(ro).to.be.an.instanceof(window.ResizeObserver);
        });

        it('adds the new ResizeObserver to document.resizeObservers', () => {
            const ro = new window.ResizeObserver();
            expect(document.resizeObservers.length).to.equal(1);
        });
    });

    describe('when observing one element', () => {
        let element;
        let callback;
        let elementWidth;
        let elementHeight;

        beforeEach(() => {
            element = document.createElement('div');
            elementWidth = 0;
            elementHeight = 0;
            sinon.stub(element, 'getBoundingClientRect', () => {
                return {
                    width: elementWidth,
                    height: elementHeight
                };
            });
            document.body.appendChild(element);
            callback = sinon.spy();
            const ro = new window.ResizeObserver(callback);

            ro.observe(element);
        });

        it('watches the element for height changes', () => {
            expect(callback.called).to.equal(false);

            elementHeight = 10;
            mockRaf.step();

            expect(callback.called).to.equal(true);
        });

        it('watches the element for width changes', () => {
            expect(callback.called).to.equal(false);

            elementWidth = 10;
            mockRaf.step();

            expect(callback.called).to.equal(true);
        });

        it('does not dispatch when width and height do not change', () => {
            expect(callback.called).to.equal(false);

            elementWidth = 10;

            mockRaf.step();

            expect(callback.calledOnce).to.equal(true);

            mockRaf.step();

            expect(callback.calledOnce).to.equal(true);

            mockRaf.step();

            expect(callback.calledOnce).to.equal(true);
        });

        it('dispatches the callback once per requestAnimationFrame', () => {
            expect(callback.called).to.equal(false);

            elementWidth = 10;

            mockRaf.step();

            expect(callback.calledOnce).to.equal(true);

            elementWidth = 20;

            mockRaf.step();

            expect(callback.calledTwice).to.equal(true);
        });
    });

    describe('when observing two elements', () => {
        let callback;
        let elements;
        let elementWidths;
        let elementHeights;

        beforeEach(() => {
            elements = [];
            elementWidths = [];
            elementHeights = [];
            elements[0] = document.createElement('div');
            elements[1] = document.createElement('div');
            elementWidths[0] = elementWidths[1] = 0;
            elementHeights[0] = elementHeights[1] = 0;

            callback = sinon.spy();
            const ro = new window.ResizeObserver(callback);

            elements.forEach((el, index) => {
                sinon.stub(el, 'getBoundingClientRect', () => {
                    return {
                        width: elementWidths[index],
                        height: elementHeights[index]
                    };
                });
                document.body.appendChild(el);
                ro.observe(el);
            });

        });

        it('calls the callback when either element\'s size has changed', () => {
            expect(callback.called).to.equal(false);

            elementWidths[0] = 10;
            mockRaf.step();

            expect(callback.calledOnce).to.equal(true);

            elementWidths[1] = 10;
            mockRaf.step();

            expect(callback.calledTwice).to.equal(true);
        });

        it('calls the callback once when both elements\' sizes have changed', () => {
            expect(callback.called).to.equal(false);

            elementWidths[0] = 10;
            elementWidths[1] = 10;

            mockRaf.step();

            expect(callback.calledOnce).to.equal(true);

            mockRaf.step();

            expect(callback.calledOnce).to.equal(true);
        });
    });
});
