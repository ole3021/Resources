(function(document, window, $) {
  'use strict';

  var Site = window.Site;


  $(document).ready(function($) {
    Site.run();
  });

  // Fixed Header Example
  // --------------------
  (function() {
    var offsetTop = 0;
    if ($('.site-navbar').length > 0) {
      offsetTop = $('.site-navbar').eq(0).innerHeight();
    }

    // initialize datatable
    var table = $('#exampleFixedHeader').DataTable({
      responsive: true,
      fixedHeader: {
        header: true,
        headerOffset: offsetTop
      },
      "bPaginate": false,
      "sDom": "t" // just show table, no other controls
    });



    // redraw fixedHeaders as necessary
    // $(window).resize(function() {
    //   fixedHeader._fnUpdateClones(true);
    //   fixedHeader._fnUpdatePositions();
    // });
  })();

  // Individual column searching
  // ---------------------------
  (function() {
    $(document).ready(function() {
      var defaults = $.components.getDefaults("dataTable");

      var options = $.extend(true, {}, defaults, {
        initComplete: function() {
          this.api().columns().every(function() {
            var column = this;
            var select = $('<select class="form-control width-full"><option value=""></option></select>')
              .appendTo($(column.footer()).empty())
              .on('change', function() {
                var val = $.fn.dataTable.util.escapeRegex(
                  $(this).val()
                );

                column
                  .search(val ? '^' + val + '$' : '', true, false)
                  .draw();
              });

            column.data().unique().sort().each(function(d, j) {
              select.append('<option value="' + d + '">' + d + '</option>')
            });
          });
        }
      });

      $('#exampleTableSearch').DataTable(options);
    });
  })();

  // Table Tools
  // -----------
  (function() {

    $(document).ready(function() {
      var defaults = $.components.getDefaults("dataTable");

      var options = $.extend(true, {}, defaults, {
        "aoColumnDefs": [{
          'bSortable': false,
          'aTargets': [-1]
        }],
        "iDisplayLength": 5,
        "aLengthMenu": [
          [5, 10, 25, 50, -1],
          [5, 10, 25, 50, "All"]
        ],
        "sDom": '<"dt-panelmenu clearfix"Tfr>t<"dt-panelfooter clearfix"ip>',
        "oTableTools": {
          "sSwfPath": "../../../global/vendor/datatables-tabletools/swf/copy_csv_xls_pdf.swf"
        }
      });

      $('#exampleTableTools').dataTable(options);
    });
  })();

  // Table Add Row
  // -------------
  (function($) {
    var EditableTable = {

      options: {
        addButton: '#addToTable',
        table: '#exampleAddRow',
        dialog: {
          wrapper: '#dialog',
          cancelButton: '#dialogCancel',
          confirmButton: '#dialogConfirm',
        }
      },

      initialize: function() {
        this
          .setVars()
          .build()
          .events();
      },

      setVars: function() {
        this.$table = $(this.options.table);
        this.$addButton = $(this.options.addButton);

        // dialog
        this.dialog = {};
        this.dialog.$wrapper = $(this.options.dialog.wrapper);
        this.dialog.$cancel = $(this.options.dialog.cancelButton);
        this.dialog.$confirm = $(this.options.dialog.confirmButton);

        return this;
      },

      build: function() {
        this.datatable = this.$table.DataTable({
          aoColumns: [
            null,
            null,
            null, {
              "bSortable": false
            }
          ],
          language: {
            "sSearchPlaceholder": "Search..",
            "lengthMenu": "_MENU_",
            "search": "_INPUT_"
          }
        });

        window.dt = this.datatable;

        return this;
      },

      events: function() {
        var _self = this;

        this.$table
          .on('click', 'a.save-row', function(e) {
            e.preventDefault();

            _self.rowSave($(this).closest('tr'));
          })
          .on('click', 'a.cancel-row', function(e) {
            e.preventDefault();

            _self.rowCancel($(this).closest('tr'));
          })
          .on('click', 'a.edit-row', function(e) {
            e.preventDefault();

            _self.rowEdit($(this).closest('tr'));
          })
          .on('click', 'a.remove-row', function(e) {
            e.preventDefault();

            var $row = $(this).closest('tr');
            bootbox.dialog({
              message: "Are you sure that you want to delete this row?",
              title: "ARE YOU SURE?",
              buttons: {
                danger: {
                  label: "Confirm",
                  className: "btn-danger",
                  callback: function() {
                    _self.rowRemove($row);
                  }
                },
                main: {
                  label: "Cancel",
                  className: "btn-primary",
                  callback: function() {}
                }
              }
            });
          });

        this.$addButton.on('click', function(e) {
          e.preventDefault();

          _self.rowAdd();
        });

        this.dialog.$cancel.on('click', function(e) {
          e.preventDefault();
          $.magnificPopup.close();
        });

        return this;
      },


      // =============
      // ROW FUNCTIONS
      // =============
      rowAdd: function() {
        this.$addButton.attr({
          'disabled': 'disabled'
        });

        var actions,
          data,
          $row;

        actions = [
          '<a href="#" class="btn btn-sm btn-icon btn-pure btn-default hidden on-editing save-row" data-toggle="tooltip" data-original-title="Save"><i class="icon wb-wrench" aria-hidden="true"></i></a>',
          '<a href="#" class="btn btn-sm btn-icon btn-pure btn-default hidden on-editing cancel-row" data-toggle="tooltip" data-original-title="Delete"><i class="icon wb-close" aria-hidden="true"></i></a>',
          '<a href="#" class="btn btn-sm btn-icon btn-pure btn-default on-default edit-row" data-toggle="tooltip" data-original-title="Edit"><i class="icon wb-edit" aria-hidden="true"></i></a>',
          '<a href="#" class="btn btn-sm btn-icon btn-pure btn-default on-default remove-row" data-toggle="tooltip" data-original-title="Remove"><i class="icon wb-trash" aria-hidden="true"></i></a>'
        ].join(' ');

        data = this.datatable.row.add(['', '', '', actions]);
        $row = this.datatable.row(data[0]).nodes().to$();

        $row
          .addClass('adding')
          .find('td:last')
          .addClass('actions');

        this.rowEdit($row);

        this.datatable.order([0, 'asc']).draw(); // always show fields
      },

      rowCancel: function($row) {
        var _self = this,
          $actions,
          i,
          data;

        if ($row.hasClass('adding')) {
          this.rowRemove($row);
        } else {

          data = this.datatable.row($row.get(0)).data();
          this.datatable.row($row.get(0)).data(data);

          $actions = $row.find('td.actions');
          if ($actions.get(0)) {
            this.rowSetActionsDefault($row);
          }

          this.datatable.draw();
        }
      },

      rowEdit: function($row) {
        var _self = this,
          data;

        data = this.datatable.row($row.get(0)).data();

        $row.children('td').each(function(i) {
          var $this = $(this);

          if ($this.hasClass('actions')) {
            _self.rowSetActionsEditing($row);
          } else {
            $this.html('<input type="text" class="form-control input-block" value="' + data[i] + '"/>');
          }
        });
      },

      rowSave: function($row) {
        var _self = this,
          $actions,
          values = [];

        if ($row.hasClass('adding')) {
          this.$addButton.removeAttr('disabled');
          $row.removeClass('adding');
        }

        values = $row.find('td').map(function() {
          var $this = $(this);

          if ($this.hasClass('actions')) {
            _self.rowSetActionsDefault($row);
            return _self.datatable.cell(this).data();
          } else {
            return $.trim($this.find('input').val());
          }
        });

        this.datatable.row($row.get(0)).data(values);

        $actions = $row.find('td.actions');
        if ($actions.get(0)) {
          this.rowSetActionsDefault($row);
        }

        this.datatable.draw();
      },

      rowRemove: function($row) {
        if ($row.hasClass('adding')) {
          this.$addButton.removeAttr('disabled');
        }

        this.datatable.row($row.get(0)).remove().draw();
      },

      rowSetActionsEditing: function($row) {
        $row.find('.on-editing').removeClass('hidden');
        $row.find('.on-default').addClass('hidden');
      },

      rowSetActionsDefault: function($row) {
        $row.find('.on-editing').addClass('hidden');
        $row.find('.on-default').removeClass('hidden');
      }

    };

    $(function() {
      EditableTable.initialize();
    });

  }).apply(this, [jQuery]);


})(document, window, jQuery);
