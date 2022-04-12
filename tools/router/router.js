class odaRouter {
    constructor() {
        window.addEventListener('popstate', e => {
            this.callback?.(e.state?.path || location.hash)
        });
    }
    create(callback) {
        this.callback = callback;
    }
    go(path) {
        window.history.pushState({ path }, null, path);
        this.callback(path);
    }
}
ODA.router = new odaRouter();

// class odaRouter {
//     constructor() {
//         this.rules = {};
//         this.root = window.location.pathname.replace(/\/[a-zA-Z]+\.[a-zA-Z]+$/, '/');
//         window.addEventListener('popstate', (e) => {
//             this.run(e.state?.path || '');
//         })
//     }
//     create(rule, callback) {
//         for (let r of rule.split(',')) {
//             r = r || '__empty__';
//             this.rules[r] = this.rules[r] || [];
//             if (!this.rules[r].includes(callback))
//                 this.rules[r].push(callback);
//         }
//     }
//     set currentRoute(v) {
//         this._current = v;
//     }
//     go(path, idx = 0) {
//         if (path.startsWith('#')) {
//             const hash = window.location.hash.split('#');
//             hash.unshift();
//             while (hash.length > idx + 1) {
//                 hash.pop();
//             }
//             path = hash.join('#') + path;

//         }
//         window.history.pushState({ path }, null, path);
//         this.run(path)
//     }
//     run(path) {
//         rules: for (let rule in this.rules) {
//             if (rule === '__empty__') {
//                 if (path) continue;
//             }
//             else {
//                 if (!(rule.includes('*')) && rule.length !== path.length) continue rules;
//                 chars: for (let i = 0, char1, char2; i < rule.length; i++) {
//                     char1 = rule[i];
//                     char2 = path[i];
//                     switch (char1) {
//                         case '*':
//                             break chars;
//                         case '?':
//                             if (char2 === undefined) continue rules;
//                             break;
//                         default:
//                             if (char1 !== char2) continue rules;
//                             break;
//                     }
//                 }
//             }
//             for (let h of this.rules[rule])
//                 h(path)
//         }
//     }
//     back() {
//         window.history.back();
//     }
//     forward() {
//         window.history.forward();
//     }
// }
// ODA.router = new odaRouter();