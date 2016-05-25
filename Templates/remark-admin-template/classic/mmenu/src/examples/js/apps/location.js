(function(document, window, $) {
  'use strict';

  window.AppLocation = App.extend({
    handleMap: function() {

      var self = this;
      /* set default map height */
      var navbarH = $(".site-navbar").outerHeight();
      var footerH = $(".site-footer").outerHeight();
      var mapH = $(window).height() - navbarH - footerH;

      $(".page-main").outerHeight(mapH);

      var mapLatlng = L.latLng(37.769, -122.446);
      var $allFriends = $(".app-location .friend-info");
      $allFriends.each(function() {
        self.allFriends.push($(this));
      });

      // this accessToken, you can get it to here ==> [ https://www.mapbox.com ]
      L.mapbox.accessToken = 'pk.eyJ1IjoiYW1hemluZ3N1cmdlIiwiYSI6ImNpaDVubzBoOTAxZG11dGx4OW5hODl2b3YifQ.qudwERFDdMJhFA-B2uO6Rg';

      /* format map */
      var map = L.mapbox.map('map', 'mapbox.light').setView(mapLatlng, 18);

      /* get all friend's ID input [allFriendId] array */
      $allFriends.each(function() {
        self.allFriendId.push($(this).attr("data-friend-id"));
      });
      /* add markercluster Plugin */
      // this mapbox's Plugins,you can get it to here ==> [ https://github.com/Leaflet/Leaflet.markercluster.git ]
      var markers = new L.MarkerClusterGroup({
        removeOutsideVisibleBounds: false,
        polygonOptions: {
          color: "#444"
        }
      });


      function addMarker(allFriendId, allFriends) {

        for (var i = 0; i < allFriends.length; i++) {
          var x, path;
          if (i % 2 === 0) {
            x = 1 * Math.random();
          } else {
            x = -1 * Math.random();
          }

          var markerLatlng = L.latLng(37.769 + Math.random() / 170 * x, -122.446 + Math.random() / 150 * x);

          path = allFriends[i].find("img").attr("src")

          var divContent = "<div class='in-map-markers'><div class='friend-icon'><img src='" + path + "' alt='" + allFriendId[i] + "' /></div></div>"

          var friendImg = L.divIcon({
            html: divContent,
            iconAnchor: [0, 0],
            className: ""
          })

          /* create new marker and add to map */
          var popupInfo = "<div class='friend-popup-info'><div class='detail'>info</div><h3>" + allFriends[i].find(".friend-name").html() + "</h3><p>" + allFriends[i].find(".friend-title").html() + "</p></div><i class='icon wb-chevron-right-mini'></i>";

          var marker = L.marker(markerLatlng, {
            alt: allFriendId[i],
            title: $allFriends[i].getElementsByClassName("friend-name")[0].innerHTML,
            icon: friendImg
          }).bindPopup(popupInfo, {
            closeButton: false
          });

          markers.addLayer(marker);

          self.allMarkers.push(marker);
          marker.on("popupopen", function() {
            this._icon.className += " marker-active";
            this.setZIndexOffset(999);
          });

          marker.on("popupclose", function() {
            if (this._icon) {
              this._icon.className = "leaflet-marker-icon leaflet-zoom-animated leaflet-clickable";
            }
            this.setZIndexOffset(450);
          });
        }

        map.addLayer(markers);
      }

      /* Add markers to map */
      addMarker(self.allFriendId, self.allFriends);

      /* when map idle,run [getInMapMarkers] Function */
      map.once("ready", getInMapMarkers);

      map.on("viewreset", getInMapMarkers);
      map.on("moveend", getInMapMarkers);

      this.handleClickAction(map);

      function getInMapMarkers() {
        var inMapMarkersId = [],
          listFriends = [];

        /* Get the object of all Markers in the map view */
        for (var i = 0; i < self.allMarkers.length; i++) {
          if (map.getBounds().contains(self.allMarkers[i].getLatLng())) {
            inMapMarkersId.push(self.allMarkers[i].options.alt);
          }
        }

        /* show friend in the aside list */
        for (var i = 0; i < self.allFriends.length; i++) {
          if (inMapMarkersId.indexOf(self.allFriends[i].attr("data-friend-id")) === -1) {
            self.allFriends[i].hide();
          } else {
            self.allFriends[i].show();
          }
        }

        for (var i = 0; i < inMapMarkersId.length; i++) {
          $(".app-location .friend-info").each(function() {
            if ($(this).attr("data-friend-id") === inMapMarkersId[i])
              listFriends.push($(this));
          });
        }
        self.inListFriends = listFriends;
      }
    },
    handleFind: function() {
      var self = this;

      $(".search-friends input").on("focus", function() {
        $(this).on("keyup", function() {
          var inputName = $(".search-friends input").val();

          for (var i = 0; i < self.inListFriends.length; i++) {

            /* Gets the text for each of the input boxes */
            var friendName = self.inListFriends[i].find(".friend-name").html();

            if (inputName.length <= friendName.length) {
              for (var j = 1; j <= inputName.length; j++) {
                if (inputName.substring(0, j).toLowerCase() === friendName.substring(0, j).toLowerCase()) {
                  self.inListFriends[i].show();
                } else {
                  self.inListFriends[i].hide();
                }
              }
            } else {
              self.inListFriends[i].hide();
            }
          }
          if (inputName === "")
            for (var i = 0; i < self.inListFriends.length; i++) {
              self.inListFriends[i].show();
            }
        });

      });
      $(".search-friends input").on("focusout", function() {
        $(this).off("keyup");
      })
    },
    handleResize: function() {
      $(window).on("resize", function() {
        var navbarH = $(".site-navbar").outerHeight();
        var footerH = $(".site-footer").outerHeight();
        var mapH = $(window).height() - navbarH - footerH;

        $(".page-main").outerHeight(mapH);
      });
    },
    handleClickAction: function(map) {
      var self = this;

      $(".app-location .page-aside .list-group").on("click", ".widget-content", function() {

        var thisId = $(this).parents(".friend-info").attr("data-friend-id");
        //stop Bubble
        $(".list-inline").on("click", function(event) {
          event.stopPropagation();
        });

        for (var i = 0; i < self.allMarkers.length; i++) {
          if (self.allMarkers[i].options.alt === thisId) {
            map.panTo(self.allMarkers[i].getLatLng());
            self.allMarkers[i].openPopup();
          }
        }
      });
    },
    run: function() {
      this.allFriends = [];
      this.allFriendId = [];
      this.allMarkers = [];
      this.inListFriends = [];

      this.handleMap();
      this.handleResize();
      this.handleFind();
    }
  });

  $(document).ready(function($) {
    AppLocation.run();
  })
}(document, window, jQuery));
