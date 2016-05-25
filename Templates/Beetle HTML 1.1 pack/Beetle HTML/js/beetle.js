/*
 *   Beetle
 *   Written by Pasquale Vitiello (pasqualevitiello@gmail.com),
 *   mokaine.com
 */

jQuery(document).ready(function ($) {


    /* Define some vars */

    var win = $(window),
        body = $('body'),
        header = $('header'),
        headerHeight = header.outerHeight(true),
        headerNav = $('nav'),
        content = $('main'),
        pxWrapper = $('#intro-wrap'),
        pxContainer = $('#intro'),
        pxImg = $('.intro-item'),
        pxImgCaption = pxContainer.find('.caption'),
        testimonial = $('.testimonial-slider'),
        cCarousel = $('.custom-carousel'),
        loaderIntro = '<div class="landing landing-slider"><div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div></div>',
        loader = '<div class="landing landing-els"><div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div></div>',
        loaderLightbox = '<div class="landing landing-els lightbox"><div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div></div>',
        darkover = '<div class="darkover"></div>',
        moreBtnIcon = '<div class="more"><a href="#main"><i class="icon icon-arrow-down"></i></a></div>';


    /* Determine viewport width matching with media queries */

    function viewport() {

        var e = window,
            a = 'inner';

        if (!('innerWidth' in window)) {

            a = 'client';
            e = document.documentElement || document.body;

        }

        return {
            width: e[a + 'Width'],
            height: e[a + 'Height']
        };

    }


    /* Toggle "mobile" class */

    function mobileClass() {

        var vpWidth = viewport().width; // This should match media queries

        if ((vpWidth <= 768) && (!body.hasClass('mobile'))) {

            body.addClass('mobile');

        } else if ((vpWidth > 768) && (body.hasClass('mobile'))) {

            body.removeClass('mobile');

        }

    }

    mobileClass();
    $(window).resize(mobileClass);


    /* Intro Height */

    function introHeight() {

        var $this = pxWrapper,
            dataHeight = $this.data('height');

        if ($this.hasClass('full-height')) {

            var recalcHeaderH = header.outerHeight(true);

            if (!body.hasClass('mobile')) {

                $this.css({
                    'height': (win.height())
                });

            } else {

                $this.css({
                    'height': (win.height() - recalcHeaderH)
                });

            }

        } else {

            $this.css({
                'height': dataHeight + 'em'
            });

        }

    }


    /* Initialize Intro */

    function initIntro() {

        var $this = pxContainer;

        $this.append(loaderIntro);

        $this.addClass(function () {
            return $this.find('.intro-item').length > 1 ? "big-slider" : "";
        });

        $this.waitForImages({

            finished: function () {

                // console.log('All images have loaded.');
                $('.landing-slider').remove();

                if ($this.hasClass('big-slider')) {

                    var autoplay = $this.data('autoplay'),
                        navigation = $this.data('navigation'),
                        pagination = $this.data('pagination'),
                        transition = $this.data('transition');

                    $this.owlCarousel({
                        singleItem: true,
                        autoPlay: autoplay || false, // || = if data- is empty or if it does not exists
                        transitionStyle: transition || false,
                        stopOnHover: true,
                        responsiveBaseWidth: ".slider",
                        responsiveRefreshRate: 0,
                        addClassActive: true,
                        navigation: navigation || false,
                        navigationText: [
                            "<i class='icon icon-arrow-left-simple'></i>",
                            "<i class='icon icon-arrow-right-simple'></i>"
                        ],
                        pagination: pagination || false,
                        rewindSpeed: 2000,
                    });

                }

                $this.removeClass('preload');

                if ($this.hasClass('darken')) {
                    pxImg.append(darkover);
                }

                if (pxWrapper.length && $this.hasClass('more-button') && $this.attr('data-pagination') !== 'true') {
                    $this.append(moreBtnIcon);
                    smoothScroll();
                }

            },
            waitForAll: true
        });

    }

    if (pxContainer.length) {

        initIntro();
        introHeight();
        $(window).resize(introHeight);

    }


    /* Smooth scroll */

    function smoothScroll() {

        $('a[href*=#]:not([href=#])').click(function () {

            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') || location.hostname == this.hostname) {

                var target = $(this.hash);

                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

                if (target.length) {

                    $('html,body').animate({
                        scrollTop: target.offset().top
                    }, 500);

                    return false;

                }

            }

        });

    }

    smoothScroll();


    /* Fixed header if there's no Big slider */

    if (!pxWrapper.length) {

        header.addClass('fixed-header');

    }


    /* Parallax data attributes according to #intro's height */

    function parallax() {

        if (pxWrapper.length) {

            var touchDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            if (touchDevice) {

                body.addClass('no-parallax');

            } else if (!body.hasClass('mobile') && !body.hasClass('no-parallax')) {

                pxContainer.attr('data-anchor-target', '#intro-wrap');
                pxContainer.attr('data-top', 'transform:translateY(0px);');
                header.attr('data-anchor-target', '#intro-wrap');
                header.attr('data-top', 'transform:translateY(0px);');
                if (touchDevice) {
                    pxContainer.attr('data-top-bottom', 'transform:translateY(0px);');
                    header.attr('data-top-bottom', 'transform:translateY(0px);');
                    header.addClass('transition');
                    // console.log('Disable Parallax');

                } else {
                    pxContainer.attr('data-top-bottom', 'transform:translateY(' + '-' + pxWrapper.height() / 4 + 'px);');
                    header.attr('data-top-bottom', 'transform:translateY(' + '-' + pxWrapper.height() / 4 + 'px);');
                }
                animDone = false;

                skrollr.init({
                    forceHeight: false,
                    smoothScrolling: false,
                    mobileCheck: function () {
                        //hack - forces mobile version to be off
                        return false;
                    },
                    /* easing: 'swing', */
                    render: function () {

                        if (header.hasClass('skrollable-after')) {

                            if (!animDone) {

                                animDone = true;
                                header.addClass('fixed-header').css({
                                    'display': 'none'
                                }).fadeIn(300);

                            }

                        } else {

                            animDone = false;
                            header.removeClass('fixed-header');

                        }

                    }
                    /*
                    render: function(data) {
                        //Log the current scroll position.
                        console.log(data.curTop);
                    }
                    */
                }).refresh();

                pxImgCaption.each(function () {

                    var $this = $(this);

                    $this.css({
                        top: ((pxWrapper.height() + headerHeight / 2) - $this.outerHeight()) / 2
                    });

                });

            } else {

                skrollr.init().destroy();
                content.css({
                    marginTop: 0 + 'px'
                });

                var parallaxEls = $('header, #intro'),
                    attrs = parallaxEls[0].attributes,
                    name,
                    index;

                for (index = attrs.length - 1; index >= 0; --index) {
                    name = attrs[index].nodeName;

                    if (name.substring(0, 5) === "data-") {
                        parallaxEls.removeAttr(name);
                    }

                }

                parallaxEls.css({
                    '-webkit-transform': '',
                    '-moz-transform': '',
                    'transform': '',
                    'backgroundPosition': ''
                }).removeClass('skrollable-after');

                pxImgCaption.each(function () {

                    var $this = $(this);

                    if (!body.hasClass('mobile') && body.hasClass('no-parallax')) {

                        $this.css({
                            top: ((pxWrapper.height() + headerHeight) - $this.outerHeight()) / 2
                        });

                    } else {

                        $this.css({
                            top: (pxWrapper.height() - $this.outerHeight()) / 2
                        });

                    }

                });

            }

        } else {

            if (!body.hasClass('mobile')) {

                content.css({
                    marginTop: headerHeight + 'px'
                });

            } else {

                content.css({
                    marginTop: 0
                });

            }

        }

    }

    parallax();
    $(window).resize(parallax);


    /* Submenus */

    var menuToggle = $('#menu-toggle'),
        headerNavUl = headerNav.children('ul'),
        liWithSub = headerNavUl.children('li:has(ul.sub-menu)'),
        ulSub = $('ul.sub-menu'),
        parent = ulSub.children('li:has(ul.sub-menu)').children('a'),
        menuArrow = '<span class="sub-arrow"><i class="fa fa-chevron-down"></i></span>';

    liWithSub.addClass('parent').children('a').append(menuArrow);
    parent.addClass('parent');

    menuToggle.click(function () {

        headerNavUl.slideToggle(200);
        $(this).children('i').toggleClass('active');

        return false;

    });

    $(window).resize(function () {

        if (!body.hasClass('mobile')) {

            headerNavUl.removeAttr('style');
            menuToggle.children('i').removeClass('active');

        }

    });


    /* Make page's odd sections darker */

    var page = $('.page'),
        pageSections = page.find('.section'),
        oddSections = pageSections.filter(':odd');

    if (body.hasClass('page') && pageSections.length > 1) {

        oddSections.addClass('greyish');

    }


    /* Overlay content absolute centering */

    function centerOverlay() {

        var PortfolioOverlay = $('.overlay-content'),
            BlogOverlay = $('.blog-overlay');

        if (PortfolioOverlay.length) {

            PortfolioOverlay.each(function () {

                var $this = $(this),
                    itemPortfolioHeight = $this.closest('.item').height(),
                    PortfolioOverlayHeight = $this.height(),
                    PortfolioIcon = $this.children('.post-type');
                PortfolioIconHeight = PortfolioIcon.children('i').height();

                if ((PortfolioOverlayHeight + 30) > itemPortfolioHeight) {

                    $this.children('p').css({
                        'visibility': 'hidden'
                    });
                    $this.children('h2').css({
                        'visibility': 'hidden'
                    });

                    $this.css({
                        marginTop: (itemPortfolioHeight - PortfolioIconHeight) / 2
                    });

                } else {

                    $this.children('p').css({
                        'visibility': 'visible'
                    });
                    $this.children('h2').css({
                        'visibility': 'visible'
                    });
                    $this.css({
                        marginTop: (itemPortfolioHeight - PortfolioOverlayHeight) / 2
                    });

                }

            });

        }

        if (BlogOverlay.length) {

            BlogOverlay.each(function () {

                var $this = $(this),
                    itemBlogHeight = $this.prev('img').height(),
                    BlogOverlayIcon = $this.children('i'),
                    BlogOverlayIconHeight = BlogOverlayIcon.height();

                BlogOverlayIcon.css({
                    top: (itemBlogHeight - BlogOverlayIconHeight) / 2
                });

            });

        }

    }

    centerOverlay();
    $(window).on('load', centerOverlay);
    $(window).on('resize', centerOverlay);


    /* fix Blog Excerpt Heights */

    var blogExcerpt = $('.item.column.three .blog-excerpt');

    function fixBlogH() {

        var gridW = parseInt($('.grid-items').width()),
            sizerBigW = (gridW / 100) * 48,
            sizerBigH = sizerBigW * 0.75,
            sizerSmallW = (gridW / 100) * 22.05,
            sizerSmallH = sizerSmallW * 0.75,
            difference = sizerBigH - sizerSmallH + 0.5;

        // console.log(difference);

        if (!body.hasClass('mobile')) {

            blogExcerpt.css({
                'height': difference
            });

        } else {

            blogExcerpt.css({
                'height': 'auto'
            });

        }

    }

    if (blogExcerpt.length) {

        fixBlogH();
        $(window).on('resize', fixBlogH);

    }


    /* Masonry */

    var grid = $('.grid-items');

    function masonry() {

        grid.each(function () {

            var $this = $(this),
                filterOptions = $this.prev('.filter-options'),
                sizer = $this.find('.shuffle-sizer');

            $this.append(loader);

            $this.waitForImages({

                finished: function () {

                    $this.children('.landing-els').remove();

                    $this.shuffle({
                        itemSelector: '.item',
                        sizer: sizer,
                        speed: 500,
                        easing: 'ease-out',
                    });

                    if (filterOptions.length) {

                        var btns = filterOptions.children();
                        btns.on('click', function () {
                            var $this = $(this),
                                parentGrid = filterOptions.next(grid),
                                isActive = $this.hasClass('active'),
                                group = isActive ? 'all' : $this.data('group');

                            // Hide current label, show current label in title
                            if (!isActive) {
                                $('.filter-options .active').removeClass('active');
                            }

                            $this.toggleClass('active');

                            // Filter elements
                            parentGrid.shuffle('shuffle', group);
                        });

                        btns = null;

                    }

                    $this.removeClass('preload');
                    centerOverlay();

                },
                waitForAll: true
            });

        });

    }

    if (grid.length) {

        masonry();

    }


    /* Dribbble API */

    var dribbbleItems = $('.dribbble-items');

    var callback = function (playerShots) {

        var html = '';

        $.each(playerShots.shots, function (i, shot) {
            html += '<div class="item column three"><figure>';
            html += '<img src="' + shot.image_url + '" ';
            html += 'alt="' + shot.title + '"></figure>';
            html += '<a class="overlay" href="' + shot.url + '">';
            html += '<div class="overlay-content">';
            html += '<div class="post-type"><i class="fa fa-dribbble"></i></div>';
            // html += '<h2>' + shot.title + '</h2>';
            html += '<p class="reset">' + shot.views_count + ' views</p>';
            html += '<p class="reset">' + shot.likes_count + ' likes</p>';
            html += '</div></a></div>';
        });

        dribbbleItems.html(html).append(loader);
        var $this = $('.dribbble-items');
        $this.find('.item:nth-of-type(4n)').addClass('last');
        $this.removeClass('preload');
        $this.children('.landing-els').remove(); 
        centerOverlay();           

    };

    if (dribbbleItems.length) {

        var username = dribbbleItems.data('username'),
            elemNr = dribbbleItems.data('elements');

        $.jribbble.getShotsByPlayerId(username, callback, {
            page: 1,
            per_page: elemNr
        });

        $(window).load(function() {

            centerOverlay(); 

        });        

    }


    /* Chart numbers absolute centering */

    var chart = $('.chart'),
        chartNr = $('.chart-content'),
        chartParent = chart.parent();

    function centerChartsNr() {

        chartNr.css({
            top: (chart.height() - chartNr.outerHeight()) / 2
        });

    }

    if (chart.length) {

        centerChartsNr();
        $(window).resize(centerChartsNr);

        chartParent.each(function () {

            $(this).onScreen({
                doIn: function () {
                    $(this).find('.chart').easyPieChart({
                        scaleColor: false,
                        lineWidth: 12,
                        size: 178,
                        trackColor: false,
                        lineCap: 'square',
                        animate: 2000,
                        onStep: function (from, to, percent) {
                            $(this.el).find('.percent').text(Math.round(percent));
                        }
                    });
                },
            });

            $(this).find('.chart').wrapAll('<div class="centertxt" />');

        });

    }


    /* Milestone */

    var countItem = $('.count-item');

    function milestone() {

        countItem.each(function () {

            var $this = $(this);

            $this.onScreen({
                doIn: function () {
                    var countNumber = $this.find('.count-number'),
                        countTitle = $this.find('.count-subject');
                    countNumber.countTo({
                        onComplete: function () {
                            countTitle.delay(100).addClass('subject-on');
                            countNumber.removeClass('count-number').addClass('count-number-done');
                        }
                    });
                },
            });

        });
    }

    if (countItem.length) {

        milestone();

    }


    /* Timeline's circle color */

    var timeline = $('.timeline'),
        circle = timeline.find('.circle');

    if (timeline.length) {

        circle.each(function () {

            var circleColor = $(this).parents('section').css('background-color');
            $(this).css({
                backgroundColor: circleColor
            });

        });

    }


    /* Testimonial Carousel */

    function initTestimonial() {

        testimonial.each(function () {

            var $this = $(this),
                autoplay = $this.data('autoplay'),
                pagination = $this.data('pagination'),
                transition = $this.data('transition'),
                autoheight = $this.data('autoheight');

            $this.owlCarousel({
                singleItem: true,
                autoPlay: autoplay || false,
                transitionStyle: transition || false,
                autoHeight: autoheight || false,
                stopOnHover: true,
                responsiveBaseWidth: ".slider",
                responsiveRefreshRate: 0,
                addClassActive: true,
                pagination: pagination || false,
                rewindSpeed: 2000,
            });

        });

    }

    if (testimonial.length) {

        initTestimonial();

    }


    /* Custom Carousel */

    function initCCarousel() {

        cCarousel.each(function () {

            var $this = $(this),
                autoplay = $this.data('autoplay'),
                pagination = $this.data('pagination'),
                transition = $this.data('transition'),
                autoheight = $this.data('autoheight');

            $this.owlCarousel({
                singleItem: true,
                autoPlay: autoplay || false,
                transitionStyle: transition || false,
                autoHeight: autoheight || false,
                stopOnHover: true,
                responsiveBaseWidth: ".slider",
                responsiveRefreshRate: 0,
                addClassActive: true,
                pagination: pagination || false,
                rewindSpeed: 2000,
            });

        });

    }

    if (cCarousel.length) {

        initCCarousel();

    }


    /* onScreen Animations */

    var onScreenAnims = $('.animation');

    if (onScreenAnims.length) {

        onScreenAnims.onScreen({
            toggleClass: false,
            doIn: function () {
                $(this).addClass('onscreen')
            }
        });

    }


    /* Return the right mockup according to the class & initialize sliders */

    var findDevice = $('.slider');

    function useMockup() {

        findDevice.each(function () {

            var $this = $(this),
                slideHeight = $this.find('.owl-item').outerHeight(true),
                iphoneBlack = '<div class="mockup iphone-mockup black"></div>',
                iphoneWhite = '<div class="mockup iphone-mockup white"></div>',
                iphoneGrey = '<div class="mockup iphone-mockup grey"></div>',
                ipadBlack = '<div class="mockup ipad-mockup black"></div>',
                ipadWhite = '<div class="mockup ipad-mockup white"></div>',
                ipadGrey = '<div class="mockup ipad-mockup grey"></div>',
                desktop = '<div class="mockup desktop-mockup"></div>',
                deviceWrapper = $this.parent('.row-content'),
                mockupslider = $this.children('figure'),
                autoplay = $this.data('autoplay');

            if (!$this.parent('div').hasClass('side-mockup')) {

                mockupslider.owlCarousel({
                    singleItem: true,
                    autoPlay: autoplay || false,
                    stopOnHover: true,
                    responsiveBaseWidth: ".slider",
                    responsiveRefreshRate: 0,
                    addClassActive: true,
                    navigation: true,
                    navigationText: [
                        "<i class='fa fa-chevron-left'></i>",
                        "<i class='fa fa-chevron-right'></i>"
                    ],
                    pagination: false,
                    rewindSpeed: 2000,
                });

            } else {

                mockupslider.owlCarousel({
                    singleItem: true,
                    autoPlay: autoplay || false,
                    stopOnHover: true,
                    transitionStyle: "fade",
                    responsiveBaseWidth: ".slider",
                    responsiveRefreshRate: 0,
                    addClassActive: true,
                    navigation: false,
                    pagination: true,
                    rewindSpeed: 2000,
                    mouseDrag: false,
                    touchDrag: false
                });

            }

            if ($this.hasClass('iphone-slider black')) {

                $this.find('.owl-wrapper-outer').after(iphoneBlack);

            } else if ($this.hasClass('iphone-slider white')) {

                $this.find('.owl-wrapper-outer').after(iphoneWhite);

            } else if ($this.hasClass('iphone-slider grey')) {

                $this.find('.owl-wrapper-outer').after(iphoneGrey);

            } else if ($this.hasClass('ipad-slider black')) {

                $this.find('.owl-wrapper-outer').after(ipadBlack);

            } else if ($this.hasClass('ipad-slider white')) {

                $this.find('.owl-wrapper-outer').after(ipadWhite);

            } else if ($this.hasClass('ipad-slider grey')) {

                $this.find('.owl-wrapper-outer').after(ipadGrey);

            } else if ($this.hasClass('desktop-slider')) {

                $this.find('.owl-wrapper-outer').after(desktop);

            }

            $this.waitForImages({

                finished: function () {

                    $this.fadeIn('slow');

                },
                waitForAll: true
            });

            deviceWrapper.css({
                'padding-left': '0',
                'padding-right': '0'
            })


        });

    }

    if ((findDevice.length) && (!findDevice.hasClass('gallery'))) {

        useMockup();

        function fixArrowPos() {

            findDevice.each(function () {

                var slideHeight = $(this).find('.owl-item').outerHeight(true);

                $(this).find('.owl-prev, .owl-next').css('top', slideHeight / 2);

            });

        }

        fixArrowPos();
        $(window).resize(fixArrowPos);

    }


    /* Side mockups fixes */

    var sideMockup = $('.side-mockup');

    function sideMockups() {

        sideMockup.each(function () {

            var $this = $(this),
                sideMockupHeight = parseInt($this.find('.slider').height()),
                sideMockupParent = $this.parent('.row-content'),
                sideMockupParentPad = parseInt(sideMockupParent.css('padding-top')),
                sideMockupFix = sideMockupHeight + (sideMockupParentPad * 2) + 'px';

            if (!body.hasClass('mobile')) {

                if ($this.hasClass('right-mockup')) {

                    $this.css({
                        'position': 'absolute',
                        'left': '52%'
                    });

                } else if ($this.hasClass('left-mockup')) {

                    $this.css({
                        'position': 'absolute',
                        'right': '52%'
                    });

                }

                sideMockupParent.css({
                    'position': 'relative',
                    'min-height': sideMockupFix
                });

            } else {

                $this.css({
                    'position': 'relative',
                    'left': 'auto',
                    'right': 'auto'
                });

                sideMockupParent.css({
                    'position': 'relative',
                    'min-height': '0'
                });

            }

        });

    }


    if (sideMockup.length) {

        sideMockups();
        $(window).resize(sideMockups);

    }


    /* Initialize Gallery Sliders */

    var galleryslidercontainer = $('.gallery.slider');

    function gallerySlider() {

        galleryslidercontainer.each(function () {

            var $this = $(this),
                galleryslider = $this.children('figure'),
                autoplay = $this.data('autoplay'),
                autoheight = $this.data('autoheight');

            galleryslider.owlCarousel({
                singleItem: true,
                autoHeight: autoheight || false,
                autoPlay: autoplay || false,
                transitionStyle: "fade",
                stopOnHover: true,
                responsiveBaseWidth: ".slider",
                responsiveRefreshRate: 0,
                addClassActive: true,
                navigation: true,
                navigationText: [
                    "<i class='icon  icon-arrow-up'></i>",
                    "<i class='icon icon-arrow-down'></i>"
                ],
                pagination: false,
                rewindSpeed: 2000,
            });

            $this.fadeIn('slow');

        });

    }

    if (galleryslidercontainer.length) {

        gallerySlider();

    }


    /* Create unique data-lightbox attributes http://stackoverflow.com/questions/11044876/how-to-auto-generate-id-for-child-div-in-jquery */

    var lightboxContainer = $('.lightbox');

    if (lightboxContainer.length) {

        var $this = lightboxContainer;

        for (var i = 0; i < $this.length; i++) {

            $($this[i]).find('.item a').attr("data-lightbox", "gallery-" + i);

        }

        lightboxContainer.each(function () {

            var $this = $(this);

            var activityIndicatorOn = function () {
                $(loaderLightbox).appendTo('body');
            },
                activityIndicatorOff = function () {
                    $('.landing-els').remove();
                },
                overlayOn = function () {
                    $('<div id="imagelightbox-overlay"></div>').appendTo('body');
                },
                overlayOff = function () {
                    $('#imagelightbox-overlay').remove();
                },
                closeButtonOn = function (instance) {
                    $('<a href="#" id="imagelightbox-close"><i class="icon icon-close"></i></a>').appendTo('body').on('click', function () {
                        $(this).remove();
                        instance.quitImageLightbox();
                        return false;
                    });
                },
                closeButtonOff = function () {
                    $('#imagelightbox-close').remove();
                },
                captionOn = function () {
                    var description = $('a[href="' + $('#imagelightbox').attr('src') + '"]').find('h2').html();
                    if (description.length > 0)
                        $('<div id="imagelightbox-caption"><h3>' + description + '</h3></div>').appendTo('body');
                },
                captionOff = function () {
                    $('#imagelightbox-caption').remove();
                };


            var instance = $this.find('.item a[data-lightbox^="gallery-"]').imageLightbox({
                onStart: function () {
                    overlayOn();
                    closeButtonOn(instance);
                },
                onEnd: function () {
                    overlayOff();
                    captionOff();
                    closeButtonOff();
                    activityIndicatorOff();
                },
                onLoadStart: function () {
                    captionOff();
                    activityIndicatorOn();
                },
                onLoadEnd: function () {
                    captionOn();
                    activityIndicatorOff();
                }
            });

        });

    }


    /* Initialize Google Maps */

    function googleMap() {

        $('.map').each(function (i, e) {

            $map = $(e);
            $map_lat = $map.attr('data-mapLat');
            $map_lon = $map.attr('data-mapLon');
            $map_zoom = parseInt($map.attr('data-mapZoom'));
            $map_title = $map.attr('data-mapTitle');
            $map_info = $map.attr('data-info');
            $map_img = $map.attr('data-img');
            $map_color = $map.attr('data-color');
            $map_height = $map.attr('data-height');

            var latlng = new google.maps.LatLng($map_lat, $map_lon);
            var options = {
                scrollwheel: false,
                draggable: false,
                zoomControl: false,
                disableDoubleClickZoom: true,
                disableDefaultUI: true,
                zoom: $map_zoom,
                center: latlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            /* Map's style */
            var red1 = "#fd685b",
                red2 = "#fe8e84",
                orange1 = "#fa6f57",
                orange2 = "#fb9381",
                yellow1 = "#fecd5e",
                yellow2 = "#fedc8f",
                green1 = "#a1d26e",
                green2 = "#b9dd92",
                mint1 = "#4fcead",
                mint2 = "#7bdac2",
                aqua1 = "#4FC1E9",
                aqua2 = "#73d2f4",
                blue1 = "#5D9CEC",
                blue2 = "#86b5f1",
                purple1 = "#ab94e9",
                purple2 = "#c0afef",
                pink1 = "#ea89bf",
                pink2 = "#efa7cf",
                white1 = "#E6E9ED",
                white2 = "#F5F7FA",
                grey1 = "#AAB2BD",
                grey2 = "#CCD1D9",
                darkgrey1 = "#434A54",
                darkgrey2 = "#5f656d";

            if ($map_color == 'red') {

                var styles = [{
                    "elementType": "geometry.stroke",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "water",
                    "stylers": [{
                        "color": red1
                    }]
                }, {
                    "featureType": "water",
                    "elementType": "labels.icon",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "landscape.natural",
                    "stylers": [{
                        "color": red2
                    }]
                }, {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "poi",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "road",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "transit",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "landscape.man_made",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "administrative",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }],
                    textcolor = red1;

            }
            if ($map_color == 'orange') {

                var styles = [{
                    "elementType": "geometry.stroke",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "water",
                    "stylers": [{
                        "color": orange1
                    }]
                }, {
                    "featureType": "water",
                    "elementType": "labels.icon",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "landscape.natural",
                    "stylers": [{
                        "color": orange2
                    }]
                }, {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "poi",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "road",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "transit",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "landscape.man_made",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "administrative",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }],
                    textcolor = orange1;

            }
            if ($map_color == 'yellow') {

                var styles = [{
                    "elementType": "geometry.stroke",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "water",
                    "stylers": [{
                        "color": yellow1
                    }]
                }, {
                    "featureType": "water",
                    "elementType": "labels.icon",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "landscape.natural",
                    "stylers": [{
                        "color": yellow2
                    }]
                }, {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "poi",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "road",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "transit",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "landscape.man_made",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "administrative",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }],
                    textcolor = yellow1;

            }
            if ($map_color == 'green') {

                var styles = [{
                    "elementType": "geometry.stroke",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "water",
                    "stylers": [{
                        "color": green1
                    }]
                }, {
                    "featureType": "water",
                    "elementType": "labels.icon",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "landscape.natural",
                    "stylers": [{
                        "color": green2
                    }]
                }, {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "poi",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "road",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "transit",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "landscape.man_made",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "administrative",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }],
                    textcolor = green1;

            }
            if ($map_color == 'mint') {

                var styles = [{
                    "elementType": "geometry.stroke",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "water",
                    "stylers": [{
                        "color": mint1
                    }]
                }, {
                    "featureType": "water",
                    "elementType": "labels.icon",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "landscape.natural",
                    "stylers": [{
                        "color": mint2
                    }]
                }, {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "poi",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "road",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "transit",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "landscape.man_made",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "administrative",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }],
                    textcolor = mint1;

            }
            if ($map_color == 'aqua') {

                var styles = [{
                    "elementType": "geometry.stroke",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "water",
                    "stylers": [{
                        "color": aqua1
                    }]
                }, {
                    "featureType": "water",
                    "elementType": "labels.icon",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "landscape.natural",
                    "stylers": [{
                        "color": aqua2
                    }]
                }, {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "poi",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "road",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "transit",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "landscape.man_made",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "administrative",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }],
                    textcolor = aqua1;

            }
            if ($map_color == 'blue') {

                var styles = [{
                    "elementType": "geometry.stroke",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "water",
                    "stylers": [{
                        "color": blue1
                    }]
                }, {
                    "featureType": "water",
                    "elementType": "labels.icon",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "landscape.natural",
                    "stylers": [{
                        "color": blue2
                    }]
                }, {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "poi",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "road",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "transit",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "landscape.man_made",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "administrative",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }],
                    textcolor = blue1;

            }
            if ($map_color == 'purple') {

                var styles = [{
                    "elementType": "geometry.stroke",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "water",
                    "stylers": [{
                        "color": purple1
                    }]
                }, {
                    "featureType": "water",
                    "elementType": "labels.icon",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "landscape.natural",
                    "stylers": [{
                        "color": purple2
                    }]
                }, {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "poi",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "road",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "transit",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "landscape.man_made",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "administrative",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }],
                    textcolor = purple1;

            }
            if ($map_color == 'pink') {

                var styles = [{
                    "elementType": "geometry.stroke",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "water",
                    "stylers": [{
                        "color": pink1
                    }]
                }, {
                    "featureType": "water",
                    "elementType": "labels.icon",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "landscape.natural",
                    "stylers": [{
                        "color": pink2
                    }]
                }, {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "poi",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "road",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "transit",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "landscape.man_made",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "administrative",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }],
                    textcolor = pink1;

            }
            if ($map_color == 'white') {

                var styles = [{
                    "elementType": "geometry.stroke",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "water",
                    "stylers": [{
                        "color": white1
                    }]
                }, {
                    "featureType": "water",
                    "elementType": "labels.icon",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "landscape.natural",
                    "stylers": [{
                        "color": white2
                    }]
                }, {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "poi",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "road",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "transit",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "landscape.man_made",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "administrative",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }],
                    textcolor = '#333';

            }
            if ($map_color == 'grey') {

                var styles = [{
                    "elementType": "geometry.stroke",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "water",
                    "stylers": [{
                        "color": grey1
                    }]
                }, {
                    "featureType": "water",
                    "elementType": "labels.icon",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "landscape.natural",
                    "stylers": [{
                        "color": grey2
                    }]
                }, {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "poi",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "road",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "transit",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "landscape.man_made",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "administrative",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }],
                    textcolor = '#333';

            }
            if ($map_color == 'dark-grey') {

                var styles = [{
                    "elementType": "geometry.stroke",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "water",
                    "stylers": [{
                        "color": darkgrey1
                    }]
                }, {
                    "featureType": "water",
                    "elementType": "labels.icon",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "landscape.natural",
                    "stylers": [{
                        "color": darkgrey2
                    }]
                }, {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "poi",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "road",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "transit",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "landscape.man_made",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "administrative",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }],
                    textcolor = '#333';

            }
            if ($map_color == 'invert') {

                var styles = [{
                    "stylers": [{
                        "invert_lightness": "true"
                    }, {
                        "hue": "0xffbb00"
                    }, {
                        "saturation": "-100"
                    }, {
                        "lightness": "15"
                    }]
                }],
                    textcolor = '#333';

            }

            var styledMap = new google.maps.StyledMapType(styles, {
                name: "Styled Map"
            });

            var map = new google.maps.Map($map[0], options);

            var icon = {
                url: $map_img,
                size: null,
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(26, 26),
                scaledSize: new google.maps.Size(52, 52)
            };

            var marker = new google.maps.Marker({
                position: latlng, // loc is a variable with my lngLat object
                title: $map_title,
                map: map,
                icon: icon
            });

            map.mapTypes.set('map_style', styledMap);
            map.setMapTypeId('map_style');

            var contentString = '<div class="infobox-inner" style="color: ' + textcolor + ';">' + $map_info + '</div>';

            /* Custom infowindow code; it has been replaced by the code below, using Infobox plugin

            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map,marker);
            });
            infowindow.open(map,marker); // To force Infowindow open

            */

            var infobox = new InfoBox({
                content: contentString,
                disableAutoPan: false,
                maxWidth: 0,
                zIndex: null,
                boxStyle: {
                    width: "280px"
                },
                closeBoxURL: "",
                pixelOffset: new google.maps.Size(-140, 40),
                infoBoxClearance: new google.maps.Size(1, 1)
            });

            // map height
            if (!$map.parent('div').is('#intro')) {

                // user defined size
                $map.css({
                    'height': $map_height + 'em'
                });

            } else {

                function adaptMapH() {

                    var sectionH = $map.parent('#intro').height();
                    $map.css({
                        'height': sectionH
                    });

                }

                adaptMapH();
                $(window).resize(adaptMapH);

            }

            google.maps.event.addListener(marker, 'click', function () {
                infobox.open(map, marker);
            });
            infobox.open(map, marker); // To force Infowindow open

            // center map on resize
            google.maps.event.addDomListener(window, "resize", function () {
                var center = map.getCenter();
                google.maps.event.trigger(map, "resize");
                map.setCenter(center);
            });

        });

    }

    if ($('.map').length) {

        googleMap();

    }


    /* Add some "last" classes */

    headerNav.find('.menu-item').last('li').addClass('last');
    $('#top-footer').find('.column').last('.column').addClass('last');
    $('.blog.list-style').find('article').last('article').addClass('last');
    $('.search.list-style').find('article').last('article').addClass('last');


    /* Clear columns */

    var lastColumn = $('.column.last');

    if (lastColumn.length) {

        lastColumn.after('<div class="clear"></div>');

    }


    /* Initialize FluidVids.js */

    Fluidvids.init({
        selector: 'iframe',
        players: ['www.youtube.com', 'player.vimeo.com']
    });



});