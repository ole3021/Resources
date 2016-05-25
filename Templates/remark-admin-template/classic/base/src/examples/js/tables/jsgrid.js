(function(document, window, $) {
  'use strict';

  var Site = window.Site;

  $(document).ready(function($) {
    Site.run();
  });


  jsGrid.setDefaults({
    tableClass: "jsgrid-table table table-striped table-hover"
  });

  jsGrid.setDefaults("text", {
    _createTextBox: function() {
      return $("<input>").attr("type", "text").attr("class", "form-control input-sm");
    }
  });

  jsGrid.setDefaults("number", {
    _createTextBox: function() {
      return $("<input>").attr("type", "number").attr("class", "form-control input-sm");
    }
  });

  jsGrid.setDefaults("textarea", {
    _createTextBox: function() {
      return $("<input>").attr("type", "textarea").attr("class", "form-control");
    }
  });

  jsGrid.setDefaults("control", {
    _createGridButton: function(cls, tooltip, clickHandler) {
      var grid = this._grid;

      return $("<button>").addClass(this.buttonClass)
        .addClass(cls)
        .attr({
          type: "button",
          title: tooltip
        })
        .on("click", function(e) {
          clickHandler(grid, e);
        });
    }
  });

  jsGrid.setDefaults("select", {
    _createSelect: function() {
      var $result = $("<select>").attr("class", "form-control input-sm"),
        valueField = this.valueField,
        textField = this.textField,
        selectedIndex = this.selectedIndex;

      $.each(this.items, function(index, item) {
        var value = valueField ? item[valueField] : index,
          text = textField ? item[textField] : item;

        var $option = $("<option>")
          .attr("value", value)
          .text(text)
          .appendTo($result);

        $option.prop("selected", (selectedIndex === index));
      });

      return $result;
    }
  });

  // Example Basic
  // -------------------
  (function() {
    $('#exampleBasic').jsGrid({
      height: "500px",
      width: "100%",

      filtering: true,
      editing: true,
      sorting: true,
      paging: true,
      autoload: true,

      pageSize: 15,
      pageButtonCount: 5,

      deleteConfirm: "Do you really want to delete the client?",

      controller: db,

      fields: [{
        name: "Name",
        type: "text",
        width: 150
      }, {
        name: "Age",
        type: "number",
        width: 50
      }, {
        name: "Address",
        type: "text",
        width: 200
      }, {
        name: "Country",
        type: "select",
        items: db.countries,
        valueField: "Id",
        textField: "Name"
      }, {
        name: "Married",
        type: "checkbox",
        title: "Is Married",
        sorting: false
      }, {
        type: "control"
      }]
    });
  })();


  // Example Static Data
  // ----------------------------
  (function() {
    $('#exampleStaticData').jsGrid({
      height: "500px",
      width: "100%",

      sorting: true,
      paging: true,

      data: db.clients,

      fields: [{
        name: "Name",
        type: "text",
        width: 150
      }, {
        name: "Age",
        type: "number",
        width: 50
      }, {
        name: "Address",
        type: "text",
        width: 200
      }, {
        name: "Country",
        type: "select",
        items: db.countries,
        valueField: "Id",
        textField: "Name"
      }, {
        name: "Married",
        type: "checkbox",
        title: "Is Married"
      }]
    });
  })();

  // Example OData Service
  // -------------------
  (function() {
    $('#exampleOData').jsGrid({
      height: "500px",
      width: "100%",

      sorting: true,
      paging: false,
      autoload: true,

      controller: {
        loadData: function() {
          var d = $.Deferred();

          $.ajax({
            url: "http://services.odata.org/V3/(S(3mnweai3qldmghnzfshavfok))/OData/OData.svc/Products",
            dataType: "json"
          }).done(function(response) {
            d.resolve(response.value);
          });

          return d.promise();
        }
      },

      fields: [{
        name: "Name",
        type: "text"
      }, {
        name: "Description",
        type: "textarea",
        width: 150
      }, {
        name: "Rating",
        type: "number",
        width: 50,
        align: "center",
        itemTemplate: function(value) {
          return $("<div>").addClass("rating text-nowrap").append(Array(value + 1).join('<i class="icon wb-star orange-600 margin-right-3"></i>'));
        }
      }, {
        name: "Price",
        type: "number",
        width: 50,
        itemTemplate: function(value) {
          return value.toFixed(2) + "$";
        }
      }]
    });
  })();

  // Example Sorting
  // ---------------
  (function() {
    $('#exampleSorting').jsGrid({
      height: "500px",
      width: "100%",

      autoload: true,
      selecting: false,

      controller: db,

      fields: [{
        name: "Name",
        type: "text",
        width: 150
      }, {
        name: "Age",
        type: "number",
        width: 50
      }, {
        name: "Address",
        type: "text",
        width: 200
      }, {
        name: "Country",
        type: "select",
        items: db.countries,
        valueField: "Id",
        textField: "Name"
      }, {
        name: "Married",
        type: "checkbox",
        title: "Is Married"
      }]
    });

    $("#sortingField").on('change', function() {
      var field = $(this).val();
      $("#exampleSorting").jsGrid("sort", field);
    });
  })();

  // Example Loading Data by Page
  // ----------------------------
  (function() {
    $('#exampleLoadingByPage').jsGrid({
      height: "500px",
      width: "100%",

      autoload: true,
      paging: true,
      pageLoading: true,
      pageSize: 15,
      pageIndex: 2,

      controller: {
        loadData: function(filter) {
          var startIndex = (filter.pageIndex - 1) * filter.pageSize;
          return {
            data: db.clients.slice(startIndex, startIndex + filter.pageSize),
            itemsCount: db.clients.length
          };
        }
      },

      fields: [{
        name: "Name",
        type: "text",
        width: 150
      }, {
        name: "Age",
        type: "number",
        width: 50
      }, {
        name: "Address",
        type: "text",
        width: 200
      }, {
        name: "Country",
        type: "select",
        items: db.countries,
        valueField: "Id",
        textField: "Name"
      }, {
        name: "Married",
        type: "checkbox",
        title: "Is Married"
      }]
    });


    $("#pager").on("change", function() {
      var page = parseInt($(this).val(), 10);
      $("#exampleLoadingByPage").jsGrid("openPage", page);
    });
  })();

  // Example Custom View
  // -------------------
  (function() {
    $('#exampleCustomView').jsGrid({
      height: "500px",
      width: "100%",

      filtering: true,
      editing: true,
      sorting: true,
      paging: true,
      autoload: true,

      pageSize: 15,
      pageButtonCount: 5,

      controller: db,

      fields: [{
        name: "Name",
        type: "text",
        width: 150
      }, {
        name: "Age",
        type: "number",
        width: 50
      }, {
        name: "Address",
        type: "text",
        width: 200
      }, {
        name: "Country",
        type: "select",
        items: db.countries,
        valueField: "Id",
        textField: "Name"
      }, {
        name: "Married",
        type: "checkbox",
        title: "Is Married",
        sorting: false
      }, {
        type: "control",
        modeSwitchButton: false,
        editButton: false
      }]
    });

    $(".views").on("change", function() {
      var $cb = $(this);
      $("#exampleCustomView").jsGrid("option", $cb.attr("value"), $cb.is(":checked"));
    });
  })();


  // Example Custom Row Renderer
  // ---------------------------
  (function() {
    $('#exampleCustomRowRenderer').jsGrid({
      height: "500px",
      width: "100%",

      autoload: true,
      paging: true,

      controller: {
        loadData: function() {
          var deferred = $.Deferred();

          $.ajax({
            url: 'http://api.randomuser.me/?results=40',
            dataType: 'json',
            success: function(data) {
              deferred.resolve(data.results);
            }
          });

          return deferred.promise();
        }
      },

      rowRenderer: function(item) {
        var user = item.user;
        var $photo = $("<div>").addClass("media-left").append(
          $('<a>').addClass('avatar avatar-lg').attr('href', 'javascript:void(0)').append(
            $("<img>").attr("src", user.picture.medium)
          )
        );
        var $info = $("<div>").addClass("media-body")
          .append($("<p>").append($("<strong>").text(user.name.first.capitalize() + " " + user.name.last.capitalize())))
          .append($("<p>").text("Location: " + user.location.city.capitalize() + ", " + user.location.street))
          .append($("<p>").text("Email: " + user.email))
          .append($("<p>").text("Phone: " + user.phone))
          .append($("<p>").text("Cell: " + user.cell));

        return $("<tr>").append(
          $('<td>').append(
            $('<div class="media">').append($photo).append($info)
          )
        );
      },

      fields: [{
        title: "Clients"
      }]
    });

    String.prototype.capitalize = function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    };
  })();

  // Example Batch Delete
  // --------------------
  (function() {
    $('#exampleBatchDelete').jsGrid({
      height: "500px",
      width: "100%",

      autoload: true,
      confirmDeleting: false,
      paging: true,
      controller: {
        loadData: function() {
          return db.clients;
        }
      },
      fields: [{
        headerTemplate: function() {
          return $("<button>").attr("type", "button").attr("class", "btn btn-primary btn-xs").text("Delete")
            .on("click", function() {
              deleteSelectedItems();
            });
        },
        itemTemplate: function(_, item) {
          return $("<input>").attr("type", "checkbox")
            .on("change", function() {
              $(this).is(":checked") ? selectItem(item) : unselectItem(item);
            });
        },
        align: "center",
        width: 50
      }, {
        name: "Name",
        type: "text",
        width: 150
      }, {
        name: "Age",
        type: "number",
        width: 50
      }, {
        name: "Address",
        type: "text",
        width: 200
      }]
    });

    var selectedItems = [];

    var selectItem = function(item) {
      selectedItems.push(item);
    };

    var unselectItem = function(item) {
      selectedItems = $.grep(selectedItems, function(i) {
        return i !== item;
      });
    };

    var deleteSelectedItems = function() {
      if (!selectedItems.length || !confirm("Are you sure?"))
        return;

      var $grid = $("#exampleBatchDelete");

      $.each(selectedItems, function(_, item) {
        $grid.jsGrid("deleteItem", item);
      });

      selectedItems = [];
    };
  })();

  // Example Rows Reordering
  // -----------------------
  (function() {
    $('#exampleRowsReordering').jsGrid({
      height: "500px",
      width: "100%",

      autoload: true,

      rowClass: function(item, itemIndex) {
        return "client-" + itemIndex;
      },

      controller: {
        loadData: function() {
          return db.clients.slice(0, 15);
        }
      },

      fields: [{
        name: "Name",
        type: "text",
        width: 150
      }, {
        name: "Age",
        type: "number",
        width: 50
      }, {
        name: "Address",
        type: "text",
        width: 200
      }, {
        name: "Country",
        type: "select",
        items: db.countries,
        valueField: "Id",
        textField: "Name"
      }, {
        name: "Married",
        type: "checkbox",
        title: "Is Married",
        sorting: false
      }]
    });

    var $gridData = $("#exampleRowsReordering .jsgrid-grid-body tbody");

    $gridData.sortable({
      update: function(e, ui) {
        // array of indexes
        var clientIndexRegExp = /\s+client-(\d+)\s+/;
        var indexes = $.map($gridData.sortable("toArray", {
          attribute: "class"
        }), function(classes) {
          return clientIndexRegExp.exec(classes)[1];
        });
        alert("Reordered indexes: " + indexes.join(", "));

        // arrays of items
        var items = $.map($gridData.find("tr"), function(row) {
          return $(row).data("JSGridItem");
        });
        console && console.log("Reordered items", items);
      }
    });
  })();


  // Example Custom Grid Field
  // -------------------------
  (function() {
    var MyDateField = function(config) {
      jsGrid.Field.call(this, config);
    };

    MyDateField.prototype = new jsGrid.Field({
      sorter: function(date1, date2) {
        return new Date(date1) - new Date(date2);
      },

      itemTemplate: function(value) {
        return new Date(value).toDateString();
      },

      insertTemplate: function() {
        if (!this.inserting)
          return "";

        var $result = this.insertControl = this._createTextBox();
        return $result;
      },

      editTemplate: function(value) {
        if (!this.editing)
          return this.itemTemplate(value);

        var $result = this.editControl = this._createTextBox();
        $result.val(value);
        return $result;
      },


      insertValue: function() {
        return this.insertControl.datepicker("getDate");
      },

      editValue: function() {
        return this.editControl.datepicker("getDate");
      },

      _createTextBox: function() {
        return $("<input>").attr("type", "text").addClass('form-control input-sm').datepicker({
          autoclose: true
        });
      }
    });

    jsGrid.fields.myDateField = MyDateField;

    $("#exampleCustomGridField").jsGrid({
      height: "500px",
      width: "100%",

      inserting: true,
      editing: true,
      sorting: true,
      paging: true,

      data: db.users,

      fields: [{
        name: "Account",
        width: 150,
        align: "center"
      }, {
        name: "Name",
        type: "text"
      }, {
        name: "RegisterDate",
        type: "myDateField",
        width: 100,
        align: "center"
      }, {
        type: "control",
        editButton: false,
        modeSwitchButton: false
      }]
    });

  })();


})(document, window, jQuery);
