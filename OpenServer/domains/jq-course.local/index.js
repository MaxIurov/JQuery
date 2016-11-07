//custom validator
$.validator.addMethod("myAlphaNumeric", function (value, element) {
	return /^[a-zA-Z0-9]*$/.test(value);
},"Must contain only letters or numbers.");
//login/register dialog
var dialog_LogReg = (function() {
	var logreg_dialog;
	function greetMessage(mes) {
		$.get("templates/login/greet-register-inlay.html", function (templ) {
			var template = Handlebars.compile(templ);
			var html = template(mes);
			$("#hlogin").html(html);
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
				} else {
					//alert("invalid!!")
				}
			});
			logreg_dialog.find("#register button").on("click" , function (event) {
				event.preventDefault();
				if (logreg_dialog.find("#register form").valid()) {
					registerUser();
				} else {
					//alert("invalid!!")
				}
			});
		}
	};
})();
//navigation accordion
var navAccordionActive = (function() {
	var navaccordion_active = -1;
	return {
		get: function() {
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
		},
		set: function(idx) {
			navaccordion_active = idx;
			localStorage.setItem('navaccordion_active',idx);
		}
	};
})();
function getSliderPagination(page_num) {
	//myNewPlugin
	$("#newsbox").hide();
	$("#newsbox_loading").show();
	$("#newsbox").myNewPlugin({
		newsOnPage: application_config.newsPerPage,
		currentPage: page_num,
		finished: function() {
			$("#newsbox_loading").fadeOut("slow",function() {
				$("#newsbox").fadeIn("slow");
			});
		}
	});
}
function buttonGotoPage(page_num) {
	window.location.hash = '#' + page_num;
	//getSliderPagination(page_num);
}
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
//url cache
var getUrlData = (function() {
	var timeout = 20000;
	var cachedUrls = [];
	//{url,data,time}
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
	//search autocomplete
	$("#searchform").hide();
	$("#searchform_loading").show();
	getUrlData.get('mocks/search.json.php', function(data) {
		$("#searchform #pojam").autocomplete({
			source: data.titles,
			select: function(event, ui) {
				$("#searchform #pojam").val(ui.item.label);
				$("#searchform .button").click();
				//$("#searchform .search").submit();
			}
		});
		$("#searchform_loading").fadeOut("slow",function() {
			$("#searchform").fadeIn("slow");
		});
	});
	//navigation menu
	$("#navaccordion").hide();
	$("#navaccordion_loading").show();
	getUrlData.get('mocks/navigation.json.php', function (data) {
		var template = Handlebars.templates['nav-cats'];
		var html = template(data);
		$("#navaccordion").html(html);
		$("#navaccordion").accordion({
			heightStyle: "content",
			active: navAccordionActive.get(),
			animate: 200,
			activate: function(event,ui) {
				var active = $( "#navaccordion" ).accordion( "option", "active" );
				navAccordionActive.set(active);
			}
		});
		$("#navaccordion_loading").fadeOut("slow",function() {
			$("#navaccordion").fadeIn("slow");
		});
	});
	//login dialog box
	$("#hlogin a").click(function (event) {
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
	$.ajax({
		url: "http://quote-service.local:60/api.php",
		dataType: "jsonp",
		timeout: 900,
		beforeSend: function() {
			$("#additional").hide();
			$("#additional_loading").show();
		},
		success: function(data) {
			var template = Handlebars.templates['lovely-quote'];
			var templateData = template(data);
			$("#loveluquot").html(templateData);
			$("#additional_loading").fadeOut("slow",function() {
				$("#additional").fadeIn("slow");
			});
		},
		error: function(jqXhr, textStatus, errorMessage) {
			$("#loveluquot").text("Error: " + errorMessage);
			$("#additional_loading").fadeOut("slow",function() {
				$("#additional").fadeIn("slow");
			});
		}
	});
});