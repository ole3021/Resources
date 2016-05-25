(function(document, window, $) {
  'use strict';

  var Site = window.Site;

  $(document).ready(function($) {
    Site.run();
  });

  // Example Wizard Form
  // -------------------
  (function() {
    // set up formvalidation
    $('#exampleAccountForm').formValidation({
      framework: 'bootstrap',
      fields: {
        username: {
          validators: {
            notEmpty: {
              message: 'The username is required'
            },
            stringLength: {
              min: 6,
              max: 30,
              message: 'The username must be more than 6 and less than 30 characters long'
            },
            regexp: {
              regexp: /^[a-zA-Z0-9_\.]+$/,
              message: 'The username can only consist of alphabetical, number, dot and underscore'
            }
          }
        },
        password: {
          validators: {
            notEmpty: {
              message: 'The password is required'
            },
            different: {
              field: 'username',
              message: 'The password cannot be the same as username'
            }
          }
        }
      }
    });

    $("#exampleBillingForm").formValidation({
      framework: 'bootstrap',
      fields: {
        number: {
          validators: {
            notEmpty: {
              message: 'The credit card number is required'
            }
            // creditCard: {
            //   message: 'The credit card number is not valid'
            // }
          }
        },
        cvv: {
          validators: {
            notEmpty: {
              message: 'The CVV number is required'
            }
            // cvv: {
            //   creditCardField: 'number',
            //   message: 'The CVV number is not valid'
            // }
          }
        }
      }
    });

    // init the wizard
    var defaults = $.components.getDefaults("wizard");
    var options = $.extend(true, {}, defaults, {
      buttonsAppendTo: '.panel-body'
    });

    var wizard = $("#exampleWizardForm").wizard(options).data('wizard');

    // setup validator
    // http://formvalidation.io/api/#is-valid
    wizard.get("#exampleAccount").setValidator(function() {
      var fv = $("#exampleAccountForm").data('formValidation');
      fv.validate();

      if (!fv.isValid()) {
        return false;
      }

      return true;
    });

    wizard.get("#exampleBilling").setValidator(function() {
      var fv = $("#exampleBillingForm").data('formValidation');
      fv.validate();

      if (!fv.isValid()) {
        return false;
      }

      return true;
    });
  })();


  // Example Wizard Form Container
  // -----------------------------
  // http://formvalidation.io/api/#is-valid-container
  (function() {
    var defaults = $.components.getDefaults("wizard");
    var options = $.extend(true, {}, defaults, {
      onInit: function() {
        $('#exampleFormContainer').formValidation({
          framework: 'bootstrap',
          fields: {
            username: {
              validators: {
                notEmpty: {
                  message: 'The username is required'
                }
              }
            },
            password: {
              validators: {
                notEmpty: {
                  message: 'The password is required'
                }
              }
            },
            number: {
              validators: {
                notEmpty: {
                  message: 'The credit card number is not valid'
                }
              }
            },
            cvv: {
              validators: {
                notEmpty: {
                  message: 'The CVV number is required'
                }
              }
            }
          }
        });
      },
      validator: function() {
        var fv = $('#exampleFormContainer').data('formValidation');

        var $this = $(this);

        // Validate the container
        fv.validateContainer($this);

        var isValidStep = fv.isValidContainer($this);
        if (isValidStep === false || isValidStep === null) {
          return false;
        }

        return true;
      },
      onFinish: function() {
        // $('#exampleFormContainer').submit();
      },
      buttonsAppendTo: '.panel-body'
    });

    $("#exampleWizardFormContainer").wizard(options);
  })();

  // Example Wizard Pager
  // --------------------------
  (function() {
    var defaults = $.components.getDefaults("wizard");

    var options = $.extend(true, {}, defaults, {
      step: '.wizard-pane',
      templates: {
        buttons: function() {
          var options = this.options;
          var html = '<div class="btn-group btn-group-sm btn-group-flat">' +
            '<a class="btn btn-default" href="#' + this.id + '" data-wizard="back" role="button">' + options.buttonLabels.back + '</a>' +
            '<a class="btn btn-success pull-right" href="#' + this.id + '" data-wizard="finish" role="button">' + options.buttonLabels.finish + '</a>' +
            '<a class="btn btn-default pull-right" href="#' + this.id + '" data-wizard="next" role="button">' + options.buttonLabels.next + '</a>' +
            '</div>';
          return html;
        }
      },
      buttonLabels: {
        next: '<i class="icon md-chevron-right" aria-hidden="true"></i>',
        back: '<i class="icon md-chevron-left" aria-hidden="true"></i>',
        finish: '<i class="icon md-check" aria-hidden="true"></i>'
      },

      buttonsAppendTo: '.panel-actions'
    });

    $("#exampleWizardPager").wizard(options);
  })();

  // Example Wizard Progressbar
  // --------------------------
  (function() {
    var defaults = $.components.getDefaults("wizard");

    var options = $.extend(true, {}, defaults, {
      step: '.wizard-pane',
      onInit: function() {
        this.$progressbar = this.$element.find('.progress-bar').addClass('progress-bar-striped');
      },
      onBeforeShow: function(step) {
        step.$element.tab('show');
      },
      onFinish: function() {
        this.$progressbar.removeClass('progress-bar-striped').addClass('progress-bar-success');
      },
      onAfterChange: function(prev, step) {
        var total = this.length();
        var current = step.index + 1;
        var percent = (current / total) * 100;

        this.$progressbar.css({
          width: percent + '%'
        }).find('.sr-only').text(current + '/' + total);
      },
      buttonsAppendTo: '.panel-body'
    });

    $("#exampleWizardProgressbar").wizard(options);
  })();

  // Example Wizard Tabs
  // -------------------
  (function() {
    var defaults = $.components.getDefaults("wizard");
    var options = $.extend(true, {}, defaults, {
      step: '> .nav > li > a',
      onBeforeShow: function(step) {
        step.$element.tab('show');
      },
      classes: {
        step: {
          //done: 'color-done',
          error: 'color-error'
        }
      },
      onFinish: function() {
        alert('finish');
      },
      buttonsAppendTo: '.tab-content'
    });

    $("#exampleWizardTabs").wizard(options);
  })();

  // Example Wizard Accordion
  // ------------------------
  (function() {
    var defaults = $.components.getDefaults("wizard");
    var options = $.extend(true, {}, defaults, {
      step: '.panel-title[data-toggle="collapse"]',
      classes: {
        step: {
          //done: 'color-done',
          error: 'color-error'
        }
      },
      templates: {
        buttons: function() {
          return '<div class="panel-footer">' + defaults.templates.buttons.call(this) + '</div>';
        }
      },
      onBeforeShow: function(step) {
        step.$pane.collapse('show');
      },

      onBeforeHide: function(step) {
        step.$pane.collapse('hide');
      },

      onFinish: function() {
        alert('finish');
      },

      buttonsAppendTo: '.panel-collapse'
    });

    $("#exampleWizardAccordion").wizard(options);
  })();

})(document, window, jQuery);
