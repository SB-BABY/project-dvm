$(document).ready(function () {

    $(".hero__list").slick({
        dots: false,
        arrows: true,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1500,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
            },
            },
        ],
    });

$(".documents__list").slick({
    dots: false,
    arrows: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    rows: 2,
    slidesToScroll: 1,
    // autoplay: true,
    // autoplaySpeed: 150000,
    pauseOnHover: true,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
            },
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 1.5,
                vertical: true,
            },
        },
    ],
});


});