/*!
 * remark (http://getbootstrapadmin.com/remark)
 * Copyright 2015 amazingsurge
 * Licensed under the Themeforest Standard Licenses
 */
(function(document, window, $) {
  'use strict';

  var Site = window.Site;

  $(document).ready(function($) {
    Site.run();
  });

  // $('#exampleModal').on('show.bs.modal', function(event) {
  //   var button = $(event.relatedTarget);
  //   var recipient = button.data('whatever');
  //   var modal = $(this);
  //   modal.find('.modal-title').text('New message to ' + recipient);
  //   modal.find('.modal-body input').val(recipient);
  // });

  window.exampleBootboxAlertCallback = function() {
    toastr.info("Hello world callback");
  };

  window.exampleBootboxConfirmCallback = function(result) {
    toastr.info("Confirm result: " + result);
  };

  window.exampleBootboxPromptCallback = function(result) {
    if (result === null) {
      toastr.info("Prompt dismissed");
    } else {
      toastr.info("Hi <b>" + result + "</b>");
    }
  };

  // Example Examples
  // ----------------
  (function() {
    $('#exampleBootboxPromptDefaultValue').on('click', function() {
      bootbox.prompt({
        title: "What is your real name?",
        value: "makeusabrew",
        callback: function(result) {
          if (result === null) {
            toastr.info("Prompt dismissed");
          } else {
            toastr.info("Hi <b>" + result + "</b>");
          }
        }
      });
    });

    $('#exampleBootboxCustomDialog').on('click', function() {
      bootbox.dialog({
        message: "I am a custom dialog",
        title: "Custom title",
        buttons: {
          success: {
            label: "Success!",
            className: "btn-success",
            callback: function() {
              toastr.info("great success");
            }
          },
          danger: {
            label: "Danger!",
            className: "btn-danger",
            callback: function() {
              toastr.info("uh oh, look out!");
            }
          },
          main: {
            label: "Click ME!",
            className: "btn-primary",
            callback: function() {
              toastr.info("Primary button");
            }
          }
        }
      });
    });

    $('#exampleBootboxCustomHtmlContents').on('click', function() {
      bootbox.dialog({
        title: "That html",
        message: 'You can also use <b>html</b>'
      });
    });

    $('#exampleBootboxCustomHtmlForms').on('click', function() {
      bootbox.dialog({
        title: "This is a form in a modal.",
        message: '<form class="form-horizontal">' +
          '<div class="form-group">' +
          '<label class="col-md-4 control-label" for="name">Name</label>' +
          '<div class="col-md-6">' +
          '<input type="text" class="form-control input-md" id="name" name="name" placeholder="Your name"> ' +
          '<span class="help-block">Here goes your name</span></div>' +
          '</div>' +
          '<div class="form-group">' +
          '<label class="col-md-4 control-label" for="awesomeness">How awesome is this?</label>' +
          '<div class="col-md-6"><div class="radio-custom radio-primary">' +
          '<input type="radio" name="awesomeness" id="awesomeness-0" value="Really awesome" checked>' +
          '<label for="awesomeness-0">Really awesome </label>' +
          '</div><div class="radio-custom radio-primary">' +
          '<input type="radio" name="awesomeness" id="awesomeness-1" value="Super awesome">' +
          '<label for="awesomeness-1">Super awesome </label>' +
          '</div>' +
          '</div></div>' +
          '</form>',
        buttons: {
          success: {
            label: "Save",
            className: "btn-success",
            callback: function() {
              var name = $('#name').val();
              var answer = $("input[name='awesomeness']:checked").val();
              toastr.info("Hello " + name + ". You've chosen <b>" + answer + "</b>");
            }
          }
        }
      });
    });
  })();

  // Example Styles
  // --------------
  (function() {
    $('#exampleWarningConfirm').on("click", function() {
      swal({
          title: "Are you sure?",
          text: "You will not be able to recover this imaginary file!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: '#DD6B55',
          confirmButtonText: 'Yes, delete it!',
          closeOnConfirm: false,
          //closeOnCancel: false
        },
        function() {
          swal("Deleted!", "Your imaginary file has been deleted!", "success");
        });
    });

    $('#exampleWarningCancel').on("click", function() {
      swal({
          title: "Are you sure?",
          text: "You will not be able to recover this imaginary file!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: '#DD6B55',
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: "No, cancel plx!",
          closeOnConfirm: false,
          closeOnCancel: false
        },
        function(isConfirm) {
          if (isConfirm) {
            swal("Deleted!", "Your imaginary file has been deleted!", "success");
          } else {
            swal("Cancelled", "Your imaginary file is safe :)", "error");
          }
        });
    });
  })();

})(document, window, jQuery);
