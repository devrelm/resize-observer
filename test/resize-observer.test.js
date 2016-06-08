const {expect} = require('chai');
const MockBrowser = require('mock-browser').mocks.MockBrowser;
const mockRaf = require('mock-raf')();
const sinon = require('sinon');

describe('ResizeObserver', () => {
	let rafStub;

    beforeEach(() => {
        global.window = MockBrowser.createWindow();
        global.document = MockBrowser.createDocument();

        window.requestAnimationFrame = mockRaf.raf;
        rafStub = sinon.stub(window, 'requestAnimationFrame', mockRaf.raf);
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

    describe('when observing an element', () => {
        let element;
        let callback;
        let elementWidth;
        let elementHeight;

        beforeEach(() => {
            element = document.createElement('div');
            elementWidth = 0;
            elementHeight = 0;
            mockGbcr = sinon.stub(element, 'getBoundingClientRect', () => {
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

            mockRaf.step();

            expect(callback.called).to.equal(false);

            mockRaf.step();

            expect(callback.called).to.equal(false);
        });
    });
});
