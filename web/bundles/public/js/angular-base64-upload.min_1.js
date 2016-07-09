/*! angular-base64-upload - v0.1.13
* https://github.com/adonespitogo/angular-base64-upload
* Copyright (c) Adones Pitogo <pitogo.adones@gmail.com> [September 28, 2015]
* Licensed MIT */

!function(a,b){"use strict";a._arrayBufferToBase64=function(b){for(var c="",d=new Uint8Array(b),e=d.byteLength,f=0;e>f;f++)c+=String.fromCharCode(d[f]);return a.btoa(c)};var c=a.angular.module("naif.base64",[]);c.directive("baseSixtyFourInput",["$window","$q",function(a,b){for(var c={onChange:"&",parser:"&"},d=["onabort","onerror","onloadstart","onloadend","onprogress","onload"],e=d.length-1;e>=0;e--){var f=d[e];c[f]="&"}return{restrict:"A",require:"?ngModel",scope:c,link:function(c,e,f,g){function h(a,b,c,d,e){c[a]=function(a){b()(a,c,d,r,s,e)}}function i(d,e,g){return function(h){var i,j=h.target.result;g.base64=a._arrayBufferToBase64(j),i=f.parser?b.when(c.parser()(e,g)):b.when(g),i.then(function(a){s.push(a),k()}),f.onload&&c.onload()(h,d,e,r,s,g)}}function j(a,b,e){for(var g=d.length-1;g>=0;g--){var j=d[g];f[j]&&"onload"!==j&&h(j,c[j],a,b,e)}a.onload=i(a,b,e)}function k(){var a=f.multiple?s:s[0];g.$setViewValue(a),angular.isFunction(g.$validate)&&g.$validate();var b=angular.version.full.split(".");if("1"===b[0]&&"3"===b[1]&&parseInt(b[2])>=4){var c=g.$viewValue;p(c),q(c),n(c),o(c)}}function l(){for(var b=r.length-1;b>=0;b--){var c=new a.FileReader,d=r[b],e={};e.filetype=d.type,e.filename=d.name,e.filesize=d.size,j(c,d,e),c.readAsArrayBuffer(d)}}function m(a){f.onChange&&c.onChange()(a,r)}function n(a){if(f.maxnum&&f.multiple&&a){var b=a.length<=parseInt(f.maxnum);g.$setValidity("maxnum",b)}return a}function o(a){if(f.minnum&&f.multiple&&a){var b=a.length>=parseInt(f.minnum);g.$setValidity("minnum",b)}return a}function p(a){var b=!0;if(f.maxsize&&a){var c=1e3*parseFloat(f.maxsize);if(f.multiple)for(var d=0;d<a.length;d++){var e=a[d];if(e.filesize>c){b=!1;break}}else b=a.filesize<=c;g.$setValidity("maxsize",b)}return a}function q(a){var b=!0,c=1e3*parseFloat(f.minsize);if(f.minsize&&a){if(f.multiple)for(var d=0;d<a.length;d++){var e=a[d];if(e.filesize<c){b=!1;break}}else b=a.filesize>=c;g.$setValidity("minsize",b)}return a}if(g){g.$setViewValue(null),g.$setPristine();var r=[],s=[];e.on("change",function(a){a.target.files.length&&(s=[],s=angular.copy(s),r=a.target.files,l(),m(a))}),g.$parsers.push(n),g.$parsers.push(o),g.$parsers.push(p),g.$parsers.push(q)}}}}])}(window);
//# sourceMappingURL=angular-base64-upload.min.js.map