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

  // Example Reset Current
  // ---------------------
  (function() {
    // Reset Current
    $('#exampleTimeButton').on('click', function() {
      $('#inputTextCurrent').timepicker('setTime', new Date());
    });
  })();

  // Example inline datepicker
  // ---------------------
  (function() {
    // Reset Current
    $('#inlineDatepicker').datepicker();
    $("#inlineDatepicker").on("changeDate", function(event) {
      $("#inputHiddenInline").val(
        $("#inlineDatepicker").datepicker('getFormattedDate')
      );
    });
  })();

  // Example Tokenfield With Typeahead
  // ---------------------------------
  (function() {
    var engine = new Bloodhound({
      local: [{
        value: 'red'
      }, {
        value: 'blue'
      }, {
        value: 'green'
      }, {
        value: 'yellow'
      }, {
        value: 'violet'
      }, {
        value: 'brown'
      }, {
        value: 'purple'
      }, {
        value: 'black'
      }, {
        value: 'white'
      }],
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
      queryTokenizer: Bloodhound.tokenizers.whitespace
    });

    // engine.initialize();

    $('#inputTokenfieldTypeahead').tokenfield({
      typeahead: [null, {
        name: 'engine',
        displayKey: 'value',
        source: engine.ttAdapter()
      }]
    });
  })();


  // Example Tokenfield Events
  // -------------------------
  (function() {
    $('#inputTokenfieldEvents')
      .on('tokenfield:createtoken', function(e) {
        var data = e.attrs.value.split('|');
        e.attrs.value = data[1] || data[0];
        e.attrs.label = data[1] ? data[0] + ' (' + data[1] + ')' : data[0];
      })
      .on('tokenfield:createdtoken', function(e) {
        // Über-simplistic e-mail validation
        var re = /\S+@\S+\.\S+/;
        var valid = re.test(e.attrs.value);
        if (!valid) {
          $(e.relatedTarget).addClass('invalid');
        }
      })
      .on('tokenfield:edittoken', function(e) {
        if (e.attrs.label !== e.attrs.value) {
          var label = e.attrs.label.split(' (');
          e.attrs.value = label[0] + '|' + e.attrs.value;
        }
      })
      .on('tokenfield:removedtoken', function(e) {
        if (e.attrs.length > 1) {
          var values = $.map(e.attrs, function(attrs) {
            return attrs.value;
          });
          alert(e.attrs.length + ' tokens removed! Token values were: ' + values.join(', '));
        } else {
          alert('Token removed! Token value was: ' + e.attrs.value);
        }
      })
      .tokenfield();
  })();


  // Example Tags Input Objects as tags
  // ----------------------------------
  (function() {
    var cities = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('text'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      prefetch: '../../assets/data/cities.json'
    });
    cities.initialize();

    var options = $.extend(true, {}, $.components.getDefaults("tagsinput"), {
      itemValue: 'value',
      itemText: 'text',
      typeaheadjs: [{
        hint: true,
        highlight: true,
        minLength: 1
      }, {
        name: 'cities',
        displayKey: 'text',
        source: cities.ttAdapter()
      }]
    });

    var $input = $('#inputTagsObject');
    $input.tagsinput(options);

    $input.tagsinput('add', {
      "value": 1,
      "text": "Amsterdam",
      "continent": "Europe"
    });
    $input.tagsinput('add', {
      "value": 4,
      "text": "Washington",
      "continent": "America"
    });
    $input.tagsinput('add', {
      "value": 7,
      "text": "Sydney",
      "continent": "Australia"
    });
    $input.tagsinput('add', {
      "value": 10,
      "text": "Beijing",
      "continent": "Asia"
    });
    $input.tagsinput('add', {
      "value": 13,
      "text": "Cairo",
      "continent": "Africa"
    });
  })();

  // Example Tags Input Categorizing
  // -------------------------------
  (function() {
    var cities = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('text'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      prefetch: '../../assets/data/cities.json'
    });
    cities.initialize();

    var options = $.extend(true, {}, $.components.getDefaults("tagsinput"), {
      tagClass: function(item) {
        switch (item.continent) {
          case 'Europe':
            return 'label label-primary';
          case 'America':
            return 'label label-danger';
          case 'Australia':
            return 'label label-success';
          case 'Africa':
            return 'label label-default';
          case 'Asia':
            return 'label label-warning';
        }
      },
      itemValue: 'value',
      itemText: 'text',
      typeaheadjs: [{
        hint: true,
        highlight: true,
        minLength: 1
      }, {
        name: 'cities',
        displayKey: 'text',
        source: cities.ttAdapter()
      }]
    });
    var $input = $('#inputTagsCategorizing');

    $input.tagsinput(options);

    $input.tagsinput('add', {
      "value": 1,
      "text": "Amsterdam",
      "continent": "Europe"
    });
    $input.tagsinput('add', {
      "value": 4,
      "text": "Washington",
      "continent": "America"
    });
    $input.tagsinput('add', {
      "value": 7,
      "text": "Sydney",
      "continent": "Australia"
    });
    $input.tagsinput('add', {
      "value": 10,
      "text": "Beijing",
      "continent": "Asia"
    });
    $input.tagsinput('add', {
      "value": 13,
      "text": "Cairo",
      "continent": "Africa"
    });

  })();


  // Example AsSpinner
  // -----------------
  (function() {
    // Custom Format
    var options = $.extend({}, $.components.getDefaults("asSpinner"), {
      format: function(value) {
        return value + '%';
      }
    });

    $('#inputSpinnerCustomFormat').asSpinner(options);
  })();


  // Example Multi-Select
  // --------------------
  (function() {
    // for multi-select public methods example
    $('.multi-select-methods').multiSelect();
    $('#buttonSelectAll').click(function() {
      $('.multi-select-methods').multiSelect('select_all');
      return false;
    });
    $('#buttonDeselectAll').click(function() {
      $('.multi-select-methods').multiSelect('deselect_all');
      return false;
    });
    $('#buttonSelectSome').click(function() {
      $('.multi-select-methods').multiSelect('select', ['Idaho', 'Montana', 'Arkansas']);
      return false;
    });
    $('#buttonDeselectSome').click(function() {
      $('.multi-select-methods').multiSelect('select', ['Idaho', 'Montana', 'Arkansas']);
      return false;
    });
    $('#buttonRefresh').on('click', function() {
      $('.multi-select-methods').multiSelect('refresh');
      return false;
    });
    $('#buttonAdd').on('click', function() {
      $('.multi-select-methods').multiSelect('addOption', {
        value: 42,
        text: 'test 42',
        index: 0
      });
      return false;
    });
  })();


  // Example Typeahead
  // -----------------
  (function() {
    var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
      'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
      'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
      'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
      'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
      'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
      'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
      'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
      'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ];

    // basic & Styled
    // --------------
    (function() {
      var substringMatcher = function(strs) {
        return function findMatches(q, cb) {
          var matches, substrRegex;

          // an array that will be populated with substring matches
          matches = [];

          // regex used to determine if a string contains the substring `q`
          substrRegex = new RegExp(q, 'i');

          // iterate through the pool of strings and for any string that
          // contains the substring `q`, add it to the `matches` array
          $.each(strs, function(i, str) {
            if (substrRegex.test(str)) {
              matches.push(str);
            }
          });

          cb(matches);
        };
      };

      $('#exampleTypeaheadBasic, #exampleTypeaheadStyle').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
      }, {
        name: 'states',
        source: substringMatcher(states)
      });
    })();

    // bloodhound
    // ----------
    (function() {
      var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
        'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
        'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
        'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
        'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
        'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
        'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
        'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
        'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
      ];
      // constructs the suggestion engine
      var state = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        // `states` is an array of state names defined in "The Basics"
        local: states
      });

      $('#exampleTypeaheadBloodhound').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
      }, {
        name: 'states',
        source: state
      });
    })();

    // Prefetch typeahead
    // ----------------
    (function() {
      var countries = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        // url points to a json file that contains an array of country names, see
        // https://github.com/twitter/typeahead.js/blob/gh-pages/data/countries.json
        prefetch: '../../assets/data/countries.json'
      });

      // passing in `null` for the `options` arguments will result in the default
      // options being used
      $('#exampleTypeaheadPrefetch').typeahead(null, {
        name: 'countries',
        source: countries
      });
    })();


  })();
})(document, window, jQuery);
