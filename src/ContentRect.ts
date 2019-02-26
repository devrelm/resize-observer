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
        let height = parseFloat(styles.height || '0')
        let left = parseFloat(styles.paddingLeft || '0')
        let top = parseFloat(styles.paddingTop || '0')
        let width = parseFloat(styles.width || '0')
        
        // https://github.com/pelotoncycle/resize-observer/issues/19
        if (isNaN(height) || isNaN(left) || isNaN(top) || isNaN(width)) {
            const rect = target.getBoundingClientRect()
            
            height = rect.height
            left = rect.left
            top = rect.top
            width = rect.width
        }
        
        return Object.freeze({
            height,
            left,
            top,
            width,
        });
    }
};

export { ContentRect };
