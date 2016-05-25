(function(document, window, $) {
  'use strict';

  var Site = window.Site;


  $(document).ready(function($) {
    Site.run();
    //enable / disable
    $('#editableEnable').click(function() {
      $('#editableUser .editable').editable('toggleDisabled');
    });


    var init_x_editable = function() {

      $.fn.editableform.buttons =
        '<button type="submit" class="btn btn-primary btn-sm editable-submit">' +
        '<i class="icon md-check" aria-hidden="true"></i>' +
        '</button>' +
        '<button type="button" class="btn btn-default btn-sm editable-cancel">' +
        '<i class="icon md-close" aria-hidden="true"></i>' +
        '</button>';

      $.fn.editabletypes.datefield.defaults.inputclass = "form-control input-sm";

      //defaults
      $.fn.editable.defaults.url = '/post';

      //editables
      $('#editableSuperuser').editable({
        url: '/post',
        type: 'text',
        pk: 1,
        name: 'username',
        title: 'Enter username'
      });

      $('#editableFirstname').editable({
        validate: function(value) {
          if ($.trim(value) === '') return 'This field is required';
        }
      });

      $('#editableSex').editable({
        prepend: "not selected",
        source: [{
          value: 1,
          text: 'Male'
        }, {
          value: 2,
          text: 'Female'
        }],
        display: function(value, sourceData) {
          var colors = {
              "": "gray",
              1: "green",
              2: "blue"
            },
            elem = $.grep(sourceData, function(o) {
              return o.value === value;
            });

          if (elem.length) {
            $(this).text(elem[0].text).css("color", colors[value]);
          } else {
            $(this).empty();
          }
        }
      });


      $('#editableVacation').editable({
        datepicker: {
          todayBtn: 'linked'
        }
      });

      $('#editableDob').editable();

      $('#editableEvent').editable({
        placement: 'right',
        combodate: {
          firstItem: 'name'
        }
      });

      $('#editableMeetingStart').editable({
        format: 'yyyy-mm-dd hh:ii',
        viewformat: 'dd/mm/yyyy hh:ii',
        validate: function(v) {
          if (v && v.getDate() === 10) return 'Day cant be 10!';
        },
        datetimepicker: {
          todayBtn: 'linked',
          weekStart: 1
        }
      });

      $('#editableComments').editable({
        showbuttons: 'bottom'
      });

      $('#editableNote').editable();
      $('#editablePencil').click(function(e) {
        e.stopPropagation();
        e.preventDefault();
        $('#editableNote').editable('toggle');
      });

      $('#editableState').editable({
        source: ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Dakota", "North Carolina", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]
      });

      var editableStates = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Dakota", "North Carolina", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"],
        states = new Bloodhound({
          datumTokenizer: Bloodhound.tokenizers.whitespace,
          queryTokenizer: Bloodhound.tokenizers.whitespace,
          local: editableStates
        });

      $('#editableState2').editable({
        value: 'California',
        typeahead: {
          name: 'states',
          source: states
        }
      });

      $('#editableFruits').editable({
        pk: 1,
        limit: 3,
        source: [{
          value: 1,
          text: 'banana'
        }, {
          value: 2,
          text: 'peach'
        }, {
          value: 3,
          text: 'apple'
        }, {
          value: 4,
          text: 'watermelon'
        }, {
          value: 5,
          text: 'orange'
        }]
      });


      $('#editableAddress').editable({
        url: '/post',
        value: {
          city: "Moscow",
          street: "Lenina",
          building: "12"
        },
        validate: function(value) {
          if (value.city === '') return 'city is required!';
        },
        display: function(value) {
          if (!value) {
            $(this).empty();
            return;
          }
          var html = '<b>' + $('<div>').text(value.city).html() + '</b>, ' + $('<div>').text(value.street).html() + ' st., bld. ' + $('<div>').text(value.building).html();
          $(this).html(html);
        }
      });

      // $("#editableUser").find(".form-control").addClass(".input-sm");
    };

    var destory_x_editable = function() {
      $('#editableSuperuser').editable('destroy');
      $('#editableFirstname').editable('destroy');
      $('#editableSex').editable('destroy');
      // $('#editableStatus').editable('destroy');
      $('#editableVacation').editable('destroy');
      $('#editableDob').editable('destroy');
      $('#editableEvent').editable('destroy');
      $('#editableMeetingStart').editable('destroy');
      $('#editableComments').editable('destroy');
      $('#editableNote').editable('destroy');
      $('#editablePencil').editable('destroy');
      $('#editableState').editable('destroy');
      $('#editableState2').editable('destroy');
      $('#editableFruits').editable('destroy');
      $('#editableAddress').editable('destroy');
    };

    $.fn.editable.defaults.mode = 'inline';
    init_x_editable();

    // $('#editableControls').on("click", "label", function() {
    //   xMode = $(this).find("input").val();
    //   $.fn.editable.defaults.mode = xMode;
    //   destory_x_editable();
    //   init_x_editable();
    // });
  });
})(document, window, jQuery);
