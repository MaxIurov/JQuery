(function($){
	//custom validator
	$.validator.addMethod("myAlphaNumeric", function (value, element) {
		return /^[a-zA-Z0-9]*$/.test(value);
	},"Must contain only letters or numbers.");
	//navigation accordion
	var navAccordionActive = (function() {
		var navaccordion_active = -1;
		function boyan_get() {
			if (navaccordion_active === -1) {
				for (var i = 0; i < localStorage.length; i++) {
					if (localStorage.key(i).indexOf('navaccordion_active') !== -1) {
						var storData = localStorage.getItem(localStorage.key(i));
						navaccordion_active = Number(storData);
					}
				}
			}
			if (navaccordion_active === -1) {
				//default
				navaccordion_active = 1;
			}
			return navaccordion_active;
		}
		function boyan_set(idx) {
			navaccordion_active = idx;
			localStorage.setItem('navaccordion_active',idx);
		}
		boyan_get();
		return {
			get: function() {
				boyan_get();
				//console.log("na get=",navaccordion_active);
				return navaccordion_active;
			},
			set: function(idx) {
				boyan_set(idx);
				//console.log("na set=",navaccordion_active);
			}
		};
	})();
	//url cache
	var getUrlData = (function() {
		var timeout = application_config.cacheTimeout;
		var cachedUrls = [];
		//cachedUrls array of {url,data,time}
		for (var i = 0; i < localStorage.length; i++) {
			if (localStorage.key(i).indexOf('jqcourse_') !== -1) {
				var cachedUrl = JSON.parse( localStorage.getItem(localStorage.key(i)) );
				cachedUrls.push({url: cachedUrl.url, data: cachedUrl.data, time: cachedUrl.time});
			}
		}
		return {
			get: function(url,callback) {
				var retData;
				for (var j = 0; j < cachedUrls.length; j++) {
					if (cachedUrls[j].url === url) {
						if ((new Date().getTime() - cachedUrls[j].time) < timeout) {
							retData = cachedUrls[j].data;
							callback(retData);
							return;
						}
					}
				}
				if (retData === undefined) {
					$.get(url, function (data) {
						var obj = {url: url, data: data, time: new Date().getTime()};
						localStorage.setItem('jqcourse_' + url, JSON.stringify(obj));
						for (var i = 0; i < cachedUrls.length; i++) {
							if (cachedUrls[i].url === url) {
								cachedUrls.splice(i,1);
							}
						}
						cachedUrls.push(obj);
						callback(data);
					});
				}
				return;
			},
			clear: function() {
				for (var i = 0; i < localStorage.length; i++) {
					if (localStorage.key(i).indexOf('jqcourse_') !== -1) {
						localStorage.removeItem(localStorage.key(i));
					}
				}
			}
		};
	})();

	//MAIN function
	$(document).ready(function() {
		$(".loader").fadeOut("slow");
		//cache selectors
		function Selector_Cache() {
			var collection = {};
			function get_from_cache(selector) {
				if (collection[selector] === undefined) {
					collection[selector] = $(selector);
				}
				return collection[selector];
			}
			function remove_from_cache(selector) {
				delete collection[selector];
			}
			return {
				get: get_from_cache,
				clear: remove_from_cache
			};
		}
		var selectors = new Selector_Cache();
		//get page number from url hash
		function hashChanged() {
			var page_num = 1;
			if (window.location.hash !== '') {
				var hash_num = parseInt(window.location.hash.substring(1));
				if (hash_num > 0) {
					page_num = hash_num;
				}
			}
			getSliderPagination(page_num);
		}
		//build Slider-Pagination plugin
		function getSliderPagination(page_num) {
			//myNewPlugin
			selectors.get("#newsbox").hide();
			selectors.get("#newsbox_loading").show();
			selectors.get("#newsbox").myNewPlugin({
				newsOnPage: application_config.newsPerPage,
				currentPage: page_num,
				pageChange: function(pg_num) {
					window.location.hash = '#' + pg_num;
				},
				getDataFunction: function(url,cbk) {
					getUrlData.get(url,cbk);
				},
				finished: function() {
					selectors.get("#newsbox_loading").fadeOut("slow",function() {
						selectors.get("#newsbox").fadeIn("slow");
					});
				}
			});
		}
		//login/register dialog
		var dialog_LogReg = (function() {
			var logreg_dialog;
			function greetMessage(mes) {
				getUrlData.get("templates/login/greet-register-inlay.html", function (templ) {
					var template = Handlebars.compile(templ);
					var html = template(mes);
					selectors.get("#hlogin").html(html);
				});
			}
			function loginUser() {
				var strMes = logreg_dialog.find("#login #femail").val();
				greetMessage({message: "You are logged in as " + strMes});
				logreg_dialog.dialog("close");
			}
			function registerUser() {
				var strMes = logreg_dialog.find("#register #femail").val();
				greetMessage({message: "Thanks for the registration. You are logged in as " + strMes});
				logreg_dialog.dialog("close");
			}
			return {
				create_dialog: function(templ) {
					logreg_dialog = $('<div></div>').html(templ)
					.dialog({
						modal: true,
						resizable: false,
						title: "Login or Register",
						width: 350
					});
					//validation
					logreg_dialog.find("#login form").validate({
						rules: {
							femail: {
								required: true,
								email: true
							},
							fpass: {
								required: true,
								myAlphaNumeric: true
							}
						},
						messages: {
							femail: "Please enter a valid email address"
						}
					});
					logreg_dialog.find("#register form").validate({
						rules: {
							femail: {
								required: true,
								email: true
							},
							fpass: {
								required: true,
								myAlphaNumeric: true
							},
							fpassrep: {
								required: true,
								myAlphaNumeric: true,
								equalTo: "#register #fpass"
							}
						},
						messages: {
							femail: "Please enter a valid email address"
						}
					});
					//submit
					logreg_dialog.find("#login button").on("click", function (event) {
						event.preventDefault();
						if (logreg_dialog.find("#login form").valid()) {
							loginUser();
						}
					});
					logreg_dialog.find("#register button").on("click" , function (event) {
						event.preventDefault();
						if (logreg_dialog.find("#register form").valid()) {
							registerUser();
						}
					});
				}
			};
		})();
		//search autocomplete
		selectors.get("#searchform").hide();
		selectors.get("#searchform_loading").show();
		getUrlData.get('mocks/search.json.php', function(data) {
			selectors.get("#searchform").find("#pojam").autocomplete({
				source: data.titles,
				select: function(event, ui) {
					selectors.get("#searchform").find("#pojam").val(ui.item.label);
					selectors.get("#searchform").find(".button").click();
					//$("#searchform .search").submit();
				}
			});
			selectors.get("#searchform_loading").fadeOut("slow",function() {
				selectors.get("#searchform").fadeIn("slow");
			});
		});
		//navigation menu
		selectors.get("#navaccordion").hide();
		selectors.get("#navaccordion_loading").show();
		getUrlData.get('mocks/navigation.json.php', function (data) {
			var template = Handlebars.templates['nav-cats'];
			var html = template(data);
			selectors.get("#navaccordion").html(html);
			selectors.get("#navaccordion").accordion({
				heightStyle: "content",
				active: navAccordionActive.get(),
				animate: 200,
				activate: function(event,ui) {
					var active = selectors.get("#navaccordion").accordion( "option", "active" );
					navAccordionActive.set(active);
				}
			});
			selectors.get("#navaccordion_loading").fadeOut("slow",function() {
				selectors.get("#navaccordion").fadeIn("slow");
			});
		});
		//login dialog box
		selectors.get("#hlogin a").click(function (event) {
			event.preventDefault();
			getUrlData.get("templates/login/login-register-overlay.html",function (templ) {
				dialog_LogReg.create_dialog(templ);
			});
		});
		//slider-pagination
		hashChanged();
		window.onhashchange = function () {
			hashChanged();
		}
		//quote service
		// $.ajax({
		// 	url: "http://quote-service.local:60/api.php",
		// 	dataType: "jsonp",
		// 	timeout: 900,
		// 	beforeSend: function() {
		// 		selectors.get("#additional").hide();
		// 		selectors.get("#additional_loading").show();
		// 	},
		// 	success: function(data) {
		// 		var template = Handlebars.templates['lovely-quote'];
		// 		var templateData = template(data);
		// 		selectors.get("#additional").find("#loveluquot").html(templateData);
		// 		selectors.get("#additional_loading").fadeOut("slow",function() {
		// 			selectors.get("#additional").fadeIn("slow");
		// 		});
		// 	},
		// 	error: function(jqXhr, textStatus, errorMessage) {
		// 		selectors.get("#additional").find("#loveluquot").text("Error: " + errorMessage);
		// 		selectors.get("#additional_loading").fadeOut("slow",function() {
		// 			selectors.get("#additional").fadeIn("slow");
		// 		});
		// 	}
		// });
		selectors.get("#additional").hide();
		selectors.get("#additional_loading").show();
		var quoteText = selectors.get("#additional").find("#loveluquot");
		$.ajax({
			url: "http://quote-service.local:60/api.php",
			dataType: "jsonp",
			timeout: 900
		}).done(function(data){
			var template = Handlebars.templates['lovely-quote'];
			var templateData = template(data);
			quoteText.html(templateData);
		}).fail(function(jqXhr, textStatus, errorMessage){
			quoteText.text("Error: " + errorMessage);
		}).always(function(){
			selectors.get("#additional_loading").fadeOut("slow",function() {
				selectors.get("#additional").fadeIn("slow");
			});
		});

	});
})(jQuery);