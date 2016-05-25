(function(document, window, $) {
  'use strict';

  var Site = window.Site;

  $(document).ready(function($) {
    Site.run();
  });

  // Example Row Toggler
  // -------------------
  (function() {
    $('#exampleRowToggler').footable();
  })();

  // Expand / Collapse All Rows
  // --------------------------
  (function() {
    var fooColExp = $('#exampleAccordion');
    fooColExp.footable().trigger('footable_expand_first_row');


    $('#exampleCollapseBtn').on('click', function() {
      fooColExp.trigger('footable_collapse_all');
    });
    $('#exampleExpandBtn').on('click', function() {
      fooColExp.trigger('footable_expand_all');
    })
  })();

  // Accordion
  // ---------
  (function() {
    $('#exampleFooAccordion').footable().on('footable_row_expanded', function(e) {
      $('#exampleFooAccordion tbody tr.footable-detail-show').not(e.row).each(function() {
        $('#exampleFooAccordion').data('footable').toggleDetail(this);
      });
    });
  })();

  // Pagination
  // ----------
  (function() {
    $('#examplePagination').footable();
    $('#exampleShow').change(function(e) {
      e.preventDefault();
      var pagesize = $(this).find('option:selected').val();
      $('#examplePagination').data('page-size', pagesize);
      $('#examplePagination').trigger('footable_initialized');
    });
  })();

  // Filtering
  // ---------
  (function() {
    var filtering = $('#exampleFootableFiltering');
    filtering.footable().on('footable_filtering', function(e) {
      var selected = $('#filteringStatus').find(':selected').val();
      e.filter += (e.filter && e.filter.length > 0) ? ' ' + selected : selected;
      e.clear = !e.filter;
    });

    // Filter status
    $('#filteringStatus').change(function(e) {
      e.preventDefault();
      filtering.trigger('footable_filter', {
        filter: $(this).val()
      });
    });

    // Search input
    $('#filteringSearch').on('input', function(e) {
      e.preventDefault();
      filtering.trigger('footable_filter', {
        filter: $(this).val()
      });
    });
  })();

  // Add & Remove Row
  // ----------------
  (function() {
    var addrow = $('#exampleFooAddRemove');
    addrow.footable().on('click', '.delete-row-btn', function() {

      //get the footable object
      var footable = addrow.data('footable');

      //get the row we are wanting to delete
      var row = $(this).parents('tr:first');

      //delete the row
      footable.removeRow(row);
    });

    // Search input
    $('#addRemoveSearch').on('input', function(e) {
      e.preventDefault();

      addrow.trigger('footable_filter', {
        filter: $(this).val()
      });
    });

    // Add Row Button
    $('#addRowBtn').click(function() {

      //get the footable object
      var footable = addrow.data('footable');

      //build up the row we are wanting to add
      var newRow = '<tr><td>Adam</td><td>Doe</td><td>Traffic Court Referee</td><td>22 Jun 1972</td><td><span class="label label-table label-success">Active</span></td><td><button type="button" class="btn btn-sm btn-icon btn-pure btn-default delete-row-btn" data-toggle="tooltip" data-original-title="Delete"><i class="icon md-close" aria-hidden="true"></i></button></td></tr>';

      //add it
      footable.appendRow(newRow);
    });
  })();

})(document, window, jQuery);
