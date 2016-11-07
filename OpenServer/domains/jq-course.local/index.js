function get_template(tname) {
	return $.ajax("templates/"+tname+".html");
}
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
//url cache
var getUrlData = (function() {
	var timeout = 3000;
	var cachedUrls = [];
	// for (var i = 0; i < localStorage.length; i++) {
	// 	if (localStorage.key(i).indexOf('jqcourse_') !== -1) {
	// 		localStorage.removeItem(localStorage.key(i));
	// 	}
	// }
	//{url,data,time}
	for (var i = 0; i < localStorage.length; i++) {
		if (localStorage.key(i).indexOf('jqcourse_') !== -1) {
			var cachedUrl = JSON.parse( localStorage.getItem(localStorage.key(i)) );
			cachedUrls.push({url: cachedUrl.url, data: cachedUrl.data, time: cachedUrl.time});
		}
	}
	console.log ("getUrlData -> ",cachedUrls);

	function saveToCache(url) {
		$.get(url, function (data) {
			var obj = {url: url, data: data, time: new Date().getTime()};
			localStorage.setItem('jqcourse_' + url, JSON.stringify(obj));
			console.log("saveToCache -> ",obj);
			return data;
		});
	}
	return {
		get: function(url) {
			var retData;
			for (var j = 0; j < cachedUrls.length; j++) {
				if (cachedUrls[j].url === url) {
					if ((new Date().getTime() - cachedUrls[j].time) < timeout) {
						retData = cachedUrls[j].data;
					}
				}
			}
			if (retData === undefined) {
				retData = saveToCache(url);
			}
			console.log("return:get -> ",retData);
			return retData;
		}
	};
})();

//MAIN function
$(document).ready(function() {
	$(".loader").fadeOut(200);

	var prom = getUrlData.get('mocks/search.json.php');
	prom.success(function(data) {
		alert(data);
	});
	//search autocomplete
	$.getJSON('mocks/search.json.php', function(data) {
		$("#searchform #pojam").autocomplete({
			source: data.titles,
			select: function(event, ui) {
				$("#searchform #pojam").val(ui.item.label);
				$("#searchform .button").click();
				//$("#searchform .search").submit();
			}
		});
	});
	//navigation menu
	$("#navaccordion").hide();
	$("#navaccordion_loading").show();
	$.getJSON('mocks/navigation.json.php', function(data) {
		console.log(data);
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
		$.get("templates/login/login-register-overlay.html", function (templ) {
			dialog_LogReg.create_dialog(templ);
		});
	});
	//myNewPlugin
	//$("#additional").myNewPlugin();
	//slider-pagination

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