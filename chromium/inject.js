var includes = [
    fit_angle,
    mirrorx,
    mirrory,
    centerize,
    rotate,
    translate,
    scale,

    create_controls,
    create
];

(function() {
    var script = document.createElement('script')
    script.type = 'text/javascript'

    includes.forEach(function(fn) {
        script.textContent += fn.toString() + '\n'
    })
    
    script.textContent += '(' + main.toString() + ')()'

    var container = document.getElementsByTagName('head')[0] || document.body || document.documentElement;
    container.appendChild(script)
})()
