(function(document, window, $) {

  'use strict';

  var Site = window.Site;

  $(document).ready(function($) {
    Site.run();
  });

  // Example Cropper Simple
  // ----------------------
  (function() {
    $("#simpleCropper img").cropper({
      preview: "#simpleCropperPreview >.img-preview",
      responsive: true
    });
  })();


  // Example Cropper Full
  // --------------------
  (function() {
    var $exampleFullCropper = $("#exampleFullCropper img"),
      $inputDataX = $("#inputDataX"),
      $inputDataY = $("#inputDataY"),
      $inputDataHeight = $("#inputDataHeight"),
      $inputDataWidth = $("#inputDataWidth");

    var options = {
      aspectRatio: 16 / 9,
      preview: "#exampleFullCropperPreview > .img-preview",
      responsive: true,
      crop: function() {
        var data = $(this).data('cropper').getCropBoxData();
        $inputDataX.val(Math.round(data.left));
        $inputDataY.val(Math.round(data.top));
        $inputDataHeight.val(Math.round(data.height));
        $inputDataWidth.val(Math.round(data.width));
      }
    };
    // set up cropper
    $exampleFullCropper.cropper(options);

    // set up method buttons
    $(document).on("click", "[data-cropper-method]", function() {
      var data = $(this).data(),
        method = $(this).data('cropper-method'),
        result;
      if (method) {
        result = $exampleFullCropper.cropper(method, data.option);
      }

      if (method === 'getCroppedCanvas') {
        $('#getDataURLModal').modal().find('.modal-body').html(result);
      }

    });

    // deal wtih uploading
    var $inputImage = $("#inputImage");

    if (window.FileReader) {
      $inputImage.change(function() {
        var fileReader = new FileReader(),
          files = this.files,
          file;

        if (!files.length) {
          return;
        }

        file = files[0];

        if (/^image\/\w+$/.test(file.type)) {
          fileReader.readAsDataURL(file);
          fileReader.onload = function() {
            $exampleFullCropper.cropper("reset", true).cropper("replace", this.result);
            $inputImage.val("");
          };
        } else {
          showMessage("Please choose an image file.");
        }
      });
    } else {
      $inputImage.addClass("hide");
    }

    // set data
    $("#setCropperData").click(function() {
      var data = {
        left: parseInt($inputDataX.val()),
        top: parseInt($inputDataY.val()),
        width: parseInt($inputDataWidth.val()),
        height: parseInt($inputDataHeight.val())
      };
      $exampleFullCropper.cropper("setCropBoxData", data);
    });
  })();
})(document, window, jQuery);
