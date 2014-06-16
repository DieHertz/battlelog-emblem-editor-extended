function create() {
    create_controls()
 
    var layerActions = $('div.layer-actions');
    var $emblem = emblem.emblem
    var canvas = $emblem.canvas

    /** Setting background image via text input with URL
     */
    $('input#emblem-editor-extended-background-image-url').on('blur keyup change cut paste', function() {
        $('canvas#emblem-canvas').css('background-image', 'url(' + this.value + ')');
        backgroundSelect.replaceWith(backgroundSelect = backgroundSelect.clone(true));
    });

    /** Setting background image via file input
     */
    var backgroundSelect = $('input#emblem-editor-extended-background-image-file');
    backgroundSelect.on('change', function() {
        var reader = new FileReader();
        reader.onload = function(event) {
            $('canvas#emblem-canvas').css('background-image', 'url(' + event.target.result + ')');
            $('input#emblem-editor-extended-background-image-url').val('');
        };

        reader.readAsDataURL(this.files[0]);
    });

    /** Layer info fields handling
     */
    var layerInfoContainer = $('div#emblem-editor-extended-layer-info-container'),
        layerInfoInputs = layerInfoContainer.find('input');

    layerInfoInputs.on('blur keyup change cut paste', function() {
        var object = canvas.getActiveObject() || canvas.getActiveGroup();
        if (!object) return;

        var value = parseFloat(this.value);
        if (isNaN(value)) return;

        switch ($(this).attr('data-type')) {
        case 'x':
            object.set('left', value);
            break;
        case 'y':
            object.set('top', value);
            break;
        case 'width':
            object.set('scaleX', value / object.get('width'))
            break;
        case 'height':
            object.set('scaleY', value / object.get('height'))
            break;
        case 'angle':
            object.set('angle', value);
            break;
        }

        object.setCoords();
        $emblem.render();
    });

    /** Updates layer info block
     */
    var updateLayerInfo = function() {
        var object = canvas.getActiveObject() || canvas.getActiveGroup();
        layerInfoContainer.css('display', object ? 'block' : 'none');
        if (!object) {
            return;
        }

        layerInfoInputs.each(function() {
            var input = $(this);

            var value;
            switch (input.attr('data-type')) {
                case 'x':
                    value = object.get('left').toFixed(2);
                    break;
                case 'y':
                    value = object.get('top').toFixed(2);
                    break;
                case 'width':
                    value = object.getWidth().toFixed(2);
                    break;
                case 'height':
                    value = object.getHeight().toFixed(2);
                    break;
                case 'angle':
                    value = object.get('angle').toFixed(2);
                    break;
            }

            if (input.val() != value) input.val(value);

            //  Adjust corner sizes
            var cornerSize = Math.min(12, Math.max(4, Math.sqrt(object.getWidth() * object.getHeight()) / 10));
            if (object.cornerSize != cornerSize) {
                object.cornerSize = cornerSize;
                $emblem.render();
            }
        });
    };

    /** Update layer info when mouse moves over canvas
     */
    var updateDelayMsec = 200;
    $('canvas.upper-canvas').on('mousemove mouseup', updateLayerInfo);
    layerActions.on('click', updateLayerInfo);
    /** Update layer info when new element is added to canvas
     */
    $('div.jspContainer').on('click', function() {
        window.setTimeout(updateLayerInfo, updateDelayMsec);
    });
    /** Update layer info when some layer is clicked
     */
    $('ul#emblem-edit-layers').on('click', function() {
        window.setTimeout(updateLayerInfo, updateDelayMsec);
    });

    var emblemCodeDiv = $('div#emblem-editor-extended-code'),
        emblemCodeTextArea = emblemCodeDiv.find('textarea'),
        emblemCodeButton = emblemCodeDiv.find('button');
    /** Copy emblem code button handler
     */
    $('button#emblem-action-show').pageLive('click', function() {
        emblemCodeDiv.slideDown(function() {
            emblemCodeTextArea.focus().select();
        });
        emblemCodeButton.attr('data-action', 'show');
        var emblemCode = 'emblem.emblem.load(' + JSON.stringify($emblem.data, null, 2) + ');';
        emblemCodeTextArea.val(emblemCode)
            .attr('disabled', '')
            .focus().select();
    });

    $('button#emblem-action-load').pageLive('click', function() {
        emblemCodeDiv.slideDown(function() {
            emblemCodeTextArea.focus();
        });
        emblemCodeButton.attr('data-action', 'load');
        emblemCodeTextArea.val('').attr('disabled', null);
    });

    emblemCodeButton.on('click', function() {
        switch ($(this).attr('data-action')) {
        case 'show':
            break;
        case 'load': {
            try {
                var emblemCode = emblemCodeTextArea.val();
                emblemCode = emblemCode.replace('emblem.emblem.load(', '').replace(');', '');
                canvas.clear()
                $emblem.load(JSON.parse(emblemCode));
            } catch (e) {
                console.log('code provided does not describe an emblem');
            }

            break;
        }
        }

        emblemCodeDiv.slideUp();
    });

    //  group rotation
    var selected_layers = []
    var collect_objects = function() {
        var objects = []

        canvas.getObjects().forEach(function(obj, idx) {
            if (selected_layers[idx]) {
                obj.set('active', true)
                objects.push(obj)
            }
        })

        return objects
    }
    var group_selected_objects = function() {
        var objects = collect_objects()

        if (objects.length == 1) {
            canvas.setActiveObject(objects[0], undefined)
        } else if (objects.length > 1) {
            var group = new fabric.Group(objects.reverse(), {
                originX: 'center',
                originY: 'center'
            })
            canvas.setActiveGroup(group, undefined)
            group.saveCoords()
            canvas.renderAll()
        }
    }
    var set_selection_checkbox = function(obj, idx, select) {
        selected_layers[idx] = select
        obj.$layerElement.find('input.emblem-editor-extended-select')
            .prop('checked', select)
    }
    var clear_selection_checkboxes = function() {
        canvas.getObjects().forEach(function(obj, idx) {
            set_selection_checkbox(obj, idx, false)
        })
    }
    var update_selection_checkboxes = function(target) {
        if (target instanceof fabric.Group) {
            var objects = canvas.getObjects()

            target.forEachObject(function(obj) {
                var idx = objects.indexOf(obj)

                set_selection_checkbox(obj, idx, true)
            })
        } else {
            var idx = canvas.getObjects().indexOf(target)

            set_selection_checkbox(target, idx, true)

        }
    }
    var on_checkbox_changed = function(idx) {
        canvas.deactivateAll()
        group_selected_objects()
        $emblem.render()
    }

    var emblem_edit_layers = $('ul#emblem-edit-layers')
    emblem_edit_layers.on('DOMNodeInserted', function(e) {
        var el = $(e.target)
        if (!el.is('li')) return

        var objs = canvas.getObjects()

        objs.forEach(function(obj, idx) {
            var el = obj.$layerElement
            if (!el || el.find('input.emblem-editor-extended-select').size()) return

            el.prepend(
                '<input class="emblem-editor-extended-select" style="margin: 9px 8px 0 0" type="checkbox">'
            )

            var input = el.find('input.emblem-editor-extended-select')

            if (selected_layers[idx] == undefined) selected_layers[idx] = false
            input.prop('checked', selected_layers[idx])

            input.on('change', function() {
                selected_layers[idx] = $(this).prop('checked')
                on_checkbox_changed(idx)
            })
        })
    })

    var select_all = function(select) {
        canvas.getObjects().forEach(function(obj, idx) {
            var el = obj.$layerElement
            if (!el) return

            selected_layers[idx] = select && obj.selectable;
            el.find('input.emblem-editor-extended-select').prop('checked', select)
        })
    }
    var select_invert = function() {
        var layers = []

        canvas.getObjects().forEach(function(obj, idx) {
            var el = obj.$layerElement
            if (!el) return

            layers.push(!selected_layers[idx] && obj.selectable)
            el.find('input.emblem-editor-extended-select').prop('checked', layers[idx])
        })

        selected_layers = layers
    }

    canvas.observe('object:added', function(e) {
    })

    canvas.observe('object:removed', function(e) {
        canvas.deactivateAll()
        group_selected_objects()
    })

    //  occurs when object is selected
    canvas.observe('object:selected', function(e) {
        if (!e.target.selectable) return

        if (canvas.getActiveObject() == e.target && canvas.getActiveGroup()) {
            canvas._discardActiveGroup()
            canvas._setActiveObject(e.target)
            $emblem.render()
        }
        clear_selection_checkboxes()
        update_selection_checkboxes(e.target)
    })

    //  occurs when group is created or updated(!!!)
    canvas.observe('selection:created', function(e) {
        clear_selection_checkboxes()
        update_selection_checkboxes(e.target)
    })

    //  occurs when all objects are deselected
    canvas.observe('selection:cleared', function(e) {
        clear_selection_checkboxes()
    })

    var selection_hotkeys = function(event) {
        var key_a = 65,
            key_d = 68,
            key_i = 73

        var should_update = false
        if (event.ctrlKey) {
            should_update = true
            if (event.keyCode == key_a) select_all(true)
            else if (event.keyCode == key_d) select_all(false)
            else if (event.keyCode == key_i) select_invert()
            else should_update = false
        }

        if (should_update) {
            event.preventDefault()
            canvas.deactivateAll()
            group_selected_objects()
            $emblem.render()
            updateLayerInfo()
        }
    }
    $(document).pageBind('keydown', selection_hotkeys)

    var transform_hotkeys = function(event) {
        var target = canvas.getActiveObject() || canvas.getActiveGroup()
        if (!target) return
        var is_group = target instanceof fabric.Group

        var key_arrow_left = 37,
            key_arrow_up = 38,
            key_arrow_right = 39,
            key_arrow_down = 40,
            key_q = 81,
            key_e = 69,
            key_z = 90,
            key_x = 88

        var scale_factor = 2e-2
        var val = event.shiftKey ? 10 : 1
        var should_update = true

        switch (event.which) {
        case key_q:
            rotate(target, val);
            break;
        case key_e:
            rotate(target, -val);
            break;

        case key_z:
            scale(target, 1 - val * scale_factor);
            break;
        case key_x:
            scale(target, 1 + val * scale_factor);
            break;

        case key_arrow_left:
            if (is_group) translate(target, {
                x: -val,
                y: 0
            });
            break;
        case key_arrow_right:
            if (is_group) translate(target, {
                x: val,
                y: 0
            });
            break;
        case key_arrow_up:
            if (is_group) translate(target, {
                x: 0,
                y: -val
            });
            break;
        case key_arrow_down:
            if (is_group) translate(target, {
                x: 0,
                y: val
            });
            break;

        default:
            should_update = false
        }

        if (should_update) {
            event.preventDefault()
            updateLayerInfo()
            $emblem.render()
        }
    }
    $(document).pageBind('keydown', transform_hotkeys)

    var update_layer_info = function(event) {
        var key_arrow_left = 37,
            key_arrow_up = 38,
            key_arrow_right = 39,
            key_arrow_down = 40;

        var should_update = true

        switch (event.keyCode) {
        case key_arrow_left:
        case key_arrow_up:
        case key_arrow_right:
        case key_arrow_down:
            layerInfoInputs.each(function() {
                if (this == document.activeElement) $(this).blur()
            })
            break

        default:
            should_update = false
        }

        if (should_update) updateLayerInfo()
    }
    $(document).pageBind('keyup', update_layer_info)

    //  small delay for canvas to be successfully initialized
    window.setTimeout(function() {
        canvas.selection = true
    }, updateDelayMsec)
}

function main() {
    var url_pattern = 'http://battlelog.battlefield.com/.*?/emblem/.*'
    var matcher = new RegExp('^' + url_pattern + '$', 'i')
    
    if (document.URL.match(matcher)) create()

    $(document).on('pageshow', function() {
        var match = document.URL.match(matcher)
        if (match) create()
    })
}