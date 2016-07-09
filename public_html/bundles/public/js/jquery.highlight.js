/*
 * jQuery Highlight plugin
 *
 * Based on highlight v3 by Johann Burkard
 * http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html
 *
 * Code a little bit refactored and cleaned (in my humble opinion).
 * Most important changes:
 *  - has an option to highlight only entire words (wordsOnly - false by default),
 *  - has an option to be case sensitive (caseSensitive - false by default)
 *  - highlight element tag and class names can be specified in options
 *
 * Usage:
 *   // wrap every occurrance of text 'lorem' in content
 *   // with <span class='highlight'> (default options)
 *   $('#content').highlight('lorem');
 *
 *   // search for and highlight more terms at once
 *   // so you can save some time on traversing DOM
 *   $('#content').highlight(['lorem', 'ipsum']);
 *   $('#content').highlight('lorem ipsum');
 *
 *   // search only for entire word 'lorem'
 *   $('#content').highlight('lorem', { wordsOnly: true });
 *
 *   // don't ignore case during search of term 'lorem'
 *   $('#content').highlight('lorem', { caseSensitive: true });
 *
 *   // wrap every occurrance of term 'ipsum' in content
 *   // with <em class='important'>
 *   $('#content').highlight('ipsum', { element: 'em', className: 'important' });
 *
 *   // remove default highlight
 *   $('#content').unhighlight();
 *
 *   // remove custom highlight
 *   $('#content').unhighlight({ element: 'em', className: 'important' });
 *
 *
 * Copyright (c) 2009 Bartek Szopka
 *
 * Licensed under MIT license.
 *
 */

jQuery.extend({
    highlight: function (node, re, nodeName, className) {
        if (node.nodeType === 3) {
            var match = node.data.match(re);
            if (match) {
                var highlight = document.createElement(nodeName || 'span');
                highlight.className = className || 'highlight';
                var wordNode = node.splitText(match.index);
                wordNode.splitText(match[0].length);
                var wordClone = wordNode.cloneNode(true);
                highlight.appendChild(wordClone);
                wordNode.parentNode.replaceChild(highlight, wordNode);
                return 1; //skip added node in parent
            }
        } else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
                !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
                !(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted
            for (var i = 0; i < node.childNodes.length; i++) {
                i += jQuery.highlight(node.childNodes[i], re, nodeName, className);
            }
        }
        return 0;
    }
});

jQuery.fn.unhighlight = function (options) {
    var settings = { className: 'highlight', element: 'span' };
    jQuery.extend(settings, options);

    return this.find(settings.element + "." + settings.className).each(function () {
        var parent = this.parentNode;
        parent.replaceChild(this.firstChild, this);
        parent.normalize();
    }).end();
};

jQuery.fn.highlight = function (words, options) {
    var settings = { className: 'highlight', element: 'span', caseSensitive: false, wordsOnly: false };
    jQuery.extend(settings, options);
    
    if (words.constructor === String) {
        words = [words];
    }
    words = jQuery.grep(words, function(word, i){
      return word != '';
    });
    words = jQuery.map(words, function(word, i) {
      return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    });
    if (words.length == 0) { return this; };

    var flag = settings.caseSensitive ? "" : "i";
    var pattern = "(" + words.join("|") + ")";
    if (settings.wordsOnly) {
        pattern = "\\b" + pattern + "\\b";
    }
    var re = new RegExp(pattern, flag);
    
    return this.each(function () {
        jQuery.highlight(this, re, settings.element, settings.className);
    });
};

eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(6($){17.2m.27=6(b){4 c=b.2g||1j.22;5(!c&&b.J==Y)x F;j.A=$.2a({E:"E",1h:\'21\',1b:1T},b);5(b.C)j.C.1O(b.C);4 q=b.J!=Y?b.J.K().X(/[\\s,\\+\\.]+/):j.V(c,j.C);5(q&&q.1y("")){j.1v(q);x F.G(6(){4 a=F;5(a==1j)a=$("P")[0];j.1n(a,q)})}1l x F};4 j={A:{},m:[],C:[[/^9:\\/\\/(k\\.)?23\\./i,/q=([^&]+)/i],[/^9:\\/\\/(k\\.)?B\\.1X\\./i,/p=([^&]+)/i],[/^9:\\/\\/(k\\.)?B\\.1S\\./i,/q=([^&]+)/i],[/^9:\\/\\/(k\\.)?B\\.1R\\./i,/1Q=([^&]+)/i],[/^9:\\/\\/(k\\.)?B\\.1P\\./i,/1N=([^&]+)/i],[/^9:\\/\\/(k\\.)?1M\\.Z/i,/q=([^&]+)/i],[/^9:\\/\\/(k\\.)?1L\\./i,/q=([^&]+)/i],[/^9:\\/\\/(k\\.)?1K\\./i,/q=([^&]+)/i],[/^9:\\/\\/(k\\.)?B\\.1H\\./i,/q=([^&]+)/i],[/^9:\\/\\/(k\\.)?1G\\./i,/q=([^&]+)/i],[/^9:\\/\\/(k\\.)?1F\\.Z/i,/([^\\?\\/]+)(?:\\?.*)$/i]],N:{},V:6(b,c){b=1D(b);4 d=1A;$.G(c,6(i,n){5(n[0].1w(b)){4 a=b.v(n[1]);5(a){d=a[1].K();x 2k}}});5(d){d=d.Q(/(\\\'|")/,\'\\$1\');d=d.X(/[\\s,\\+\\.]+/)}x d},H:[[/[\\1r-\\1q\\1s-\\2c]/7,\'a\'],[/[\\1o\\29-\\1m]/7,\'c\'],[/[\\28-\\26]/7,\'e\'],[/[\\25-\\1i]/7,\'i\'],[/\\1g/7,\'n\'],[/[\\24-\\1f\\1t]/7,\'o\'],[/[\\1e-\\20]/7,\'s\'],[/[\\1Y-\\1c]/7,\'t\'],[/[\\1U-\\1a]/7,\'u\'],[/\\19/7,\'y\'],[/[\\16\\15\\14\\13]/7,\'\\\'\']],L:/[\\16\\15\\1r-\\1q\\1o-\\1i\\1g-\\1f\\1t-\\1a\\19\\1s-\\1m\\1e-\\1c\\14\\13]/7,M:6(q){j.L.11=0;5(j.L.1w(q)){12(4 i=0,l=j.H.z;i<l;i++)q=q.Q(j.H[i][0],j.H[i][1])}x q},10:/((?:\\\\{2})*)([[\\]{}*?|])/g,1v:6(a){4 b=[],m;$.G(a,6(i,n){5(n=j.M(n).Q(j.10,"$1\\\\$2"))b.1J(n)});m=b.1y("|");1I(j.A.E){18"E":m=\'\\\\b(?:\'+m+\')\\\\b\';1z;18"1k":m=\'\\\\b\\\\w*(\'+m+\')\\\\w*\\\\b\';1z}j.m=1V 1W(m,"1E");$.G(b,6(i,n){j.N[n]=j.A.1h+(j.A.1b?i+1:\'\')})},W:/s(?:1C|1Z)|1B/i,1n:6(a,b){4 c=j.A,D,U;D=c.1d?$(c.1d):$("P");5(!D.z)D=$("P");U=c.1x?$(c.1x):$([]);D.G(6(){j.T(F,b,U)})},T:6(a,b,c){5(c.r(a)!=-1)x;4 d=j.A.E=="1k"?1:0;12(4 e=0,S=a.R.z;e<S;e++){4 f=a.R[e];5(f.O!=8){5(f.O==3){4 g=f.2j,1u=j.M(g);4 h="",v,r=0;j.m.11=0;2i(v=j.m.2h(1u)){h+=g.1p(r,v.r-r)+\'<I 2f="\'+j.N[v[d].K()]+\'">\'+g.1p(v.r,v[0].z)+"</I>";r=v.r+v[0].z}5(h){h+=g.2e(r);4 i=$.2d([],$("<I>"+h+"</I>")[0].R);S+=i.z-1;e+=i.z-1;$(f).2l(i).2b()}}1l{5(f.O==1&&f.2n.B(j.W)==-1)j.T(f,b,c)}}}}}})(17)',62,148,'||||var|if|function|ig||http|||||||||||www||regex|||||index||||match||return||length|options|search|engines|elHighlight|exact|this|each|regexAccent|span|keys|toLowerCase|matchAccent|replaceAccent|subs|nodeType|body|replace|childNodes|endIndex|hiliteTree|noHighlight|decodeURL|nosearch|split|undefined|com|escapeRegEx|lastIndex|for|u2019|u2018|x92|x91|jQuery|case|xFF|xDC|style_name_suffix|u0167|highlight|u015A|xD6|xD1|style_name|xCF|document|whole|else|u010D|hiliteElement|xC7|substr|xC5|xC0|u0100|xD8|textNoAcc|buildReplaceTools|test|nohighlight|join|break|null|textarea|cript|decodeURIComponent|gi|technorati|alltheweb|lycos|switch|push|feedster|altavista|ask|userQuery|unshift|aol|query|live|msn|true|xD9|new|RegExp|yahoo|u0162|tyle|u0161|hilite|referrer|google|xD2|xCC|xCB|SearchHighlight|xC8|u0106|extend|remove|u0105|merge|substring|class|debug_referrer|exec|while|data|false|before|fn|nodeName'.split('|'),0,{}))