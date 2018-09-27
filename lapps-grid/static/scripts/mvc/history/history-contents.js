define(["mvc/history/history-content-model","mvc/history/hda-model","mvc/history/hdca-model","mvc/dataset/states","mvc/base-mvc","utils/localization"],function(a,b,c,d,e){"use strict";var f="history",g=Backbone.Collection.extend(e.LoggableMixin).extend({_logNamespace:f,model:function(a,d){if("dataset"===a.history_content_type)return new b.HistoryDatasetAssociation(a,d);if("dataset_collection"===a.history_content_type){switch(a.collection_type){case"list":return new c.HistoryListDatasetCollection(a,d);case"paired":return new c.HistoryPairDatasetCollection(a,d);case"list:paired":return new c.HistoryListPairedDatasetCollection(a,d);case"list:list":return new c.HistoryListOfListsDatasetCollection(a,d)}var e="Unknown collection_type: "+a.collection_type;return console.warn(e,a),{validationError:e}}return{validationError:"Unknown history_content_type: "+a.history_content_type}},initialize:function(a,b){b=b||{},this.historyId=b.historyId,this.model.prototype.idAttribute="type_id",this.on("all",function(){this.debug(this+".event:",arguments)})},urlRoot:Galaxy.root+"api/histories",url:function(){return this.urlRoot+"/"+this.historyId+"/contents"},ids:function(){return this.map(function(a){return a.get("id")})},notReady:function(){return this.filter(function(a){return!a.inReadyState()})},running:function(){function a(a){return!a.inReadyState()}return new g(this.filter(a))},getByHid:function(a){return _.first(this.filter(function(b){return b.get("hid")===a}))},getVisible:function(a,b,c){c=c||[],this.debug("checking isVisible");var d=new g(this.filter(function(c){return c.isVisible(a,b)}));return _.each(c,function(a){_.isFunction(a)&&(d=new g(d.filter(a)))}),d},hidden:function(){function a(a){return a.hidden()}return new g(this.filter(a))},deleted:function(){function a(a){return a.get("deleted")}return new g(this.filter(a))},visibleAndUndeleted:function(){function a(a){return a.get("visible")&&!a.get("deleted")}return new g(this.filter(a))},haveDetails:function(){return this.all(function(a){return a.hasDetails()})},fetch:function(a){return a=a||{},a.data=_.defaults(a.data||{},{v:"dev"}),Backbone.Collection.prototype.fetch.call(this,a)},fetchUpdated:function(a,b){return b=b||{},b.traditional=!0,b.data=[{name:"v",value:"dev"}],a&&(b.data=b.data.concat(this._filtersFromMap({"update_time-ge":a.toISOString()}))),b.merge=!0,b.remove=!1,this.fetch(b)},_filtersFromMap:function(a){var b=[];return _.each(a,function(a,c){b.push({name:"q",value:c}),b.push({name:"qv",value:a})}),b},fetchAllDetails:function(a){a=a||{};var b={details:"all"};return a.data=a.data?_.extend(a.data,b):b,this.fetch(a)},fetchCollectionCounts:function(a){return a=a||{},a.data=_.defaults({keys:["type_id","element_count"].join(","),q:"history_content_type",qv:"dataset_collection"},a.data||{}),a.merge=!0,a.remove=!1,this.fetch(a)},ajaxQueue:function(a,b){var c=jQuery.Deferred(),d=this.length,e=[];if(!d)return c.resolve([]),c;var f=this.chain().reverse().map(function(g,h){return function(){var i=a.call(g,b);i.done(function(a){c.notify({curr:h,total:d,response:a,model:g})}),i.always(function(a){e.push(a),f.length?f.shift()():c.resolve(e)})}}).value();return f.shift()(),c},isCopyable:function(a){var b=["HistoryDatasetAssociation","HistoryDatasetCollectionAssociation"];return _.isObject(a)&&a.id&&_.contains(b,a.model_class)},copy:function(a){var b,c,d;_.isString(a)?(b=a,d="hda",c="dataset"):(b=a.id,d={HistoryDatasetAssociation:"hda",LibraryDatasetDatasetAssociation:"ldda",HistoryDatasetCollectionAssociation:"hdca"}[a.model_class]||"hda",c="hdca"===d?"dataset_collection":"dataset");var e=this,f=jQuery.ajax(this.url(),{method:"POST",contentType:"application/json",data:JSON.stringify({content:b,source:d,type:c})}).done(function(a){e.add([a])}).fail(function(){e.trigger("error",e,f,{},"Error copying contents",{type:c,id:b,source:d})});return f},matches:function(a){return this.filter(function(b){return b.matches(a)})},createHDCA:function(a,b,d){var e=this,f={list:c.HistoryListDatasetCollection,paired:c.HistoryPairDatasetCollection},g=new f[b]({history_id:this.historyId,name:d,element_identifiers:a});return g.save().done(function(){e.add(g)}).fail(function(a,b,c){e.trigger("error",a,b,c)})},clone:function(){var a=Backbone.Collection.prototype.clone.call(this);return a.historyId=this.historyId,a},print:function(){var a=this;a.each(function(b){a.debug(b),b.elements&&a.debug("	 elements:",b.elements)})},toString:function(){return["HistoryContents(",[this.historyId,this.length].join(),")"].join("")}});return{HistoryContents:g}});
//# sourceMappingURL=../../../maps/mvc/history/history-contents.js.map