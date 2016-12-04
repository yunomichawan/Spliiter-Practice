(function ($) {
    var splitter;

    $.splitter = {
        defaultOptions: {
            distance: 100,
            minDistance: 0, 
            firstDistance: 0,
            orientation: 'horizotal',// horizotal or vertical
            angle: 'left',
        }
    }

    // 初期処理
    $.fn.splitter = function (options) {
        var splitterParent = this;
        splitterParent.options = options = $.extend({}, $.splitter.defaultOptions, options);
        var firstChild = $(splitterParent.children()[0]),
            secondChild = $(splitterParent.children()[1]),
			iconElement = $('<div class="splitterBar">' +
                          '  <div class="" style=""></div>' +
                          '</div>');

        splitterParent.height(splitterParent.outerHeight()).width(splitterParent.innerWidth());

        setPanelElement(firstChild, splitterParent.options.distance, splitterParent.innerHeight());
        setPanelElement(secondChild, splitterParent.width() - splitterParent.options.distance - 5, splitterParent.innerHeight());

        splitterParent.$icon = iconElement;
        // スプリッタ生成
        firstChild.after(iconElement);
        firstChild.addClass("firstSplit");
        secondChild.addClass("secondSplit");
        // クリックイベント設定
        iconElement.find('div').on('click', function () {
            areaToggle(this, splitterParent);
        });

        setSplitElement(iconElement);

        // ドラッグイベントを設定
        iconElement.draggable({
            axis: 'x',
            containment: splitterParent,
            helper: 'clone',
            start: function (e, ui) {

            },
            resize: function (e, ui) {

            },
            stop: function (e, ui) {
                var target = $(e.target);
                var firstChild = target.prev();
                var secondChild = target.next();
                var difLeft = ui.originalPosition.left - ui.position.left;
                // 最大値は-30
                // サイズをデフォルトに戻す
                setSplitElement(target);
                // 非表示だった場合
                if (firstChild.css('display') == 'none') {
                    difLeft = difLeft > -30 ? -30 : difLeft;
                    setPanelElement(firstChild, difLeft * -1, secondChild.height());
                    setPanelElement(secondChild, secondChild.innerWidth() + difLeft, secondChild.height());
                    firstChild.show();
                }
                else {
                    setPanelElement(firstChild, firstChild.innerWidth() - difLeft, firstChild.height());
                    setPanelElement(secondChild, firstChild.parent().width() - firstChild.innerWidth() - 5, firstChild.height());
                }
            }
        });
        splitter = splitterParent;
    };

    // 区切り要素のスタイルを設定
    function setSplitElement(element) {
        element.css({
            'width': '5px',
            'height': element.prev().height() + 'px',
            'float': 'left',
            'background-color': 'lightgray',
            'cursor': 'w-resize',
            'left': '0px',
        });
        element.find('div').css({
            'border-radius': '0px',
            'height': '20px',
            'width': '5px',
            'position': 'relative',
            'background-color': 'gray',
            'cursor': 'pointer',
            'top': (element.prev().height() / 2 - 10) + 'px',
        });
    }

    // パネル要素のスタイルを設定
    function setPanelElement(element, width, height) {
        var cssOptions = {
            'width': width + 'px',
            'height': height + 'px',
            'float': 'left',
        };
        element.css(cssOptions);
    }

    // エリアの表示/非表示
    function areaToggle(obj, sp) {
        var splitterParent = $(obj).parent().parent();
        var firstChild = $(splitterParent.children()[0]);
        var secondChild = $(splitterParent.children()[2]);
        if (sp.options.minDistance == 0) {
            if (firstChild.css('display') == 'none') {
                setPanelElement(secondChild, splitterParent.width() - 5 - firstChild.innerWidth(), secondChild.height());
            } else {
                setPanelElement(secondChild, splitterParent.width() - 5, secondChild.height());
            }
            firstChild.toggle();
        }
        else {
            var w;
            if (firstChild.width() == sp.options.minDistance) {
                w = sp.options.firstDistance;
            }
            else {
                w = sp.options.minDistance;
                sp.options.firstDistance = firstChild.width();
            }

            setPanelElement(firstChild, w, firstChild.height());
            setPanelElement(secondChild, splitterParent.innerWidth() - 5 - w, firstChild.height());
        }
    }

    // ウィンドウの幅変更時イベント
    $(window).resize(function () {
        var splitElement = $('.splitterBar');
        var splitParent = splitElement.parent();
        splitParent.width(splitParent.parent().width());
        for (var i = 0; i < splitElement.length; i++) {
            var split = $(splitElement[i]);
            var parentWidth = split.parent().width();
            var firstElement = split.parent().find('.firstSplit');
            var secondElement = split.parent().find('.secondSplit');

            var sumWidth = firstElement.outerWidth() + secondElement.outerWidth() + 5;
            var firstWidth = Math.floor(firstElement.outerWidth() / sumWidth * parentWidth);
            setPanelElement(firstElement, Math.floor(firstElement.outerWidth() / sumWidth * parentWidth), firstElement.height());
            setPanelElement(secondElement, parentWidth - firstElement.innerWidth() - 5, secondElement.height());

        }
    });

})(jQuery);