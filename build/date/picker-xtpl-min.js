/*
Copyright 2014, KISSY v1.50
MIT Licensed
build time: Mar 3 14:47
*/
KISSY.add("date/picker-xtpl",[],function(){var k=function(d,b,l,i){var g=this,e=b.escapeHtml,b=g.nativeCommands,h=g.utils.callCommand,j=b.each,k=b["if"],b='<div class="',a={},c=[];c.push("header");a.params=c;a=h(g,d,a,"getBaseCssClasses",1);b+=e(a);b+='">\n    <a id="ks-date-picker-previous-year-btn-';a=d.resolve(["id"]);b+=e(a);b+='"\n       class="';a={};c=[];c.push("prev-year-btn");a.params=c;a=h(g,d,a,"getBaseCssClasses",3);b+=e(a);b+='"\n       href="#"\n       tabindex="-1"\n       role="button"\n       title="';
a=d.resolve(["previousYearLabel"]);b+=e(a);b+='"\n       hidefocus="on">\n    </a>\n    <a id="ks-date-picker-previous-month-btn-';a=d.resolve(["id"]);b+=e(a);b+='"\n       class="';a={};c=[];c.push("prev-month-btn");a.params=c;a=h(g,d,a,"getBaseCssClasses",11);b+=e(a);b+='"\n       href="#"\n       tabindex="-1"\n       role="button"\n       title="';a=d.resolve(["previousMonthLabel"]);b+=e(a);b+='"\n       hidefocus="on">\n    </a>\n    <a class="';a={};c=[];c.push("month-select");a.params=c;a=
h(g,d,a,"getBaseCssClasses",18);b+=e(a);b+='"\n       role="button"\n       href="#"\n       tabindex="-1"\n       hidefocus="on"\n       title="';a=d.resolve(["monthSelectLabel"]);b+=e(a);b+='"\n       id="ks-date-picker-month-select-';a=d.resolve(["id"]);b+=e(a);b+='">\n        <span id="ks-date-picker-month-select-content-';a=d.resolve(["id"]);b+=e(a);b+='">';a=d.resolve(["monthYearLabel"]);b+=e(a);b+='</span>\n        <span class="';a={};c=[];c.push("month-select-arrow");a.params=c;a=h(g,d,a,
"getBaseCssClasses",26);b+=e(a);b+='">x</span>\n    </a>\n    <a id="ks-date-picker-next-month-btn-';a=d.resolve(["id"]);b+=e(a);b+='"\n       class="';a={};c=[];c.push("next-month-btn");a.params=c;a=h(g,d,a,"getBaseCssClasses",29);b+=e(a);b+='"\n       href="#"\n       tabindex="-1"\n       role="button"\n       title="';a=d.resolve(["nextMonthLabel"]);b+=e(a);b+='"\n       hidefocus="on">\n    </a>\n    <a id="ks-date-picker-next-year-btn-';a=d.resolve(["id"]);b+=e(a);b+='"\n       class="';a={};
c=[];c.push("next-year-btn");a.params=c;a=h(g,d,a,"getBaseCssClasses",37);b+=e(a);b+='"\n       href="#"\n       tabindex="-1"\n       role="button"\n       title="';a=d.resolve(["nextYearLabel"]);b+=e(a);b+='"\n       hidefocus="on">\n    </a>\n</div>\n<div class="';a={};c=[];c.push("body");a.params=c;a=h(g,d,a,"getBaseCssClasses",45);b+=e(a);b+='">\n    <table class="';a={};c=[];c.push("table");a.params=c;var a=h(g,d,a,"getBaseCssClasses",46),b=b+e(a),b=b+'" cellspacing="0" role="grid">\n        <thead>\n        <tr role="row">\n            ',
a={},c=[],m=d.resolve(["showWeekNumber"]);c.push(m);a.params=c;a.fn=function(b){var a;a='\n            <th role="columnheader" class="';var f={},c=[];c.push("column-header");f.params=c;f=h(g,b,f,"getBaseCssClasses",50);a+=e(f);a+=" ";f={};c=[];c.push("week-number-header");f.params=c;f=h(g,b,f,"getBaseCssClasses",50);a+=e(f);a+='">\n                <span class="';f={};c=[];c.push("column-header-inner");f.params=c;b=h(g,b,f,"getBaseCssClasses",51);a+=e(b);return a+'">x</span>\n            </th>\n            '};
b+=k.call(g,d,a,l);b+="\n            ";a={};c=[];m=d.resolve(["weekdays"]);c.push(m);a.params=c;a.fn=function(b){var a;a='\n            <th role="columnheader" title="';var f=b.resolve(["this"]);a+=e(f);a+='" class="';var f={},c=[];c.push("column-header");f.params=c;f=h(g,b,f,"getBaseCssClasses",55);a+=e(f);a+='">\n                <span class="';f={};c=[];c.push("column-header-inner");f.params=c;f=h(g,b,f,"getBaseCssClasses",56);a+=e(f);a+='">\n                    ';f=b.resolve(["xindex"]);b=b.resolve("veryShortWeekdays."+
f+"");a+=e(b);return a+"\n                </span>\n            </th>\n            "};b+=j.call(g,d,a,l);b+='\n        </tr>\n        </thead>\n        <tbody id="ks-date-picker-tbody-';j=d.resolve(["id"]);b+=e(j);b+='">\n        ';if((i=h(g,d,i,"renderDates",64))||0===i)b+=i;b+="\n        </tbody>\n    </table>\n</div>\n";i={};j=[];a=d.resolve(["showToday"]);c=d.resolve(["showClear"]);j.push(a||c);i.params=j;i.fn=function(b){var a;a='\n<div class="';var c={},d=[];d.push("footer");c.params=d;c=h(g,
b,c,"getBaseCssClasses",69);a+=e(c);a+='">\n    <a class="';c={};d=[];d.push("today-btn");c.params=d;c=h(g,b,c,"getBaseCssClasses",70);a+=e(c);a+='"\n       role="button"\n       hidefocus="on"\n       tabindex="-1"\n       href="#"\n       id="ks-date-picker-today-btn-';c=b.resolve(["id"]);a+=e(c);a+='"\n       title="';c=b.resolve(["todayTimeLabel"]);a+=e(c);a+='">';c=b.resolve(["todayLabel"]);a+=e(c);a+='</a>\n    <a class="';c={};d=[];d.push("clear-btn");c.params=d;c=h(g,b,c,"getBaseCssClasses",
77);a+=e(c);a+='"\n       role="button"\n       hidefocus="on"\n       tabindex="-1"\n       href="#"\n       id="ks-date-picker-clear-btn-';c=b.resolve(["id"]);a+=e(c);a+='">';b=b.resolve(["clearLabel"]);a+=e(b);return a+"</a>\n</div>\n"};return b+=k.call(g,d,i,l)};k.TPL_NAME="E:/code/kissy_git/kissy/kissy/src/date/picker-xtpl/src/picker.xtpl.html";return k});