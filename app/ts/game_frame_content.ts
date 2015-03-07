'use strict';

module TourabuEx.GameFrameContent {
    var isWidgetFrame = false;
    chrome.runtime.onMessage.addListener((mes, sender, _) => {
        if (mes.type === 'resize/flash_object' && isWidgetFrame) {
            resizeGameFrame(mes.width, mes.height);
        }

        if (mes === 'mode/widget/frame') {
            console.log('game_frame_widget');
            isWidgetFrame = true;
            $('#html_contents').css({ display: 'none' });
            $('#contents').css('margin', 0);
        }
    });

    chrome.runtime.sendMessage({ type: 'game_frame/load' });

    function resizeGameFrame(width: number, height: number): void {
        console.log('resize/flash_object', width, height);
        $('#flash_object')
            .attr('width', width)
            .attr('height', height)
            .css({
            width: width + 'px',
            height: height + 'px'
        });
    }
    console.log('game frame loaded');
}