$.components.register("owlCarousel", {
  mode: "default",
  defaults: {
    loop: true,
    nav: true,
    dots: false,
    dotsClass: "owl-dots owl-dots-fall",
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 3
      }
    }
  }
});
