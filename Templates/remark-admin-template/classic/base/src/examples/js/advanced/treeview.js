(function(document, window, $) {
  'use strict';

  var Site = window.Site;

  $(document).ready(function($) {
    Site.run();
  });


  window.getExampleTreeview = function() {
    return [{
      text: 'Parent 1',
      href: '#parent1',
      tags: ['4'],
      nodes: [{
        text: 'Child 1',
        href: '#child1',
        tags: ['2'],
        nodes: [{
          text: 'Grandchild 1',
          href: '#grandchild1',
          tags: ['0']
        }, {
          text: 'Grandchild 2',
          href: '#grandchild2',
          tags: ['0']
        }]
      }, {
        text: 'Child 2',
        href: '#child2',
        tags: ['0']
      }]
    }, {
      text: 'Parent 2',
      href: '#parent2',
      tags: ['0']
    }, {
      text: 'Parent 3',
      href: '#parent3',
      tags: ['0']
    }, {
      text: 'Parent 4',
      href: '#parent4',
      tags: ['0']
    }, {
      text: 'Parent 5',
      href: '#parent5',
      tags: ['0']
    }];
  };

  var defaults = $.components.getDefaults("treeview");

  // Example TreeView Json Data
  // --------------------------
  (function() {
    var json = '[' +
      '{' +
      '"text": "Parent 1",' +
      '"nodes": [' +
      '{' +
      '"text": "Child 1",' +
      '"nodes": [' +
      '{' +
      '"text": "Grandchild 1"' +
      '},' +
      '{' +
      '"text": "Grandchild 2"' +
      '}' +
      ']' +
      '},' +
      '{' +
      '"text": "Child 2"' +
      '}' +
      ']' +
      '},' +
      '{' +
      '"text": "Parent 2"' +
      '},' +
      '{' +
      '"text": "Parent 3"' +
      '},' +
      '{' +
      '"text": "Parent 4"' +
      '},' +
      '{' +
      '"text": "Parent 5"' +
      '}' +
      ']';

    var json_options = $.extend({}, defaults, {
      data: json
    });

    $('#exampleJsonData').treeview(json_options);
  })();

  // Example TreeView Searchable
  // ---------------------------
  (function() {
    var options = $.extend({}, defaults, {
      data: getExampleTreeview()
    });

    var $searchableTree = $('#exampleSearchableTree').treeview(options);

    $('#inputSearchable').on('keyup', function(e) {
      var pattern = $(e.target).val();

      var results = $searchableTree.treeview('search', [pattern, {
        'ignoreCase': true,
        'exactMatch': false
      }]);
    });
  })();


  // Example TreeView Expandible
  // ---------------------------
  (function() {
    var options = $.extend({}, defaults, {
      data: getExampleTreeview()
    });

    // Expandible
    var $expandibleTree = $('#exampleExpandibleTree').treeview(options);

    // Expand/collapse all
    $('#exampleExpandAll').on('click', function(e) {
      $expandibleTree.treeview('expandAll', {
        levels: '99'
      });
    });

    $('#exampleCollapseAll').on('click', function(e) {
      $expandibleTree.treeview('collapseAll');
    });
  })();

  // Example TreeView Events
  // -----------------------
  (function() {
    // Events
    var events_toastr = function(msg) {
      toastr.info(msg, '', {
        iconClass: 'toast-just-text toast-info',
        positionClass: 'toast-bottom-right',
        containertId: 'toast-bottom-right'
      });
    };

    var options = $.extend({}, defaults, {
      data: getExampleTreeview(),
      onNodeCollapsed: function(event, node) {
        events_toastr(node.text + ' was collapsed');
      },
      onNodeExpanded: function(event, node) {
        events_toastr(node.text + ' was expanded');
      },
      onNodeSelected: function(event, node) {
        events_toastr(node.text + ' was selected');
      },
      onNodeUnselected: function(event, node) {
        events_toastr(node.text + ' was unselected');
      }
    });

    $('#exampleEvents').treeview(options);
  })();
})(document, window, jQuery);
