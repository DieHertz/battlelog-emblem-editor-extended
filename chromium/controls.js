function create_controls() {
    //  Buttons for new actions
    (function() {
        var html =
            '<button class="btn" onclick="mirrorx();">MX</button>\
            <button class="btn" onclick="mirrory();">MY</button>\
            <button class="btn" onclick="centerize();">C</button>'

        $('div.layer-actions').append(html)
    })();

    //  Layer info display
    (function() {
        var html =
        '<div class="span3 editor-col" id="emblem-editor-extended-layer-info-container" style="position: absolute">\
            <div class="box">\
                <header>\
                    <h1>Layer Info</h1>\
                </header>\
                <ul class="box-content emblem-editor-extended-list">\
                    <li>\
                        <label>X:</label>\
                        <input type="text" size="6" data-type="x">\
                    </li>\
                    <li>\
                        <label>Y:</label>\
                        <input type="text" size="6" data-type="y">\
                    </li>\
                    <li>\
                        <label>Width:</label>\
                        <input type="text" size="6" data-type="width">\
                    </li>\
                    <li>\
                        <label>Height:</label>\
                        <input type="text" size="6" data-type="height">\
                    </li>\
                    <li>\
                        <label>Angle:</label>\
                        <input type="text" size="6" data-type="angle">\
                    </li>\
                </ul>\
            </div>\
        </div>'

        $('div.emblem-edit-canvas').after(html)
    })();

    //  Hotkeys description
    (function() {
        var html =
        '<div class="keyboard-shortcut-info select-all">\
            Select all\
            <div class="controls">\
                <span class="icon" style="vertical-align: bottom; font-size: 18px">CTRL</span>\
                <span class="plus">+</span>\
                <span class="icon" style="vertical-align: bottom; font-size: 18px">A</span>\
            </div>\
        </div>\
        <div class="keyboard-shortcut-info deselect-all">\
            Deselect all\
            <div class="controls">\
                <span class="icon" style="vertical-align: bottom; font-size: 18px">CTRL</span>\
                <span class="plus">+</span>\
                <span class="icon" style="vertical-align: bottom; font-size: 18px">D</span>\
            </div>\
        </div>\
        <div class="keyboard-shortcut-info select-invert">\
            Select invert\
            <div class="controls">\
                <span class="icon" style="vertical-align: bottom; font-size: 18px">CTRL</span>\
                <span class="plus">+</span>\
                <span class="icon" style="vertical-align: bottom; font-size: 18px">I</span>\
            </div>\
        </div>\
        <div class="keyboard-shortcut-info rotate" style="clear: left">\
            Rotate\
            <div class="controls">\
                <span class="icon" style="vertical-align: bottom; font-size: 18px">QE</span>\
            </div>\
        </div>\
        <div class="keyboard-shortcut-info rotate-further">\
            Rotate further\
            <div class="controls">\
                <span class="shift icon"></span>\
                <span class="plus">+</span>\
                <span class="icon" style="vertical-align: bottom; font-size: 18px">QE</span>\
            </div>\
        </div>\
        <div class="keyboard-shortcut-info scale">\
            Scale\
            <div class="controls">\
                <span class="icon" style="vertical-align: bottom; font-size: 18px">ZX</span>\
            </div>\
        </div>\
        <div class="keyboard-shortcut-info scale-further">\
            Scale further\
            <div class="controls">\
                <span class="shift icon"></span>\
                <span class="plus">+</span>\
                <span class="icon" style="vertical-align: bottom; font-size: 18px">ZX</span>\
            </div>\
        </div>'

        $('div.keyboard-controls > div.box-content').append(html)
    })();

    //  Background image options
   (function() {
        var html =
        '<div class="box" id="emblem-editor-extended-background">\
            <header><h1>Background image</h1></header>\
            <ul class="box-content emblem-editor-extended-list">\
                <li>\
                    <label>URL:</label>\
                    <input id="emblem-editor-extended-background-image-url" type="text" placeholder="Enter image address">\
                </li>\
                <li>\
                    <label>File:</label>\
                    <input id="emblem-editor-extended-background-image-file" type="file">\
                </li>\
            </ul>\
        </div>'

        $('div.emblem-layer-options').after(html)

        $('canvas#emblem-canvas')
            .css('background-size', 'contain')
            .css('background-position', 'center')
            .css('background-repeat', 'no-repeat')
    })();

    /** Copy emblem code to clipboard
     */
    (function() {
        var buttonHtml =
        '<button id="emblem-action-show" class="btn btn-primary pull-right margin-left">\
            <span>Show Code</span>\
        </button>\
        <button id="emblem-action-load" class="btn btn-primary pull-right margin-left">\
            <span>Load Code</span>\
        </button>'

        $('#emblem-save-btn').after(buttonHtml)

        var emblemCodeHtml =
        '<div id="emblem-editor-extended-code" class="clearfix">\
            <ul>\
                <li><textarea cols="60" rows="10" placeholder="Enter emblem code here" /></li>\
                <li><button class="btn">Ok</button></li>\
            </ul>\
        </div>'

        $('#emblem-select').before(emblemCodeHtml)
    })();
}
