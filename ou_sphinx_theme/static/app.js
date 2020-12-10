(function(t){function e(e){for(var a,c,s=e[0],l=e[1],o=e[2],p=0,h=[];p<s.length;p++)c=s[p],Object.prototype.hasOwnProperty.call(r,c)&&r[c]&&h.push(r[c][0]),r[c]=0;for(a in l)Object.prototype.hasOwnProperty.call(l,a)&&(t[a]=l[a]);u&&u(e);while(h.length)h.shift()();return i.push.apply(i,o||[]),n()}function n(){for(var t,e=0;e<i.length;e++){for(var n=i[e],a=!0,s=1;s<n.length;s++){var l=n[s];0!==r[l]&&(a=!1)}a&&(i.splice(e--,1),t=c(c.s=n[0]))}return t}var a={},r={app:0},i=[];function c(e){if(a[e])return a[e].exports;var n=a[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,c),n.l=!0,n.exports}c.m=t,c.c=a,c.d=function(t,e,n){c.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},c.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},c.t=function(t,e){if(1&e&&(t=c(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(c.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)c.d(n,a,function(e){return t[e]}.bind(null,a));return n},c.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return c.d(e,"a",e),e},c.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},c.p="/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],l=s.push.bind(s);s.push=e,s=s.slice();for(var o=0;o<s.length;o++)e(s[o]);var u=l;i.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("cd49")},cd49:function(t,e,n){"use strict";n.r(e);n("e260"),n("e6cf"),n("cca6"),n("a79d");var a=n("7a23"),r=Object(a["g"])("svg",{viewBox:"0 0 24 24",class:"icon large","aria-hidden":"true"},[Object(a["g"])("path",{d:"M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"})],-1),i={key:0},c=Object(a["g"])("li",null,null,-1),s={href:"http://open.ac.uk",target:"_blank",rel:"noopener"},l={key:0,role:"none"},o={key:1,role:"none"},u=Object(a["g"])("a",{href:"/hub/home",role:"menuitem",tabindex:"-1"},"JupyterHub",-1),p={key:2,role:"none"},h=Object(a["g"])("a",{href:"/hub/logout",role:"menuitem",tabindex:"-1"},"Logout",-1);function b(t,e,n,b,f,d){var g=Object(a["n"])("tutorial");return Object(a["i"])(),Object(a["c"])("div",{class:t.appClasses},[Object(a["g"])("nav",{id:"app-menu",style:{"margin-right":t.scrollWidth}},[Object(a["g"])("ul",null,[Object(a["g"])("li",null,[t.hasAppMenu?(Object(a["i"])(),Object(a["c"])("button",{key:0,id:"main-menu-button",tabindex:"0","aria-has-popup":"menu","aria-controls":"main-menu","aria-expanded":t.mainMenuShowing?"true":"false","aria-label":"Show the main menu",onClick:e[1]||(e[1]=function(){return t.toggleMainMenu.apply(t,arguments)})},[r],8,["aria-expanded"])):Object(a["d"])("",!0)]),Object(a["g"])("li",null,[t.scrolling?(Object(a["i"])(),Object(a["c"])("span",i,Object(a["o"])(t.project),1)):Object(a["d"])("",!0)]),c,Object(a["g"])("li",null,[Object(a["g"])("a",s,[Object(a["g"])("img",{src:t.urls.static+"/ou_logo.png",alt:"The Open University"},null,8,["src"])])])]),t.hasAppMenu?(Object(a["i"])(),Object(a["c"])("ul",{key:0,id:"main-menu",role:"menu","aria-labelledby":"main-menu-button",style:{display:t.mainMenuShowing?"block":"none"},ref:"mainMenu",onKeydown:e[2]||(e[2]=function(){return t.ariaPopupMenuKbd.apply(t,arguments)})},[t.hasAppMenuDownload?(Object(a["i"])(),Object(a["c"])("li",l,[Object(a["g"])("a",{href:t.appMenuDownloadUrl,role:"menuitem",tabindex:"-1"},"Download",8,["href"])])):Object(a["d"])("",!0),t.hasAppMenuJupyterHub?(Object(a["i"])(),Object(a["c"])("li",o,[u])):Object(a["d"])("",!0),t.hasAppMenuJupyterHub?(Object(a["i"])(),Object(a["c"])("li",p,[h])):Object(a["d"])("",!0)],36)):Object(a["d"])("",!0)],4),t.hasTutorial?(Object(a["i"])(),Object(a["c"])(g,{key:0})):Object(a["d"])("",!0),t.hasIFrame?(Object(a["i"])(),Object(a["c"])("iframe",{key:1,id:"iframe",src:t.iFrameSrc},null,8,["src"])):Object(a["d"])("",!0)],2)}n("c975"),n("ac1f"),n("5319"),n("96cf");var f=n("1da1"),d=n("d4ec"),g=n("bee2"),j=n("262e"),O=n("2caf"),v=n("9ab4"),m=n("ce1f"),k=Object(a["g"])("a",{href:"#tutorial-content",class:"show-for-sr"},"Jump to the main content",-1),y={ref:"blockNav",class:"block"},w={key:0,class:"within-block"},x={role:"presentation"},L=Object(a["g"])("span",null,"« Previous",-1),H={key:1},M={role:"presentation"},$=Object(a["g"])("svg",{viewBox:"0 0 24 24",class:"icon small",alt:"",role:"presentation"},[Object(a["g"])("path",{d:"M3,3H9V7H3V3M15,10H21V14H15V10M15,17H21V21H15V17M13,13H7V18H13V20H7L5,20V9H7V11H13V13Z"})],-1),N={role:"presentation"},B=Object(a["g"])("span",null,"Next »",-1),W={key:1},S={key:1,class:"within-block"},C={role:"presentation"},T=Object(a["g"])("span",null,"« Previous",-1),V={key:1},A={role:"presentation"},P=Object(a["g"])("svg",{viewBox:"0 0 24 24",class:"icon small",alt:"",role:"presentation"},[Object(a["g"])("path",{d:"M3,3H9V7H3V3M15,10H21V14H15V10M15,17H21V21H15V17M13,13H7V18H13V20H7L5,20V9H7V11H13V13Z"})],-1),R={role:"presentation"},U=Object(a["g"])("span",null,"Next »",-1),D={key:1},E=Object(a["g"])("svg",{viewBox:"0 0 24 24",class:"icon"},[Object(a["g"])("path",{d:"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"})],-1);function J(t,e,n,r,i,c){var s=Object(a["n"])("tutorial-nav");return Object(a["i"])(),Object(a["c"])("div",{id:"tutorial",ref:"tutorial",onKeyup:e[14]||(e[14]=function(){return t.keyUp.apply(t,arguments)})},[k,Object(a["g"])("div",{class:{scrolling:t.isScrolling,content:!0},ref:"content",onScrollPassive:e[12]||(e[12]=function(){return t.scrolling.apply(t,arguments)})},[Object(a["g"])("header",{ref:"header"},Object(a["o"])(t.project),513),Object(a["g"])("nav",y,[Object(a["g"])("ul",null,[(Object(a["i"])(!0),Object(a["c"])(a["a"],null,Object(a["m"])(t.tutorial.blocks,(function(e){return Object(a["i"])(),Object(a["c"])("li",{key:e.url,role:"presentation"},[Object(a["g"])("a",{href:e.url,onClick:function(n){return t.navigateTo(e.url,n)},"aria-current":e.current||e.expanded?"true":"false"},Object(a["o"])(e.title),9,["href","onClick","aria-current"])])})),128))])],512),t.tutorial.withinBlockNav?(Object(a["i"])(),Object(a["c"])("nav",w,[Object(a["g"])("ul",null,[Object(a["g"])("li",x,[t.tutorial.prev?(Object(a["i"])(),Object(a["c"])("a",{key:0,href:t.tutorial.prev.url,title:t.tutorial.prev.title,onClick:e[1]||(e[1]=function(e){return t.navigateTo(t.tutorial.prev.url,e)})},[L],8,["href","title"])):(Object(a["i"])(),Object(a["c"])("span",H,"« Previous"))]),Object(a["g"])("li",M,[Object(a["g"])("a",{tabindex:"0",onClick:e[2]||(e[2]=function(){return t.showWithinBlockNav.apply(t,arguments)}),onKeyup:[e[3]||(e[3]=Object(a["q"])((function(){return t.showWithinBlockNav.apply(t,arguments)}),["enter"])),e[4]||(e[4]=Object(a["q"])((function(){return t.showWithinBlockNav.apply(t,arguments)}),["space"]))],"aria-label":"Show the within block navigation"},[Object(a["g"])("span",{innerHTML:t.tutorial.title},null,8,["innerHTML"]),$],32)]),Object(a["g"])("li",N,[t.tutorial.next?(Object(a["i"])(),Object(a["c"])("a",{key:0,href:t.tutorial.next.url,title:t.tutorial.next.title,onClick:e[5]||(e[5]=function(e){return t.navigateTo(t.tutorial.next.url,e)})},[B],8,["href","title"])):(Object(a["i"])(),Object(a["c"])("span",W,"Next »"))])])])):Object(a["d"])("",!0),Object(a["g"])("main",{id:"tutorial-content",innerHTML:t.tutorial.body,onClick:e[6]||(e[6]=function(){return t.articleClick.apply(t,arguments)}),"aria-live":"polite","aria-atomic":"true"},null,8,["innerHTML"]),t.tutorial.withinBlockNav?(Object(a["i"])(),Object(a["c"])("nav",S,[Object(a["g"])("ul",null,[Object(a["g"])("li",C,[t.tutorial.prev?(Object(a["i"])(),Object(a["c"])("a",{key:0,href:t.tutorial.prev.url,title:t.tutorial.prev.title,onClick:e[7]||(e[7]=function(e){return t.navigateTo(t.tutorial.prev.url,e)})},[T],8,["href","title"])):(Object(a["i"])(),Object(a["c"])("span",V,"« Previous"))]),Object(a["g"])("li",A,[Object(a["g"])("a",{tabindex:"0",onClick:e[8]||(e[8]=function(){return t.showWithinBlockNav.apply(t,arguments)}),onKeyup:[e[9]||(e[9]=Object(a["q"])((function(){return t.showWithinBlockNav.apply(t,arguments)}),["enter"])),e[10]||(e[10]=Object(a["q"])((function(){return t.showWithinBlockNav.apply(t,arguments)}),["space"]))],"aria-label":"Show the within block navigation"},[Object(a["g"])("span",{innerHTML:t.tutorial.title},null,8,["innerHTML"]),P],32)]),Object(a["g"])("li",R,[t.tutorial.next?(Object(a["i"])(),Object(a["c"])("a",{key:0,href:t.tutorial.next.url,title:t.tutorial.next.title,onClick:e[11]||(e[11]=function(e){return t.navigateTo(t.tutorial.next.url,e)})},[U],8,["href","title"])):(Object(a["i"])(),Object(a["c"])("span",D,"Next »"))])])])):Object(a["d"])("",!0)],34),t.tutorial.withinBlockNav?(Object(a["i"])(),Object(a["c"])("nav",{key:0,ref:"withinBlockNavDialog",class:"within-block-overlay",style:{height:t.withinBlockNavHeight+"px"},"aria-hidden":t.isWithinBlockNavActive?"false":"true",role:"dialog","aria-label":"Within Block Navigation"},[Object(a["g"])("button",{class:"close-full-within-block","aria-label":"Close",onClick:e[13]||(e[13]=function(){return t.hideWithinBlockNav.apply(t,arguments)})},[E]),Object(a["g"])(s,{items:[t.tutorial.withinBlockNav],onClick:t.navigateTo},null,8,["items","onClick"])],12,["aria-hidden"])):Object(a["d"])("",!0)],544)}var q=Object(a["g"])("svg",{viewBox:"0 0 24 24",class:"icon"},[Object(a["g"])("path",{fill:"currentColor",d:"M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"})],-1),_=Object(a["g"])("svg",{viewBox:"0 0 24 24",class:"icon"},[Object(a["g"])("path",{fill:"currentColor",d:"M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"})],-1);function Z(t,e,n,r,i,c){var s=Object(a["n"])("tutorial-nav");return Object(a["i"])(),Object(a["c"])("ul",null,[(Object(a["i"])(!0),Object(a["c"])(a["a"],null,Object(a["m"])(t.items,(function(e,n){return Object(a["i"])(),Object(a["c"])(a["a"],null,[e.children.length>0?(Object(a["i"])(),Object(a["c"])("li",{key:n+"-true","aria-expanded":e.expanded?"true":"false",role:"presentation"},[Object(a["g"])("span",null,[Object(a["g"])("a",{href:e.url,"aria-current":e.current?"true":"false",onClick:function(n){return t.click(e.url,n)}},Object(a["o"])(e.title),9,["href","aria-current","onClick"]),Object(a["g"])("button",{"aria-label":"Show or hide this section",onClick:function(n){return t.toggleShowHide(e)}},[q,_],8,["onClick"])]),Object(a["g"])(s,{items:e.children,onClick:t.click},null,8,["items","onClick"])],8,["aria-expanded"])):(Object(a["i"])(),Object(a["c"])("li",{key:n+"-false",role:"presentation"},[Object(a["g"])("a",{href:e.url,"aria-current":e.current?"true":"false",onClick:function(n){return t.click(e.url,n)}},Object(a["o"])(e.title),9,["href","aria-current","onClick"])]))],64)})),256))])}var F=function(t){Object(j["a"])(n,t);var e=Object(O["a"])(n);function n(){var t;return Object(d["a"])(this,n),t=e.apply(this,arguments),t.expanded=[],t}return Object(g["a"])(n,[{key:"click",value:function(t,e){this.$emit("click",t,e)}},{key:"toggleShowHide",value:function(t){t.expanded=!t.expanded}}]),n}(m["b"]);F=Object(v["a"])([Object(m["a"])({name:"tutorial-nav",props:{items:Array},emits:{click:null}})],F);var I=F;I.render=Z;var K=I,X=function(t){Object(j["a"])(n,t);var e=Object(O["a"])(n);function n(){var t;return Object(d["a"])(this,n),t=e.apply(this,arguments),t.isScrolling=!1,t.isWithinBlockNavActive=!1,t.withinBlockNavHeight=0,t.withinBlockNavOpener=null,t}return Object(g["a"])(n,[{key:"mounted",value:function(){var t=this;this.$store.commit("setScrollWidth",this.$refs.content.offsetWidth-this.$refs.content.clientWidth),window.addEventListener("resize",(function(){t.$store.commit("setScrollWidth",t.$refs.content.offsetWidth-t.$refs.content.clientWidth)}))}},{key:"navigateTo",value:function(){var t=Object(f["a"])(regeneratorRuntime.mark((function t(e,n){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return n.preventDefault(),this.hideWithinBlockNav(!0),t.next=4,this.$store.dispatch("load",e);case 4:this.$refs.content.scrollTop=0;case 5:case"end":return t.stop()}}),t,this)})));function e(e,n){return t.apply(this,arguments)}return e}()},{key:"showWithinBlockNav",value:function(t){this.isWithinBlockNavActive=!0,this.withinBlockNavHeight=this.$refs.tutorial.clientHeight;var e=this.$refs.withinBlockNavDialog.querySelector('[aria-current="true"]');e&&e.focus(),this.withinBlockNavOpener=t.target;while("a"!==this.withinBlockNavOpener.localName.toLowerCase())this.withinBlockNavOpener=this.withinBlockNavOpener.parentElement}},{key:"hideWithinBlockNav",value:function(t){var e=this;setTimeout((function(){e.isWithinBlockNavActive=!1}),300),this.withinBlockNavHeight=0,!t&&this.withinBlockNavOpener&&this.withinBlockNavOpener.focus()}},{key:"scrolling",value:function(){var t=this.$refs.content.scrollTop;this.isScrolling=t>this.$refs.header.clientHeight+this.$refs.blockNav.clientHeight,this.$store.commit("setScrolling",t>this.$refs.header.clientHeight),this.$store.commit("setScrollWidth",this.$refs.content.offsetWidth-this.$refs.content.clientWidth)}},{key:"articleClick",value:function(t){var e=t.target;while(e&&"a"!==e.localName)e=e.parentElement;if(e){var n=e.classList;if(n.contains("reference"))if(n.contains("internal")){t.preventDefault();var a=e.getAttribute("href");a&&this.navigateTo(a,t)}else n.contains("external")&&(e.setAttribute("rel","noopener"),e.setAttribute("target","_blank"))}}},{key:"keyUp",value:function(t){27===t.keyCode&&this.isWithinBlockNavActive&&this.hideWithinBlockNav(!1)}},{key:"urls",get:function(){return this.$store.state.urls}},{key:"project",get:function(){return this.$store.state.project}},{key:"tutorial",get:function(){var t=this;return this.$nextTick((function(){window.MathJax&&window.MathJax.typeset(),t.$store.commit("setScrollWidth",t.$refs.content.offsetWidth-t.$refs.content.clientWidth)})),this.$store.state.tutorial}}]),n}(m["b"]);X=Object(v["a"])([Object(m["a"])({components:{TutorialNav:K}})],X);var z=X;z.render=J;var Y=z,G={id:"editor"},Q=Object(a["g"])("nav",null,[Object(a["g"])("ul",{role:"tablist"},[Object(a["g"])("li",{role:"presentation"},[Object(a["g"])("a",{role:"tab","aria-selected":"true"},[Object(a["g"])("svg",{viewBox:"0 0 24 24",class:"icon small"},[Object(a["g"])("path",{d:"M12,17.56L16.07,16.43L16.62,10.33H9.38L9.2,8.3H16.8L17,6.31H7L7.56,12.32H14.45L14.22,14.9L12,15.5L9.78,14.9L9.64,13.24H7.64L7.93,16.43L12,17.56M4.07,3H19.93L18.5,19.2L12,21L5.5,19.2L4.07,3Z"})]),Object(a["f"])(" index.html")])]),Object(a["g"])("li",{role:"presentation"},[Object(a["g"])("a",{role:"tab","aria-selected":"false"},[Object(a["g"])("svg",{viewBox:"0 0 24 24",class:"icon small"},[Object(a["g"])("path",{d:"M5,3L4.35,6.34H17.94L17.5,8.5H3.92L3.26,11.83H16.85L16.09,15.64L10.61,17.45L5.86,15.64L6.19,14H2.85L2.06,18L9.91,21L18.96,18L20.16,11.97L20.4,10.76L21.94,3H5Z"})]),Object(a["f"])(" default.css")])])])],-1),tt=Object(a["e"])('<div class="code-editor"><div class="line-numbers"><pre>1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11</pre></div><div class="code"><pre><span></span><span class="cp">&lt;!DOCTYPE html&gt;</span>\n<span class="p">&lt;</span><span class="nt">html</span><span class="p">&gt;</span>\n<span class="p">&lt;</span><span class="nt">head</span><span class="p">&gt;</span>\n  <span class="p">&lt;</span><span class="nt">meta</span> <span class="na">charset</span><span class="o">=</span><span class="s">&quot;utf-8&quot;</span><span class="p">/&gt;</span>\n  <span class="p">&lt;</span><span class="nt">title</span><span class="p">&gt;</span>This is a test page<span class="p">&lt;/</span><span class="nt">title</span><span class="p">&gt;</span>\n<span class="p">&lt;/</span><span class="nt">head</span><span class="p">&gt;</span>\n<span class="p">&lt;</span><span class="nt">body</span><span class="p">&gt;</span>\n  <span class="p">&lt;</span><span class="nt">h1</span><span class="p">&gt;</span>Welcome to this page!<span class="p">&lt;/</span><span class="nt">h1</span><span class="p">&gt;</span>\n  <span class="p">&lt;</span><span class="nt">p</span><span class="p">&gt;</span>We are just testing some stuff.<span class="p">&lt;/</span><span class="nt">p</span><span class="p">&gt;</span>\n<span class="p">&lt;/</span><span class="nt">body</span><span class="p">&gt;</span>\n<span class="p">&lt;/</span><span class="nt">html</span><span class="p">&gt;</span></pre></div></div>',1);function et(t,e,n,r,i,c){return Object(a["i"])(),Object(a["c"])("div",G,[Q,tt])}var nt=function(t){Object(j["a"])(n,t);var e=Object(O["a"])(n);function n(){return Object(d["a"])(this,n),e.apply(this,arguments)}return n}(m["b"]);nt=Object(v["a"])([Object(m["a"])({})],nt);var at=nt;at.render=et;var rt=at,it={id:"viewer",style:{padding:"0 1rem"}},ct=Object(a["g"])("h1",null,"Welcome to this page!",-1),st=Object(a["g"])("p",null,"We are just testing some stuff.",-1);function lt(t,e,n,r,i,c){return Object(a["i"])(),Object(a["c"])("div",it,[ct,st])}var ot=function(t){Object(j["a"])(n,t);var e=Object(O["a"])(n);function n(){return Object(d["a"])(this,n),e.apply(this,arguments)}return n}(m["b"]);ot=Object(v["a"])([Object(m["a"])({})],ot);var ut=ot;ut.render=lt;var pt=ut;function ht(t,e){return t.getAttribute("role")===e?t:t.parentElement?ht(t.parentElement,e):null}var bt={methods:{ariaPopupMenuKbd:function(t){if(!t.defaultPrevented){var e=t.target;if(e){var n=ht(e,"menu");if(n){var a=n.getAttribute("aria-labelledby");if(a){var r=document.getElementById(a);if(r){var i=n.querySelectorAll('[role="menuitem"]');if(0!==i.length)switch(t.key){case" ":e.click();break;case"ArrowUp":for(var c=0;c<i.length;c++)if(i[c]===e){0===c?i[i.length-1].focus():i[c-1].focus();break}break;case"ArrowDown":for(var s=0;s<i.length;s++)if(i[s]===e){s===i.length-1?i[0].focus():i[s+1].focus();break}break;case"Home":i[0].focus();break;case"End":i[i.length-1].focus();break;case"Escape":r.click(),r.focus();break}}}}}}}}},ft=function(t){Object(j["a"])(n,t);var e=Object(O["a"])(n);function n(){var t;return Object(d["a"])(this,n),t=e.apply(this,arguments),t.mainMenuShowing=!1,t}return Object(g["a"])(n,[{key:"created",value:function(){var t=this,e=document.querySelector("script#json-blob");e&&(this.$store.dispatch("fetch",window.location.href),this.$store.commit("setPage",JSON.parse(atob(e.innerHTML))),window.addEventListener("popstate",Object(f["a"])(regeneratorRuntime.mark((function e(){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.$store.dispatch("fetch",window.location.href);case 2:n=e.sent,t.$store.commit("setPage",n),document.title=n.tutorial.title.replace("&amp;","&");case 5:case"end":return e.stop()}}),e)})))))}},{key:"navigateTo",value:function(){var t=Object(f["a"])(regeneratorRuntime.mark((function t(e,n){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return n.preventDefault(),t.next=3,this.$store.dispatch("load",e);case 3:case"end":return t.stop()}}),t,this)})));function e(e,n){return t.apply(this,arguments)}return e}()},{key:"toggleMainMenu",value:function(){var t=this;this.mainMenuShowing=!this.mainMenuShowing,this.mainMenuShowing&&this.$nextTick((function(){var e=t.$refs.mainMenu.querySelector("a");e&&e.focus()}))}},{key:"scrolling",get:function(){return this.$store.state.ui.scrolling}},{key:"layout",get:function(){return this.$store.state.metadata&&this.$store.state.metadata.layout?this.$store.state.metadata.layout:"tutorial-only-center"}},{key:"appClasses",get:function(){var t=["layout-"+this.layout];return this.hasAppMenu&&t.push("layout-has-app-menu"),t}},{key:"scrollWidth",get:function(){return this.hasIFrame?"0px":this.$store.state.ui.scrollWidth+"px"}},{key:"hasAppMenu",get:function(){return this.hasAppMenuDownload||this.hasAppMenuJupyterHub}},{key:"hasAppMenuDownload",get:function(){return this.$store.state.metadata["app-menu-download"]&&"true"===this.$store.state.metadata["app-menu-download"].toLowerCase()}},{key:"appMenuDownloadUrl",get:function(){return this.$store.state.urls.prefix?this.$store.state.urls.prefix+"/tutorial/download":"/tutorial/download"}},{key:"appMenuFilesUrl",get:function(){return this.$store.state.urls.prefix?this.$store.state.urls.prefix+"/tree":"/tree"}},{key:"hasAppMenuJupyterHub",get:function(){return this.$store.state.metadata["app-menu-jupyterhub"]&&"true"===this.$store.state.metadata["app-menu-jupyterhub"].toLowerCase()}},{key:"hasTutorial",get:function(){return["tutorial-only","tutorial-only-left","tutorial-only-center","tutorial-only-right","tutorial-iframe"].indexOf(this.layout)>=0}},{key:"hasIFrame",get:function(){return"tutorial-iframe"===this.layout}},{key:"iFrameSrc",get:function(){return this.hasIFrame?this.$store.state.urls.prefix?this.$store.state.urls.prefix+this.$store.state.metadata["iframe-src"]:this.$store.state.metadata["iframe-src"]:""}},{key:"urls",get:function(){return this.$store.state.urls}},{key:"project",get:function(){return this.$store.state.project}}]),n}(m["b"]);ft=Object(v["a"])([Object(m["a"])({components:{Tutorial:Y,Editor:rt,Viewer:pt},mixins:[bt]})],ft);var dt=ft;dt.render=b;var gt=dt,jt=(n("d3b7"),n("25f0"),n("3ca3"),n("ddb0"),n("2b3d"),n("5502")),Ot=n("694b"),vt=n.n(Ot),mt=Object(jt["a"])({state:{metadata:{},project:"",urls:{root:"",static:""},tutorial:{blocks:[],body:"",next:null,prev:null,title:"",withinBlockNav:null},ui:{scrolling:!1,scrollWidth:0}},mutations:{setPage:function(t,e){vt()(t.metadata,e.metadata)||(t.metadata=e.metadata),t.project!==e.project&&(t.project=e.project),vt()(t.urls,e.urls)||(t.urls.root=e.urls.root,t.urls.static=e.urls.static),vt()(t.tutorial,e.tutorial)||(t.tutorial=e.tutorial)},setURLPrefix:function(t,e){t.urls.prefix!==e&&(t.urls.prefix=e)},setScrolling:function(t,e){t.ui.scrolling=e},setScrollWidth:function(t,e){t.ui.scrollWidth=e}},actions:{fetch:function(t){function e(e,n){return t.apply(this,arguments)}return e.toString=function(){return t.toString()},e}((function(t,e){return Object(f["a"])(regeneratorRuntime.mark((function n(){var a,r;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return a=t.commit,e=new URL(e,document.baseURI).href,e=e.replace(".html",".json"),"/"===e.substr(e.length-1)&&(e+="index.json"),n.next=6,fetch(e);case 6:return r=n.sent,(r.headers.get("X-URL-Prefix")||r.headers.get("x-url-prefix"))&&a("setURLPrefix",r.headers.get("X-URL-Prefix")||r.headers.get("x-url-prefix")),n.next=10,r.json();case 10:return n.abrupt("return",n.sent);case 11:case"end":return n.stop()}}),n)})))()})),load:function(t,e){return Object(f["a"])(regeneratorRuntime.mark((function n(){var a,r,i;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return a=t.dispatch,r=t.commit,e=new URL(e,document.baseURI).href,n.prev=2,n.next=5,a("fetch",e);case 5:i=n.sent,history.pushState(null,i.tutorial.title,e),r("setPage",i),document.title=i.tutorial.title.replace("&amp;","&"),n.next=14;break;case 11:n.prev=11,n.t0=n["catch"](2),window.location.href=e;case 14:case"end":return n.stop()}}),n,null,[[2,11]])})))()}},modules:{}});Object(a["b"])(gt).use(mt).mount("#app")}});
//# sourceMappingURL=app.js.map