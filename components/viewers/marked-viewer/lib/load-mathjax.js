
(function () {
    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS-MML_HTMLorMML';
    script.async = true;
    document.head.appendChild(script);
    script.addEventListener('load', postLoadFunction);
    function postLoadFunction() {
        MathJax.Hub.Config({
            showProcessingMessages: false, messageStyle: 'none',
            tex2jax: { inlineMath: [['$', '$'], ['\\(', '\\)']], displayMath: [['$$', '$$'], ["\\[", "\\]"]], processEscapes: true, processEnvironments: true },
            TeX: { equationNumbers: { autoNumber: "AMS" } }
        })
        top.MathJax = MathJax;
    }
})()
