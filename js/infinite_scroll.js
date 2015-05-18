"use strict";

var infiniteScroll = function(options){
  var is = this;
  is.defaults = {
    maxRows: 50,
    threshold: 500,
    divId: "list",
    rows: 0,
    marginTop: 0
  }
  is.options = $.extend( is.defaults, options );


  is.createItem = function (maxHeight) {
    var height = Math.round(Math.random()*200) + 100;
    if (maxHeight < height) height = maxHeight; //Fix for random first element heigth

    return $("<div>")
      .addClass("item")
      .css({"height": height,
        "background-color": '#'+ ('000000' + (Math.random()*0xFFFFFF<<0).toString(16)).slice(-6)
      });
  }

  is.prepend = function(){
    var item = is.createItem(is.options.marginTop).prependTo("#" + is.options.divId);
    $("#" + is.options.divId).css({"margin-top": is.options.marginTop -= item.height() });
  }

  is.append = function(){
    if (is.options.rows < is.options.maxRows){

      var item = is.createItem().appendTo("#" + is.options.divId);
      this.options.rows++;

      if (is.options.rows == is.options.maxRows){
        item.css({"border" : "15px dashed black"});
      }
    }
  }

  $(window).scroll(function(){
    var windowHeight = $(window).height();
    var scrollTop = $(window).scrollTop();

    if ( scrollTop + windowHeight >= $(document).height() - is.options.threshold ){
      is.append();
    } else if ( is.options.marginTop != 0 && scrollTop - is.options.threshold <= is.options.marginTop ){
      is.prepend();
    }

    $(".item").each(function() {
      var item = $(this);
      var height = item.height();
      var itemPosition = item.offset().top;

      if ( scrollTop > itemPosition + is.options.threshold + height  ){
        is.options.marginTop += height;
        item.remove();
        $("#" + is.options.divId).css({"margin-top": is.options.marginTop});

      } else if (itemPosition - is.options.threshold - height > scrollTop + windowHeight ){
        item.remove();
        is.options.rows--;
      };
    });
  });

  // Load initial items
  for (var i=0; i<10; ++i ){ is.append(); }
  return is;
}
