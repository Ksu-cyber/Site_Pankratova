$(function() {
    $('.slider').each(function() {
        let $th = $(this);
        $th.attr('data-pos', 1);
        let slide = $th.find('.slider-slide');
        let num = $th.find('.slider-slide').length;
        let dots = $th.find('.slider-dots');
        dots.prepend('<span class="slider-indicator"></span>');
        for( let i = 1; i <= num; i++ ){
            dots.append('<span style="width:' + 100 / num + '%" class="slider-dot" data-pos="'+ i +'"></span>');
        }
        $th.find('.slider-slides').css('width', 100 * num + '%');
        slide.css('width', 100 / num + '%');
        $th.find('.slider-dot').on('click', function(){
            let currentPos = $th.attr('data-pos');
            let newPos = $(this).attr('data-pos');
            let newDirection = (newPos > currentPos ? 'right' : 'left');
            let currentDirection = (newPos < currentPos ? 'right' : 'left');
            $th.find('.slider-indicator').removeClass('slider-indicator-' + currentDirection);
            $th.find('.slider-indicator').addClass('slider-indicator-' + newDirection);
            $th.attr('data-pos', newPos);
            $th.find('.slider-slides').css('transform', 'translateX(-' + 100 / num * (newPos - 1) + '%)');
            $th.find('.slider-indicator').css({'left': 100 / num * (newPos - 1) + '%','right':100 - (100 / num) - 100 / num * (newPos - 1) + '%'});
        });
        $th.find('.slider-indicator').css({'left': 0,'right': 100 - (100 / num) + '%'});
    });
});