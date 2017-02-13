/**
 * Created by shijing.guan on 2016/7/22.
 */
define(['jquery', 'ractive'], function($, Ractive) {
    $.fn['roll'] = function (options){
        new Roll(options, $(this));
    };

    $.fn['rollForever'] = function (options){
        new RollForever(options, $(this));
    };

    var Roll = function (options, $this){
        (function (){
            if(!options) options = {};
            var _time = options.time || 3000;
            var _height = options.height || 60; // px
            var _width = options.width || 200; // px
            var _num = options.num || 1;
            var _sumHeight = _num*_height;
            var _parentStyle = options.pCss || {overflow:'hidden', display: 'block', height:_sumHeight+'px', position:'relative', width:_width+'px'};

            var textDiv = $this;
            var textList = textDiv.find('a');
            textDiv.parent().css(_parentStyle);
            textList.css({display: 'block', width:_width+'px'});

            if(textList.length > _num){
                var textDat = textDiv.html();
                var br = textDat.toLowerCase().indexOf("<br",textDat.toLowerCase().indexOf("<br")+3);
                //var textUp2 = textDat.substr(0,br);
                textDiv.innerHTML = textDat+textDat+textDat.substr(0,br);
                textDiv.css({position:"absolute",top:0, 'line-height':_height+'px'});
                var textDatH = textDiv.get(0).offsetHeight;

                MaxRoll();
            }
            var minTime,maxTime,divTop,newTop=0;

            var isRoll = false;  // 现在正在 滚动吗？
            function MinRoll(){

                newTop++;
                if(newTop<=divTop + _sumHeight){
                    textDiv.css({top: "-" + newTop + "px"});
                    isRoll = true;
                }else{
                    isRoll = false;
                    clearInterval(minTime);
                    maxTime = setTimeout(MaxRoll, _time);
                }
            }
            function MaxRoll(time){
                divTop = Math.abs(parseInt(textDiv.css('top')));
                if(divTop>=0 && divTop<textDatH - _sumHeight){
                    maxTime = setTimeout(function (){
                        minTime = setInterval(MinRoll, 10);
                    }, time?time:_time);

                }else{
                    textDiv.css({top:0});
                    divTop = 0;
                    newTop=0;
                    MaxRoll();
                }
            }

            function reStart(){
                MaxRoll(200);
            }

            /*$(textList).on('mouseover', function (){

            }).on('mouseout', function (){

            })*/

            $(textList).hover(function (){
                clearInterval(minTime);
                clearTimeout(maxTime);
            }, function (){
                if(isRoll){
                    minTime = setInterval(MinRoll, 10);  // 继续滚完你的
                }else{
                    maxTime = setTimeout(reStart, 1000); // 预设下一次滚动
                }
            });
        })();

    }

    var RollForever = function (options, $this){

        if (!options) options = {};
        var _time = options.time || 30;
        var _height = options.height || 60; // px
        var _width = options.width || 200; // px

        var $fg = $this;        // 主要节点
        var $fgParent = $fg.parent();   // 父节点
        $fgParent.append('<div class="fg2"></div>');  // 添加影子节点
        var $fg2 = $fgParent.find('.fg2');
        $fg2.html($fg.html());

        // 父节点必须有一定的 高度
        $fgParent.css({height:_height, overflow:'hidden'});

        //文字无间断滚动代码，兼容IE、Firefox、Opera
        var fgParent_dom = $fgParent.get(0); //document.getElementById('demo');
        var fg_dom = $fg.get(0); //document.getElementById('demo1');
        var fg2_dom = $fg2.get(0); // document.getElementById('demo2');
        // FGDemo2.innerHTML = FGDemo1.innerHTML;

        function marquee() {
            if (fg2_dom.offsetHeight - fgParent_dom.scrollTop <= 0) {
                fgParent_dom.scrollTop -= fg_dom.offsetHeight;
            } else {
                fgParent_dom.scrollTop++;
            }
        }

        var mar_interval = setInterval(marquee, _time);
        fgParent_dom.onmouseover = function () {
            clearInterval(mar_interval);
        };
        fgParent_dom.onmouseout = function () {
            mar_interval = setInterval(marquee, _time);
        };

    }
});

