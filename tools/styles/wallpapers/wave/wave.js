ODA({is: 'oda-wave',
    styleNode: undefined,
    attached() {
        this.styleNode = document.createElement("style");
        document.head.appendChild(this.styleNode);
        this.styleNode.innerHTML = style;
    },
    stopAnimation() {
        document.head.removeChild(this.styleNode);
    }
})

const style = `
body {
    margin: auto;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    overflow: auto;
    background: linear-gradient(315deg, 
        rgba(101,0,94,1) 3%, 
        rgba(60,132,206,1) 38%, 
        rgba(48,138,226,1) 68%, 
        rgba(255,25,25,1) 98%
    );
    animation: gradient 15s ease infinite;
    background-size: 400% 400%;
    background-attachment: fixed;
}
@keyframes gradient {
    0% {
        background-position: 0% 0%;
    }
    50% {
        background-position: 100% 100%;
    }
    100% {
        background-position: 0% 0%;
    }
}
`