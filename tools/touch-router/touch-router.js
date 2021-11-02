ODA({
    is: 'oda-touch-router',

    attached() {
        window.top.$odaTouchRouter = window.top.$odaTouchRouter || {};
        this.listen('touch-router-event', 'onTouch', {target: window});
        this.listen('touchstart', 'onTouch', {target: window});
        this.listen('touchend', 'onTouch', {target: window});
        this.listen('touchmove', 'onTouch', {target: window});
        this.listen('touchcancel', 'onTouch', {target: window});
    },

    detached() {
        this.unlisten('touch-router-event', 'onTouch', {target: window});
        this.unlisten('touchstart', 'onTouch', {target: window});
        this.unlisten('touchend', 'onTouch', {target: window});
        this.unlisten('touchmove', 'onTouch', {target: window});
        this.unlisten('touchcancel', 'onTouch', {target: window});
        if (window.top.length)
            delete window.top.$odaTouchRouter;
    },

    onTouch(e) {
        const router = window.top.$odaTouchRouter;
        if (!router)
            return;
        e = e.detail?.sourceEvent || e;
        if (e.$executed || router?.executed)
            return this._resetTouchRouter();

        let handler = () => {};
        switch(e.type) {
            case 'touchstart':
                router.startEvent = e;
                handler = this.onTouchStart;
                break;
            case 'touchmove':
                if (!router.startEvent)
                    return;
                handler = this.onTouchMove;
                break;
            case 'touchcancel':
                handler = this.onTouchCancel;
                break;
            case 'touchend':
                handler = this.onTouchEnd;
                break;
        }

        let answer;
        if (!e.$phase && window === window.top) {
            answer = handler.call(this, e);
        } else {
            if (!e.$phase || !e.$path) {
                e.$phase = 'capturing';

                let w = window;
                const path = [w];
                while (w = w.parent) {
                    path.push(w);
                    if (w === window.top) break;
                }
                e.$path = path;
                e.$path.pop()?.dispatchEvent(new CustomEvent('touch-router-event', {detail: {sourceEvent: e}}));
            } else {
                answer = handler.call(this, e);
            }
        }

        if ((e.type === 'touchcancel' || e.type === 'touchend') && (!e.$phase || (e.$phase === 'bubbling' && window === window.top)))
            return this._resetTouchRouter();

        switch (answer) {
            case 'pass':
                if (e.$phase === 'capturing' && e.$path.length)
                    e.$path.pop()?.dispatchEvent(new CustomEvent('touch-router-event', {detail:{sourceEvent: e}}));
                else if ((e.$phase === 'capturing' && !e.$path.length) || (e.$phase === 'bubbling' && window !== window.top)) {
                    e.$phase = 'bubbling';
                    window.parent.dispatchEvent(new CustomEvent('touch-router-event', {detail:{sourceEvent: e}}))
                }
                return;
            case 'finish':
                return this._resetTouchRouter();
            case 'restart':
                router.startEvent = e;
                delete e.$phase;
                return;
            default:
                return;
        }
    },

    onTouchStart(e) {}, // returns: undefined, 'pass', 'finish', 'restart'

    onTouchMove(e) {}, // returns: undefined, 'pass', 'finish', 'restart'

    onTouchCancel(e) {}, // returns: undefined, 'pass', 'finish', 'restart'

    onTouchEnd(e) {}, // returns: undefined, 'pass', 'finish', 'restart'

    _resetTouchRouter() {
        window.top.$odaTouchRouter = {};
    }
});