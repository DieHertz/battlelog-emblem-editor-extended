function fit_angle(angle) {
    return (angle % 360 + 360) % 360
}

function mirrorx() {
    var object = emblem.emblem.canvas.getActiveObject()

    object.set('angle', fit_angle(-object.get('angle')))
    object.set('flipY', !object.get('flipY'))

    emblem.emblem.render()
}

function mirrory() {
    var object = emblem.emblem.canvas.getActiveObject()

    object.set('angle', fit_angle(180 - object.get('angle')))
    object.set('flipY', !object.get('flipY'))

    emblem.emblem.render()
}

function centerize() {
    var object = emblem.emblem.canvas.getActiveObject(),
        center = emblem.emblem.canvas.getCenter()

    object.set('left', center.left)
    object.set('top', center.top)
    object.setCoords()

    emblem.emblem.render()
}

function rotate(target, angle) {
    target.set('angle', fit_angle(target.get('angle') + angle))
    target.setCoords()
}

function translate(target, translation) {
    target.set('left', target.get('left') + translation.x)
    target.set('top', target.get('top') + translation.y)
    target.setCoords()
}

function scale(target, scale) {
    target.set('scaleX', target.get('scaleX') * scale)
    target.set('scaleY', target.get('scaleY') * scale)
    target.setCoords()
}
