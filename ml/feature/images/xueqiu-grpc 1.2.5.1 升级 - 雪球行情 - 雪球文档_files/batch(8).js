WRMCB=function(e){var c=console;if(c&&c.log&&c.error){c.log('Error running batched script.');c.error(e);}}
;
try {
/* module-key = 'com.atlassian.confluence.plugins.confluence-request-access-plugin:confluence-request-access-plugin-resources', location = '/js/request-access-util.js' */
define("confluence/request-access/request-access-util",["confluence/legacy"],function(b){var a=function a(c){if(c.length===1){return AJS.format("\u6211\u4eec\u5df2\u8bf7\u6c42{0}\u6388\u4e88\u60a8\u8bbf\u95ee\u6743\u9650\u3002 \u8bf7\u6c42\u901a\u8fc7\u540e\u60a8\u5c06\u4f1a\u6536\u5230\u4e00\u5c01\u90ae\u4ef6\u3002",b.Request.Access.usernameLink({user:c[0]}))}if(c.length===2){return AJS.format("\u6211\u4eec\u5df2\u7ecf\u8bf7\u6c42{0}\u548c{1}\u6388\u4e88\u60a8\u8bbf\u95ee\u6743\u9650\u3002 \u8bf7\u6c42\u901a\u8fc7\u540e\u60a8\u5c06\u4f1a\u6536\u5230\u4e00\u5c01\u90ae\u4ef6\u3002",b.Request.Access.usernameLink({user:c[0]}),b.Request.Access.usernameLink({user:c[1]}))}if(c.length===3){return AJS.format("\u6211\u4eec\u5df2\u7ecf\u8bf7\u6c42{0}\u3001{1}\u548c\u53e6\u5916\u4e00\u4f4d\u7528\u6237\u6388\u4e88\u60a8\u8bbf\u95ee\u6743\u9650\u3002 \u8bf7\u6c42\u901a\u8fc7\u540e\u60a8\u5c06\u4f1a\u6536\u5230\u4e00\u5c01\u90ae\u4ef6\u3002",b.Request.Access.usernameLink({user:c[0]}),b.Request.Access.usernameLink({user:c[1]}))}return AJS.format("\u6211\u4eec\u5df2\u7ecf\u8bf7\u6c42{0}\u3001{1}\u548c\u53e6\u5916{2}\u4f4d\u7528\u6237\u6388\u4e88\u60a8\u8bbf\u95ee\u6743\u9650\u3002 \u8bf7\u6c42\u901a\u8fc7\u540e\u60a8\u4f1a\u6536\u5230\u4e00\u5c01\u90ae\u4ef6\u3002",b.Request.Access.usernameLink({user:c[0]}),b.Request.Access.usernameLink({user:c[1]}),c.length-2)};return{messageBody:a}});
}catch(e){WRMCB(e)};
;
try {
/* module-key = 'com.atlassian.confluence.plugins.confluence-request-access-plugin:confluence-request-access-plugin-resources', location = '/js/request-access-page.js' */
require(["ajs","jquery","confluence/legacy","confluence/meta","confluence/request-access/request-access-util"],function(a,d,e,b,c){a.toInit(function(){var g=b.get("page-id");var f=b.get("remote-user");var k=d(".request-access-container");var j=d(".request-access-container button");var i=j.data("access-type");var h=d("#invite-to-edit-draft").length;if(h){g=d("#invite-to-edit-draft").data("draft-id")}if(k.length){d("#breadcrumbs").hide();d("#title-text.with-breadcrumbs").hide();if(j.length){a.trigger("analyticsEvent",{name:"confluence.request.access.plugin.request.access.to.page.view",data:{pageId:g,requestAccessUser:f,accessType:i}})}}j.prop("disabled",false);j.removeAttr("aria-disabled");j.click(function(){a.trigger("analyticsEvent",{name:"confluence.request.access.plugin.request.access.to.page",data:{pageId:g,requestAccessUser:f,accessType:i}});j.attr("aria-disabled","true");var l=d(e.Request.Access.loading({}));j.replaceWith(l);d.ajax({url:e.getContextPath()+"/rest/access/latest/page/restriction/"+g+"/request/"+i,type:"POST",contentType:"application/json; charset=utf-8",success:function(m){if(m.users.length===0){a.flag({type:"error",title:"\u8bbf\u95ee\u8bf7\u6c42\u5931\u8d25",body:"\u60a8\u7684\u8bbf\u95ee\u8bf7\u6c42\u672a\u53d1\u9001\u3002\u8054\u7cfb\u60a8\u7684\u7a7a\u95f4\u7ba1\u7406\u5458\u3002"});return}a.flag({type:"success",title:"\u8bf7\u6c42\u5df2\u53d1\u9001",body:c.messageBody(m.users)})},error:function(m,n){a.flag({type:"error",title:"\u8bbf\u95ee\u8bf7\u6c42\u5931\u8d25",body:"\u60a8\u7684\u8bbf\u95ee\u8bf7\u6c42\u672a\u53d1\u9001\u3002\u8054\u7cfb\u60a8\u7684\u7a7a\u95f4\u7ba1\u7406\u5458\u3002"})},complete:function(){l.remove();e.Binder.userHover()}})})})});
}catch(e){WRMCB(e)};
;
try {
/* module-key = 'com.atlassian.confluence.plugins.confluence-request-access-plugin:confluence-request-access-plugin-resources', location = '/js/request-edit-access-dialog.js' */
require(["ajs","jquery","confluence/legacy","confluence/meta","confluence/request-access/request-access-util"],function(a,d,e,b,c){a.toInit(function(){var f=WRM.data.claim("com.atlassian.confluence.plugins.confluence-request-access-plugin:confluence-request-access-plugin-resources.mail-server-configured");var m=d("#system-content-items");var o=d("#content-metadata-page-restrictions.restricted").length!==0;var i=b.get("page-id");var j=b.get("remote-user");if(!m.length||!o||d("#editPageLink").length||!k()){return}var l=d(e.Request.Access.loading());var g=a.InlineDialog(m,"requestAccessDialog",h,n());function h(q,p,r){q.css({padding:"20px"}).html(e.Request.Access.dialog({canRequestAccess:f&&j}));q.on("click","#request-access-dialog-button",function(u){u.stopPropagation();var s=q.find(".actions-result");s.replaceWith(l);a.trigger("analyticsEvent",{name:"confluence.request.access.plugin.request.access.to.page",data:{pageId:i,requestAccessUser:j,accessType:"edit"}});var t="";d.ajax({url:e.getContextPath()+"/rest/access/latest/page/restriction/"+i+"/request/edit",type:"POST",contentType:"application/json; charset=utf-8",data:j,success:function(v){if(v.users.length===0){a.flag({type:"error",title:"\u8bbf\u95ee\u8bf7\u6c42\u5931\u8d25",body:"\u60a8\u7684\u8bbf\u95ee\u8bf7\u6c42\u672a\u53d1\u9001\u3002\u8054\u7cfb\u60a8\u7684\u7a7a\u95f4\u7ba1\u7406\u5458\u3002"});return}a.flag({type:"success",title:"\u8bf7\u6c42\u5df2\u53d1\u9001",body:c.messageBody(v.users)})},error:function(v){if(v.status==412){t="\u8bbf\u95ee\u88ab\u6388\u6743\uff0c\u4f46\u662f\u6ca1\u6709\u914d\u7f6e\u7684\u90ae\u4ef6\u670d\u52a1\u5668\u6240\u4ee5\u4e0d\u80fd\u53d1\u9001\u901a\u77e5\u3002"}else{if(v.status==502){t="\u8bbf\u95ee\u88ab\u5141\u8bb8\uff0c\u4f46\u662f\u5728\u53d1\u9001\u901a\u77e5\u7684\u65f6\u5019\u51fa\u73b0\u4e86\u4e00\u4e2a\u610f\u5916\u9519\u8bef\u3002"}else{t="\u5f88\u62b1\u6b49\uff0c\u5728\u6388\u6743\u8bbf\u95ee\u7684\u65f6\u5019\u51fa\u73b0\u4e86\u4e00\u4e2a\u610f\u5916\u7684\u9519\u8bef\u3002"}}a.flag({type:"error",title:"\u8bbf\u95ee\u8bf7\u6c42\u5931\u8d25",body:t})},complete:function(){l.remove();g.hide()}})});q.on("click",".aui-button.cancel",function(s){g.hide()});r();return false}function n(){return{offsetY:2,offsetX:0,width:350,hideDelay:null,noBind:true,hideCallback:function(){setTimeout(g.hide(),5000)}}}function k(){var p=window.location.search.match(/[\?&]requestEditAccess=/);return !!(p&&p.length)}g.show()})});
}catch(e){WRMCB(e)};
;
try {
/* module-key = 'com.atlassian.confluence.plugins.confluence-request-access-plugin:confluence-request-access-plugin-resources', location = '/js/grant-access.js' */
require(["ajs","jquery","confluence/legacy","confluence/meta"],function(a,c,d,b){a.toInit(function(){var e=b.get("page-id");var i=b.get("remote-user");var o=r("username");var h=r("accessType");var g=r("userFullName");var k=c("#system-content-items");var s=c("#content-metadata-page-restrictions.restricted").length!==0;var j=c("#rte-button-restrictions");var m=n()&&j.length&&r("grantAccess")&&h;var q=k.length&&s&&r("grantAccess")&&h;if(!q&&!m){return}if(m){k=j;e=b.get("draft-id")}var f=c(d.Request.Access.loading());var p=a.InlineDialog(k,"grantAccessDialog",function(u,t,v){u.css({padding:"20px"}).html(d.Grant.Access.dialog({requestAccessUsername:o,requestAccessUserFullName:g,requestAccessType:h,contentType:b.get("content-type")}));u.on("click",".aui-button.grant-access",function(z){z.stopPropagation();var y=u.find(".actions-result");y.replaceWith(f);a.trigger("analyticsEvent",{name:"confluence.request.access.plugin.grant.access.to.page",data:{pageId:e,grantAccessUser:i,requestAccessUser:o,accessType:h}});var x="";var w="";c.ajax({url:d.getContextPath()+"/rest/access/latest/page/restriction/"+e+"/grant/"+h,type:"POST",contentType:"application/json; charset=utf-8",data:o,success:function(B,C,A){if(A.status===202){x="\u91cd\u8981\u7684\u662f\u601d\u60f3\u3002";w="\u6709\u4eba\u5df2\u7ecf\u6388\u4e88\u8fc7\u8be5\u4eba\u8bbf\u95ee\u6743\u9650\u3002"}else{x="\u51c6\u4e88\u8bbf\u95ee\u8bf7\u6c42";w="\u6211\u4eec\u4f1a\u901a\u77e5\u4ed6\u4eec\u8be5\u8bf7\u6c42\u5df2\u901a\u8fc7\u3002"}a.flag({type:"success",title:x,body:w})},error:function(A){if(A.status===412){w="\u8bbf\u95ee\u88ab\u6388\u6743\uff0c\u4f46\u662f\u6ca1\u6709\u914d\u7f6e\u7684\u90ae\u4ef6\u670d\u52a1\u5668\u6240\u4ee5\u4e0d\u80fd\u53d1\u9001\u901a\u77e5\u3002"}else{if(A.status===502){w="\u8bbf\u95ee\u88ab\u5141\u8bb8\uff0c\u4f46\u662f\u5728\u53d1\u9001\u901a\u77e5\u7684\u65f6\u5019\u51fa\u73b0\u4e86\u4e00\u4e2a\u610f\u5916\u9519\u8bef\u3002"}else{w="\u5f88\u62b1\u6b49\uff0c\u5728\u6388\u6743\u8bbf\u95ee\u7684\u65f6\u5019\u51fa\u73b0\u4e86\u4e00\u4e2a\u610f\u5916\u7684\u9519\u8bef\u3002"}}a.flag({type:"error",title:"\u8bbf\u95ee\u8bf7\u6c42\u9519\u8bef",body:w})},complete:function(){p.hide()}})});u.on("click",".aui-button.deny-access",function(){a.trigger("analyticsEvent",{name:"confluence.request.access.plugin.deny.access.to.page",data:{pageId:e,grantAccessUser:i,requestAccessUser:o,accessType:h}});p.hide()});v();return false},{offsetY:2,offsetX:0,width:350,hideDelay:null,noBind:true,hideCallback:function(){setTimeout(p.hide(),5000)}});l(e,o,h).done(function(t){if(t.hasPermission){a.flag({type:"success",title:"\u91cd\u8981\u7684\u662f\u601d\u60f3\u3002",body:"\u6709\u4eba\u5df2\u7ecf\u6388\u4e88\u8fc7\u8be5\u4eba\u8bbf\u95ee\u6743\u9650\u3002"})}else{p.show()}}).fail(function(t){console.error("Was unable to check current user permission",t);p.show()});function r(t){t=t.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var v=new RegExp("[\\?&]"+t+"=([^&#]*)"),u=v.exec(location.search);return u==null?"":decodeURIComponent(u[1].replace(/\+/g," "))}function l(t,v,u){return c.ajax({url:d.getContextPath()+"/rest/access/latest/page/restriction/"+t+"/check/"+u,data:{username:v},type:"GET",contentType:"application/json; charset=utf-8"})}function n(){return a.Rte&&a.Rte.getEditor()&&(!!a.$("#editpageform").length||!!a.$("#createpageform").length)}})});
}catch(e){WRMCB(e)};
;
try {
/* module-key = 'com.atlassian.confluence.plugins.confluence-request-access-plugin:confluence-request-access-plugin-resources', location = '/templates/soy/request-access.soy' */
// This file was automatically generated from request-access.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace Confluence.Request.Access.
 */

if (typeof Confluence == 'undefined') { var Confluence = {}; }
if (typeof Confluence.Request == 'undefined') { Confluence.Request = {}; }
if (typeof Confluence.Request.Access == 'undefined') { Confluence.Request.Access = {}; }


Confluence.Request.Access.usernameLink = function(opt_data, opt_ignored) {
  return '<a href="' + soy.$$escapeHtml("") + '/display/~' + soy.$$escapeUri(opt_data.user.name) + '" class="url fn confluence-userlink" title data-username="' + soy.$$escapeHtml(opt_data.user.name) + '">' + soy.$$escapeHtml(opt_data.user.fullName) + '</a>';
};
if (goog.DEBUG) {
  Confluence.Request.Access.usernameLink.soyTemplateName = 'Confluence.Request.Access.usernameLink';
}


Confluence.Request.Access.loading = function(opt_data, opt_ignored) {
  return '<span id="request-access-loading" class=\'aui-icon aui-icon-wait\'>' + soy.$$escapeHtml('\u6b63\u5728\u52a0\u8f7d\uff0c\u8bf7\u7a0d\u5019') + '</span>"';
};
if (goog.DEBUG) {
  Confluence.Request.Access.loading.soyTemplateName = 'Confluence.Request.Access.loading';
}


Confluence.Request.Access.dialog = function(opt_data, opt_ignored) {
  return '<div class="request-access-dialog"><h2 class="grant-access-title">' + soy.$$escapeHtml('\u60a8\u6ca1\u6709\u7f16\u8f91\u6743\u9650') + '</h2>' + ((opt_data.canRequestAccess) ? '<p class="grant-access-message">' + soy.$$escapeHtml('\u70b9\u51fb\u8bf7\u6c42\u8bbf\u95ee\uff0c\u6211\u4eec\u5c06\u5bfb\u627e\u53ef\u4ee5\u6388\u4e88\u60a8\u8bbf\u95ee\u6743\u9650\u7684\u4eba\u3002') + '</p><div class="actions-result"><button id="request-access-dialog-button" class="aui-button">' + soy.$$escapeHtml('\u8bf7\u6c42\u8bbf\u95ee') + '</button><button class="aui-button aui-button-link cancel">' + soy.$$escapeHtml('\u53d6\u6d88') + '</button><div>' : '<p class="grant-access-message">' + soy.$$escapeHtml('\u7a7a\u95f4\u7ba1\u7406\u5458\u6216\u5206\u4eab\u6b64\u9875\u9762\u7684\u4eba\u53ef\u4ee5\u6388\u4e88\u60a8\u8bbf\u95ee\u6743\u9650\u3002') + '</p><div class="actions-result"><button class="aui-button aui-button-link cancel">' + soy.$$escapeHtml('\u53d6\u6d88') + '</button><div>') + '</div>';
};
if (goog.DEBUG) {
  Confluence.Request.Access.dialog.soyTemplateName = 'Confluence.Request.Access.dialog';
}

}catch(e){WRMCB(e)};
;
try {
/* module-key = 'com.atlassian.confluence.plugins.confluence-request-access-plugin:confluence-request-access-plugin-resources', location = '/templates/soy/grant-access.soy' */
// This file was automatically generated from grant-access.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace Confluence.Grant.Access.
 */

if (typeof Confluence == 'undefined') { var Confluence = {}; }
if (typeof Confluence.Grant == 'undefined') { Confluence.Grant = {}; }
if (typeof Confluence.Grant.Access == 'undefined') { Confluence.Grant.Access = {}; }


Confluence.Grant.Access.dialog = function(opt_data, opt_ignored) {
  var output = '<div class="grant-access-dialog">';
  var usernameLink__soy4 = '' + Confluence.Grant.Access.usernameLink({username: opt_data.requestAccessUsername, userFullName: opt_data.requestAccessUserFullName});
  var requestAccessDescription__soy8 = '' + ((opt_data.requestAccessType == 'edit') ? (opt_data.contentType == 'blogpost') ? soy.$$filterNoAutoescape(AJS.format('{0} \u60f3\u8981\x3cstrong\x3e\u7f16\u8f91\x3c/strong\x3e\u8fd9\u7bc7\u535a\u5ba2\u3002',usernameLink__soy4)) : soy.$$filterNoAutoescape(AJS.format('{0} \u60f3\u8981\x3cstrong\x3e\u7f16\u8f91\x3c/strong\x3e\u8fd9\u4e2a\u9875\u9762\u3002',usernameLink__soy4)) : (opt_data.contentType == 'blogpost') ? soy.$$filterNoAutoescape(AJS.format('{0} \u60f3\u8981\x3cstrong\x3e\u67e5\u770b\x3c/strong\x3e\u8fd9\u7bc7\u535a\u5ba2\u3002',usernameLink__soy4)) : soy.$$filterNoAutoescape(AJS.format('{0} \u60f3\u8981\x3cstrong\x3e\u67e5\u770b\x3c/strong\x3e\u8fd9\u4e2a\u9875\u9762\u3002',usernameLink__soy4)));
  output += '<h2 class="title grant-access-title">' + soy.$$escapeHtml('\u8bbf\u95ee\u8bf7\u6c42') + '</h2><p class="grant-access-message">' + soy.$$filterNoAutoescape(requestAccessDescription__soy8) + '</p><div class="actions-result"><button class="aui-button grant-access">' + soy.$$escapeHtml('\u6388\u6743\u8bbf\u95ee') + '</button><button class="aui-button aui-button-link deny-access">' + soy.$$escapeHtml('\u963b\u6b62') + '</button><div></div>';
  return output;
};
if (goog.DEBUG) {
  Confluence.Grant.Access.dialog.soyTemplateName = 'Confluence.Grant.Access.dialog';
}


Confluence.Grant.Access.usernameLink = function(opt_data, opt_ignored) {
  return '<a href="' + soy.$$escapeHtml("") + '/display/~' + soy.$$escapeHtml(opt_data.username) + '" class="url fn" title data-username="' + soy.$$escapeHtml(opt_data.username) + '"><strong>' + soy.$$escapeHtml(opt_data.userFullName) + '</strong> (' + soy.$$escapeHtml(opt_data.username) + ')</a>';
};
if (goog.DEBUG) {
  Confluence.Grant.Access.usernameLink.soyTemplateName = 'Confluence.Grant.Access.usernameLink';
}

}catch(e){WRMCB(e)};