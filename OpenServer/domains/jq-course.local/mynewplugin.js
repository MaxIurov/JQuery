(function($) {
	$.fn.myNewPlugin = function(options) {
		var settings = $.extend({
			newsOnPage: 7,
			currentPage: 1,
			finished: null
		}, options);
		var currPage = settings.currentPage;
		var jqueryElement = this;
		jqueryElement.filter("div").each( function() {
			var mainDiv = $(jqueryElement);
			getUrlData.get('mocks/news-list.json.php', function (data) {
				var btnPrev = '';
				var btnNext = '';
				var jsonData = JSON.parse(data);
				var stories = [];
				var startIdx = (currPage - 1) * settings.newsOnPage;
				if (startIdx >= jsonData.stories.length) {
					startIdx = jsonData.stories.length - settings.newsOnPage;
				}
				if (startIdx <= 0) {
					btnPrev = 'disabled';
					startIdx = 0;
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
				getUrlData.get("templates/news-item.html", function (templ) {
					var template = Handlebars.compile(templ);
					var html = template(templateData);
					mainDiv.html(html);
					if ($.isFunction(settings.finished)) {
						settings.finished.call(jqueryElement);
					} else {
						return jqueryElement;
					}
				});
			});
		});
	};
}(jQuery));