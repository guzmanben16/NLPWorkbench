define(["mvc/base-mvc","utils/localization"],function(a){"use strict";var b="list",c=Backbone.View.extend(a.LoggableMixin).extend({_logNamespace:b,initialize:function(a){this.expanded=a.expanded||!1,this.log("	 expanded:",this.expanded),this.fxSpeed=void 0!==a.fxSpeed?a.fxSpeed:this.fxSpeed},fxSpeed:"fast",render:function(a){var b=this._buildNewRender();return this._setUpBehaviors(b),this._queueNewRender(b,a),this},_buildNewRender:function(){var a=$(this.templates.el(this.model.toJSON(),this));return this.expanded&&this.$details(a).replaceWith(this._renderDetails().show()),a},_queueNewRender:function(a,b){b=void 0===b?this.fxSpeed:b;var c=this;$(c).queue("fx",[function(a){this.$el.fadeOut(b,a)},function(b){c._swapNewRender(a),b()},function(a){this.$el.fadeIn(b,a)},function(a){this.trigger("rendered",c),a()}])},_swapNewRender:function(a){return this.$el.empty().attr("class",_.isFunction(this.className)?this.className():this.className).append(a.children())},_setUpBehaviors:function(a){a=a||this.$el,a.find("[title]").tooltip({placement:"bottom"})},$details:function(a){return a=a||this.$el,a.find("> .details")},_renderDetails:function(){var a=$(this.templates.details(this.model.toJSON(),this));return this._setUpBehaviors(a),a},toggleExpanded:function(a){return a=void 0===a?!this.expanded:a,a?this.expand():this.collapse(),this},expand:function(){var a=this;return a._fetchModelDetails().always(function(){a._expand()})},_fetchModelDetails:function(){return this.model.hasDetails()?jQuery.when():this.model.fetch()},_expand:function(){var a=this,b=a._renderDetails();a.$details().replaceWith(b),a.expanded=!0,a.$details().slideDown({duration:a.fxSpeed,step:function(){a.trigger("expanding",a)},complete:function(){a.trigger("expanded",a)}})},collapse:function(){this.debug(this+"(ExpandableView).collapse");var a=this;a.expanded=!1,this.$details().slideUp({duration:a.fxSpeed,step:function(){a.trigger("collapsing",a)},complete:function(){a.trigger("collapsed",a)}})}}),d=c.extend(a.mixin(a.SelectableViewMixin,a.DraggableViewMixin,{tagName:"div",className:"list-item",initialize:function(b){c.prototype.initialize.call(this,b),a.SelectableViewMixin.initialize.call(this,b),a.DraggableViewMixin.initialize.call(this,b),this._setUpListeners()},_setUpListeners:function(){return this.on("selectable",function(a){a?this.$(".primary-actions").hide():this.$(".primary-actions").show()},this),this},_buildNewRender:function(){var a=c.prototype._buildNewRender.call(this);return a.children(".warnings").replaceWith(this._renderWarnings()),a.children(".title-bar").replaceWith(this._renderTitleBar()),a.children(".primary-actions").append(this._renderPrimaryActions()),a.find("> .title-bar .subtitle").replaceWith(this._renderSubtitle()),a},_swapNewRender:function(a){return c.prototype._swapNewRender.call(this,a),this.selectable&&this.showSelector(0),this.draggable&&this.draggableOn(),this.$el},_renderWarnings:function(){var a=this,b=$('<div class="warnings"></div>'),c=a.model.toJSON();return _.each(a.templates.warnings,function(d){b.append($(d(c,a)))}),b},_renderTitleBar:function(){return $(this.templates.titleBar(this.model.toJSON(),this))},_renderPrimaryActions:function(){return[]},_renderSubtitle:function(){return $(this.templates.subtitle(this.model.toJSON(),this))},events:{"click .title-bar":"_clickTitleBar","keydown .title-bar":"_keyDownTitleBar","click .selector":"toggleSelect"},_clickTitleBar:function(a){a.stopPropagation(),a.altKey?(this.toggleSelect(a),this.selectable||this.showSelector()):this.toggleExpanded()},_keyDownTitleBar:function(a){var b=32,c=13;return!a||"keydown"!==a.type||a.keyCode!==b&&a.keyCode!==c?!0:(this.toggleExpanded(),a.stopPropagation(),!1)},toString:function(){var a=this.model?this.model+"":"(no model)";return"ListItemView("+a+")"}}));d.prototype.templates=function(){var b=a.wrapTemplate(['<div class="list-element">','<div class="warnings"></div>','<div class="selector">','<span class="fa fa-2x fa-square-o"></span>',"</div>",'<div class="primary-actions"></div>','<div class="title-bar"></div>','<div class="details"></div>',"</div>"]),c={},d=a.wrapTemplate(['<div class="title-bar clear" tabindex="0">','<span class="state-icon"></span>','<div class="title">','<span class="name"><%- element.name %></span>',"</div>",'<div class="subtitle"></div>',"</div>"],"element"),e=a.wrapTemplate(['<div class="subtitle"></div>']),f=a.wrapTemplate(['<div class="details"></div>']);return{el:b,warnings:c,titleBar:d,subtitle:e,details:f}}();var e=d.extend({foldoutStyle:"foldout",foldoutPanelClass:null,initialize:function(a){"drilldown"===this.foldoutStyle&&(this.expanded=!1),this.foldoutStyle=a.foldoutStyle||this.foldoutStyle,this.foldoutPanelClass=a.foldoutPanelClass||this.foldoutPanelClass,d.prototype.initialize.call(this,a),this.foldout=this._createFoldoutPanel()},_renderDetails:function(){if("drilldown"===this.foldoutStyle)return $();var a=d.prototype._renderDetails.call(this);return this._attachFoldout(this.foldout,a)},_createFoldoutPanel:function(){var a=this.model,b=this._getFoldoutPanelClass(a),c=this._getFoldoutPanelOptions(a),d=new b(_.extend(c,{model:a}));return d},_getFoldoutPanelClass:function(){return this.foldoutPanelClass},_getFoldoutPanelOptions:function(){return{foldoutStyle:this.foldoutStyle,fxSpeed:this.fxSpeed}},_attachFoldout:function(a,b){return b=b||this.$("> .details"),this.foldout=a.render(0),a.$("> .controls").hide(),b.append(a.$el)},expand:function(){var a=this;return a._fetchModelDetails().always(function(){"foldout"===a.foldoutStyle?a._expand():"drilldown"===a.foldoutStyle&&a._expandByDrilldown()})},_expandByDrilldown:function(){var a=this;a.listenTo(a.foldout,"close",function(){a.trigger("collapsed:drilldown",a,a.foldout)}),a.trigger("expanded:drilldown",a,a.foldout)}});return e.prototype.templates=function(){var b=a.wrapTemplate(['<div class="details">',"</div>"],"collection");return _.extend({},d.prototype.templates,{details:b})}(),{ExpandableView:c,ListItemView:d,FoldoutListItemView:e}});
//# sourceMappingURL=../../../maps/mvc/list/list-item.js.map