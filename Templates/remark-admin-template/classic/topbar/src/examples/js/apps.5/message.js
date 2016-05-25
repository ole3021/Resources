(function(document, window, $) {
  'use strict';

  window.AppMessage = App.extend({
    handleScrollable: function() {
      var $scrollBody = $(".list-scrollable-body");

      $scrollBody.asScrollable({
        namespace: 'scrollable',
        skin: 'scrollable',
        contentSelector: '>',
        containerSelector: '>',
        direction: 'vertical'
      });

      $('.page-aside-switch').one("click", function() {
        $(".page-aside").on("transitionend", function() {
          $scrollBody.data('asScrollable').update();
        });
      });

      $(".list-group-item").on("click", function() {
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
      })
    },

    scrollChatsToBottom: function() {
      var $chatsWrap = $(".chats-wrap");
      var chatsWrapH = $chatsWrap.height();
      var chatsH = $(".chats").outerHeight();
      var historyBtnH = $("#historyBtn").outerHeight();

      $chatsWrap.scrollTop(chatsH + historyBtnH - chatsWrapH);
    },

    handleResize: function() {
      var self = this;

      $(window).on("resize", function() {
        self.scrollChatsToBottom();
      });
    },

    handleTalking: function() {
      var self = this;
      var $chatsWrap = $(".chats-wrap");
      var $textarea = $('.message-input textarea');
      var $textareaWrap = $('.message-input-wrap');

      autosize($('.message-input textarea'));

      $textarea.on('autosize:resized', function() {
        var height = $textareaWrap.outerHeight();
        $chatsWrap.css('height', 'calc(100% - ' + height + 'px)');
        self.scrollChatsToBottom();
      });


      $(".message-input-btn>button").on("click", function() {
        var talkContents = $(".message-input>.form-control").val();
        var $newMsg = $(
          "<div class='chat-content'>" +
          "<p>" + talkContents + "</p>" +
          "</div>"
        );

        if (talkContents.length > 0) {
          $(".chat").last().find(".chat-body").append($newMsg);
          $(".message-input>.form-control").attr("placeholder", "");
          $(".message-input>.form-control").val("");
        } else {
          $(".message-input>.form-control").attr("placeholder", "type text here...");
        }

        $(".message-input>.form-control").focus();

        self.scrollChatsToBottom();
      });
    },
    run: function(next) {

      this.handleScrollable();
      this.scrollChatsToBottom();
      this.handleResize();
      this.handleTalking();
    }
  });

  $(document).ready(function($) {
    AppMessage.run();
  })
}(document, window, jQuery));
