(function($) {
	$.fn.myNewPlugin = function(options) {
		var settings = $.extend({
			newsOnPage: 7,
			currentPage: 1,
			getDataFunction: null,
			pageChange: null,
			finished: null
		}, options);
		//settings.getDataFunction interface should be function("get url", callback)
		if ($.isFunction(settings.getDataFunction)) {
			var currPage = settings.currentPage;
			var jqueryElement = this;
			jqueryElement.filter("div").each( function() {
				var mainDiv = $(jqueryElement);
				settings.getDataFunction('mocks/news-list.json.php', function (data) {
					var btnPrev = '';
					var btnNext = '';
					var jsonData = JSON.parse(data);
					var stories = [];
					var startIdx = (currPage - 1) * settings.newsOnPage;
					if (startIdx >= jsonData.stories.length) {
						startIdx = jsonData.stories.length - settings.newsOnPage;
						currPage = Math.floor(jsonData.stories.length / settings.newsOnPage) + 1;
					}
					if (startIdx <= 0) {
						btnPrev = 'disabled';
						startIdx = 0;
						currPage = 1;
					}
					var endIdx = startIdx + settings.newsOnPage - 1;
					if (endIdx >= jsonData.stories.length) {
						endIdx = jsonData.stories.length - 1;
						btnNext = 'disabled';
					}
					for (var i = startIdx; i <= endIdx; i++) {
						var numTime = Number(jsonData.stories[i].submit_date);
						jsonData.stories[i].submit_date = $.datepicker.formatDate('dd M yy', new Date(numTime * 1000));
						stories.push(jsonData.stories[i]);
					}
					var templateData = {
						page: currPage,
						pagePrev: currPage - 1,
						pageNext: currPage + 1,
						buttPrev: btnPrev,
						buttNext: btnNext,
						stories: stories
					};
					settings.getDataFunction("templates/news-item.html", function (templ) {
						//no Handlebars precompile. i did that for other templates
						var template = Handlebars.compile(templ);
						var html = template(templateData);
						mainDiv.html(html);
						//attach button click evets
						function prevnextClick(event) {
							event.preventDefault();
							if ($.isFunction(settings.pageChange)) {
								settings.pageChange(event.data.new_page);
							} else {
								window.location.hash = '#' + event.data.new_page;
							}
						}
						mainDiv.find("#prev button").on("click",{new_page: templateData.pagePrev}, prevnextClick);
						mainDiv.find("#next button").on("click",{new_page: templateData.pageNext}, prevnextClick);
						//notify im finished
						if ($.isFunction(settings.finished)) {
							settings.finished.call(jqueryElement);
						} else {
							return jqueryElement;
						}
					});
				});
			});
		}
		return null;
	};
}(jQuery));