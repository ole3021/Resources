/*!
 * remark (http://getbootstrapadmin.com/remark)
 * Copyright 2015 amazingsurge
 * Licensed under the Themeforest Standard Licenses
 */
$.components.register("table", {
  mode: "api",
  api: function(context) {
    /* section */
    $(document).on('click', '.table-section', function(e) {
      if ("checkbox" !== e.target.type && "button" !== e.target.type && "a" !== e.target.tagName.toLowerCase() && !$(e.target).parent("div.checkbox-custom").length) {
        if ($(this).hasClass("active")) {
          $(this).removeClass("active")
        } else {
          $(this).siblings('.table-section').removeClass("active");
          $(this).addClass("active");
        }
      }
    });
  }
});
