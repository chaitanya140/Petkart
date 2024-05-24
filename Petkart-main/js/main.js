// Initialize jsdom and jQuery
require('jsdom-global')();
const $ = require('jquery');

// IIFE to use jQuery
(function ($) {
    "use strict";
    
    // Back to top button
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 200) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });
    
    // Main carousel
    $(".carousel .owl-carousel").owlCarousel({
        autoplay: true,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        items: 1,
        smartSpeed: 300,
        dots: false,
        loop: true,
        nav: false
    });
    
    // Testimonials carousel
    $(".testimonials-carousel").owlCarousel({
        center: true,
        autoplay: true,
        dots: true,
        loop: true,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            }
        }
    });
    
    // Related post carousel
    $(".related-slider").owlCarousel({
        autoplay: true,
        dots: false,
        loop: true,
        nav: true,
        navText: [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 1
            },
            768: {
                items: 2
            }
        }
    });
})(jQuery);

// Simulate a scroll event to test the "Back to top" button
window.scrollTo = (x, y) => {
    window.document.documentElement.scrollTop = y;
    window.dispatchEvent(new window.Event('scroll'));
};

// Simulate scrolling down
window.scrollTo(0, 250);
console.log($('.back-to-top').css('display')); // Should print 'block' if the scroll function works correctly
