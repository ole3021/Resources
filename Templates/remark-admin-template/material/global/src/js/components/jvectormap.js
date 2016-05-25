$.components.register("vectorMap", {
  mode: "default",
  defaults: {
    map: "world_mill_en",
    backgroundColor: '#fff',
    zoomAnimate: true,
    regionStyle: {
      initial: {
        fill: $.colors("primary", 600)
      },
      hover: {
        fill: $.colors("primary", 500)
      },
      selected: {
        fill: $.colors("primary", 800)
      },
      selectedHover: {
        fill: $.colors("primary", 500)
      }
    },
    markerStyle: {
      initial: {
        r: 8,
        fill: $.colors("red", 600),
        "stroke-width": 0
      },
      hover: {
        r: 12,
        stroke: $.colors("red", 600),
        "stroke-width": 0
      }
    }
  }
});
