(function ($) {

    $.splitter = {
        defaultOptions: {
            distance: 100,
            distanceObject: null,// input type hidden #id selector
            minDistance: 0,
            firstDistance: 0, // first panel size
        }
    }

    // 初期処理
    $.fn.splitter = function (options) {
        var data = $.data(this[0], 'splitter');
        if (data) {
            return data;
        }
        var splitterParent = this;
        splitterParent.options = options = $.extend({}, $.splitter.defaultOptions, options);
        var firstChild = $(splitterParent.children()[0]),
            secondChild = $(splitterParent.children()[1]),
			iconElement = $('<div class="splitterBar">' +
                          '  <div class="" style=""></div>' +
                          '</div>');
        splitterParent.height(splitterParent.outerHeight()).width(splitterParent.innerWidth());

        // 
        if (splitterParent.options.distanceObject) {
            splitterParent.$historySize = $(splitterParent.options.distanceObject);
            splitterParent.options.distance = splitterParent.$historySize.val();
        }


        // 区切り要素のスタイルを設定
        var setSplitElement = function () {
            var h = splitterParent.height();
            iconElement.css({
                'width': '5px',
                'height': h + 'px',
                'float': 'left',
                'background-color': 'lightgray',
                'cursor': 'w-resize',
                'left': '0px',
            }).find('div').css({
                'border-radius': '0px',
                'height': '20px',
                'width': '5px',
                'position': 'relative',
                'background-color': 'gray',
                'cursor': 'pointer',
                'top': (h / 2 - 10) + 'px',
            });
        }

        // パネル要素のスタイルを設定
        var setPanelElement = function (element, width, height, isFirst) {
            var cssOptions = {
                'width': width + 'px',
                'height': height + 'px',
                'float': 'left',
            };
            element.css(cssOptions);

            // スプリッターのサイズを記憶させる場合
            if (splitterParent.options.distanceObject && isFirst) {
                if (!splitterParent.$historySize) {
                    splitterParent.$historySize = $(splitterParent.options.distanceObject);
                }
                splitterParent.$historySize.val(width);
            }
        }

        // エリアの表示/非表示
        var areaToggle = function (obj) {
            if (splitterParent.options.minDistance == 0) {
                var parWidth = splitterParent.width();
                if (firstChild.css('display') == 'none') {
                    setPanelElement(secondChild, parWidth - 5 - firstChild.innerWidth(), secondChild.height(), false);
                } else {
                    setPanelElement(secondChild, parWidth - 5, secondChild.height(), false);
                }
                firstChild.toggle();
            }
            else {
                var w;
                if (firstChild.width() == splitterParent.options.minDistance) {
                    w = splitterParent.options.firstDistance;
                }
                else {
                    w = splitterParent.options.minDistance;
                    splitterParent.options.firstDistance = firstChild.width();
                }

                setPanelElement(firstChild, w, firstChild.height(), true);
                setPanelElement(secondChild, splitterParent.innerWidth() - 5 - w, firstChild.height(), false);
            }
        }

        setPanelElement(firstChild, splitterParent.options.distance, splitterParent.innerHeight(), true);
        setPanelElement(secondChild, splitterParent.width() - splitterParent.options.distance - 5, splitterParent.innerHeight(), false);

        splitterParent.$icon = iconElement;
        // スプリッタ生成
        firstChild.after(iconElement)
            .addClass("firstSplit");
        secondChild.addClass("secondSplit");
        setSplitElement();

        // ドラッグイベントを設定
        iconElement.draggable({
            axis: 'x',
            containment: splitterParent,
            helper: 'clone',
            stop: function (e, ui) {
                var difLeft = ui.originalPosition.left - ui.position.left;
                // サイズをデフォルトに戻す
                setSplitElement();
                // 非表示だった場合
                if (firstChild.css('display') == 'none') {
                    // 最大値は-30
                    difLeft = difLeft > -30 ? -30 : difLeft;
                    setPanelElement(firstChild, difLeft * -1, secondChild.height(), true);
                    setPanelElement(secondChild, secondChild.innerWidth() + difLeft, secondChild.height(), false);
                    firstChild.show();
                }
                else {
                    setPanelElement(firstChild, firstChild.innerWidth() - difLeft, firstChild.height(), true);
                    setPanelElement(secondChild, firstChild.parent().width() - firstChild.innerWidth() - 5, firstChild.height(), false);
                }
            }
            // クリックイベント設定
        }).find('div').on('click', function () {
            areaToggle(this);
        });
        // ウィンドウリサイズイベントの定義
        var resizeSplitter = function () {
            splitterParent.width(splitterParent.parent().width());
            var parentWidth = splitterParent.width();
            var firstOuterWidth = firstChild.outerWidth();
            var sumWidth = firstOuterWidth + secondChild.outerWidth() + 5;
            var firstWidth = Math.floor(firstOuterWidth / sumWidth * parentWidth);
            setPanelElement(firstChild, Math.floor(firstOuterWidth / sumWidth * parentWidth), firstChild.height(), true);
            setPanelElement(secondChild, parentWidth - firstChild.innerWidth() - 5, secondChild.height(), false);
        };
        // ウィンドウの幅変更時イベント
        $(window).resize(resizeSplitter);

        // スプリッター破棄処理作成
        splitterParent.destroy = function () {
            // ドラッグを無効
            splitterParent.$icon.draggable('destroy');
            // ウィンドウサイズ変更イベントの削除
            $(window).off('resize', resizeSplitter);
        };

        // インスタンスを保持
        $.data(this[0], 'splitter', splitterParent);

        return splitterParent;

    };
})(jQuery);