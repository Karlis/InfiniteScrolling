"use strict";
 var infiniteScroll = function($, window, document) {
  return function (options) {
    var is = this;
    is.defaults = {
      maxRows: 50,
      thresholdTop: 500,
      thresholdBottom: 200,
      selector: "#list",
      rows: 0,
      marginTop: 0
    };
    is.options = $.extend(is.defaults, options);

    is.createItem = function (maxHeight) {
      var height = Math.round(Math.random() * 200) + 100;
      if (maxHeight < height) {height = maxHeight; } //Fix for random first element heigth

      return $("<div>")
        .addClass("item")
        .css({"height": height,
          "background-color": '#' + ('000000' + (Math.random()*0xFFFFFF<<0).toString(16)).slice(-6)
          });
    };

    is.prepend = function () {
      var item = is.createItem(is.options.marginTop).prependTo(is.options.selector);
      is.options.marginTop -= item.height();
      $(is.options.selector).css({"margin-top": is.options.marginTop });
    };

    is.append = function () {
      if (is.options.rows < is.options.maxRows) {

        var item = is.createItem().appendTo(is.options.selector);
        this.options.rows++;

        if (is.options.rows === is.options.maxRows) {
          item.css({"border" : "15px dashed black"});
        }
      }
    };

    is.scroll = function () {
      var scrollTop = $(window).scrollTop();
      var scrollBottom = scrollTop + $(window).height();
      var bottomThreshold = $(document).height() - is.options.thresholdBottom;
      var topThreshold = is.options.marginTop + is.options.thresholdTop;

      if (scrollBottom >= bottomThreshold) {
        is.append();
      } else if (is.options.marginTop !== 0 && scrollTop <= topThreshold) {
        is.prepend();
      }

      $(".item").each(function () {
        var $item = $(this);
        var height = $item.height();
        var itemPosition = $item.offset().top;
        var itemBottomThreshold = itemPosition + is.options.thresholdTop + height;
        var itemTopThreshold = itemPosition - is.options.thresholdBottom;

        if (scrollTop > itemBottomThreshold) {
          is.options.marginTop += height;
          $(is.options.selector).css({"margin-top": is.options.marginTop });
          $item.remove();

        } else if (scrollBottom < itemTopThreshold) {
          $item.remove();
          is.options.rows--;
        }
      });
    };

    // Load initial items
    for (var i=0; i<10; ++i ){ is.append(); }

    $(window).scroll(is.scroll);
    return is;
  }
}($, window, document);
