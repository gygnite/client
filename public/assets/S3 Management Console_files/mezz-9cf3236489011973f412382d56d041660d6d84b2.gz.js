(function(){var a=window.AWSC?AWSC:{},h=a.startTime,g=a.stdeltaStartTime,d=window.AWSConsoleMetrics?AWSConsoleMetrics:{},e=d.startTime,c=a.Clog?a.Clog:{},b=c.log;if(!b){return}if(h){f("stdelta-dec",e);f("stdelta-sim",g)}function f(j,i){if(i){b(j,i-h,undefined,undefined,"ms")}}})();(function(){var b=(window.ConsoleNavService&&ConsoleNavService.getLocation?ConsoleNavService.getLocation():window.location),o="/p/log/1/"+encodeURIComponent(b.pathname.split("/")[1])+"/1/OP/",i=2000,l=1950,k=20,y=10000,x=1,d=200;var s=0,j,w=0,e=false,f=false,u=false;setInterval(function(){if(w>=x){w=w-x}},y);var n=function v(A,C){var B="";if(A.key!==undefined){B+="&k"+C+"="+A.key;if(A.value!==undefined){B+="&m"+C+"="+A.value}if(A.detail!==undefined){B+="&d"+C+"="+A.detail}if(A.pageId){B+="&p"+C+"="+A.pageId}if(A.unit){B+="&u"+C+"="+A.unit}if(A.logLevel){B+="&l"+C+"="+A.logLevel}}return B},t=function q(){var B="",A="",C=0,F=0,D={},E=o.length;while(AWSC.Clog.system.curItem()&&E<l){D=AWSC.Clog.system.curItem();if((o.length+n(D,C).length)>l){A+=n(AWSCLog.system.dequeue(),F);F+=1}else{E+=n(D,C).length;if(E<l){B+=n(AWSCLog.system.dequeue(),C);C+=1}else{break}}}if(B){h(o+B)}if(A){p(o,A)}window.clearTimeout(j);j=setTimeout(r,i)},r=function z(A){if(u){return true}u=true;if(!f){if(!(window.onerror.sbh)||!(window.error.sbh)||!(window.onbeforeunload.sbh)){var C="Event handlers modified:";if(!window.onerror.sbh){C+="onerror "}if(!window.error.sbh){C+="error "}if(!window.onbeforeunload.sbh){C+="onbeforeunload "}AWSC.Clog.system.prequeue("clogWarn",1,C);f=true}}if(AWSC.Clog.system.curItem()){var B=new Date().getTime();if(w>k){if(!e){h(o+"&k1=clogMaxCalls&m1=1");e=true}j=setTimeout(r,i)}else{if(s<B-i){t()}else{if(A===true){t()}else{j=setTimeout(r,i)}}}}u=false;return true},h=function m(A){A=AWSC.Clog.system.getEndpoint()+A;var B=A+"&cb="+(new Date().getTime());B=encodeURI(B);var C=new Image();C.src=B;s=(new Date().getTime());w+=1},p=function g(A,B){A=AWSC.Clog.system.getEndpoint()+A;try{var D=new XMLHttpRequest();D.open("POST",A,true);D.withCredentials=true;D.setRequestHeader("Content-type","multipart/form-data");D.send(encodeURI(B))}catch(C){}s=(new Date().getTime());w+=1},a=function c(){var A=r();if(A){AWSC.Clog.system.onEnqueue(r);if(AWSC.Clog.system.curItem()){r(true)}}};if(window.addEventListener){window.addEventListener("load",a,false)}else{if(window.attachEvent){window.attachEvent("onload",a,false)}}})();