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


  var defaults = $.components.getDefaults("webuiPopover");

  // Example Webui Popover Pop with Table
  // ------------------------------------
  (function() {
    var tableContent = $('#examplePopoverTable').html(),
      tableSettings = {
        title: 'WebUI Popover',
        content: tableContent,
        width: 500
      };

    $('#examplePopWithTable').webuiPopover($.extend({}, defaults, tableSettings));
  })();

  // Example Webui Popover Pop with List
  // -----------------------------------
  (function() {
    var listContent = $('#examplePopoverList').html(),
      listSettings = {
        content: listContent,
        title: '',
        padding: false
      };

    $('#examplePopWithList').webuiPopover($.extend({}, defaults, listSettings));

  })();

  // Example Webui Popover Pop with Large Content
  // --------------------------------------------
  (function() {
    var largeContent = $('#examplePopoverLargeContent').html(),
      largeSettings = {
        title: 'WebUI Popover',
        content: largeContent,
        width: 400,
        height: 350,
        closeable: true
      };

    $('#examplePopWithLargeContent').webuiPopover($.extend({}, defaults, largeSettings));
  })();

})(document, window, jQuery);
