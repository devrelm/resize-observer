interface ContentRect {
    height: number;
    left: number;
    top: number;
    width: number;
}

const ContentRect = (target: Element): Readonly<ContentRect> => {
    if ('getBBox' in (target as SVGGraphicsElement)) {
        const box = (target as SVGGraphicsElement).getBBox();
        return Object.freeze({
            height: box.height,
            left: 0,
            top: 0,
            width: box.width,
        });
    } else { // if (target instanceof HTMLElement) { // also includes all other non-SVGGraphicsElements
        const styles = window.getComputedStyle(target);
        const paddingTop = parseFloat(styles.paddingTop || '0');
        const paddingRight = parseFloat(styles.paddingRight || '0');
        const paddingBottom = parseFloat(styles.paddingBottom || '0');
        const paddingLeft = parseFloat(styles.paddingLeft || '0');
        const width = parseFloat(styles.width || '0') - paddingLeft - paddingRight;
        const height = parseFloat(styles.height || '0') - paddingTop - paddingBottom;
        return Object.freeze({ height, left, top, width });
    }
};

export { ContentRect };
