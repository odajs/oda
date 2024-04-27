const PATH = import.meta.url.replace('pptx-viewer.js','');

ODA({ is: 'oda-pptx-viewer', imports: '@oda/button',
    template: `
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                position: relative;
            }
        </style>
        <iframe style="border: none; width: 100%; height: 100%;"></iframe>
        <oda-button icon="icons:fullscreen" fill="gray" icon-size="32" @tap="setFullscreen" style="position: absolute; top: 8px; right: 16px; z-index: 9999"></oda-button>
    `,
    url: '',
    isReady: false,
    attached() {
        this.isReady = true;
    },
    $observers: {
        urlChanged(url, isReady) {
            if (url && isReady) {
                this.$('iframe').srcdoc = srcdoc(url);
            }
        }
    },
    setFullscreen() {
        this.fullscreenMode = !this.fullscreenMode;
        const element = this;
        if (this.fullscreenMode) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }
})

const srcdoc = (url) => {
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>PPTXjs - Viewer</title>

<link rel="stylesheet" href="${PATH}lib/pptxjs.css">
<link rel="stylesheet" href="${PATH}lib/nv.d3.min.css">

<script type="text/javascript" src="${PATH}lib/jquery-1.11.3.min.js"></script>
<script type="text/javascript" src="${PATH}lib/jszip.min.js"></script>
<script type="text/javascript" src="${PATH}lib/filereader.js"></script>
<script type="text/javascript" src="${PATH}lib/d3.min.js"></script>
<script type="text/javascript" src="${PATH}lib/nv.d3.min.js"></script>
<script type="text/javascript" src="${PATH}lib/pptxjs.js"></script>
<script type="text/javascript" src="${PATH}lib/divs2slides.js"></script>
</head>
<body>
    <div id="result"></div>
<script>
$("#result").pptxToHtml({
    pptxFileUrl: "${url}",
    fileInputId: "uploadFileInput",
    slideMode: false,
    keyBoardShortCut: false,
    slideModeConfig: {  //on slide mode (slideMode: true)
        first: 1, 
        nav: false, /** true,false : show or not nav buttons*/
        navTxtColor: "white", /** color */
        navNextTxt:"&#8250;", //">"
        navPrevTxt: "&#8249;", //"<"
        showPlayPauseBtn: false,/** true,false */
        keyBoardShortCut: false, /** true,false */
        showSlideNum: false, /** true,false */
        showTotalSlideNum: false, /** true,false */
        autoSlide: false, /** false or seconds (the pause time between slides) , F8 to active(keyBoardShortCut: true) */
        randomAutoSlide: false, /** true,false ,autoSlide:true */ 
        loop: false,  /** true,false */
        background: "black", /** false or color*/
        transition: "default", /** transition type: "slid","fade","default","random" , to show transition efects :transitionTime > 0.5 */
        transitionTime: 1 /** transition time in seconds */
    }
});
</script>

</body>
</html>
`
}
