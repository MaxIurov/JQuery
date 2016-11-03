function get_template(tname) {
	return $.ajax("templates/"+tname+".html");
}

var logreg_dialog;

var navaccordion_active = -1;
var getNavAccordionActive = function() {
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
};
var setNavAccordionActive = function(idx) {
	localStorage.setItem('navaccordion_active',idx);
}

$(document).ready(function() {
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
	$.getJSON('mocks/navigation.json.php', function(data) {
		var tparent_name = "nav-cats";
		var tchild_name = "nav-subitem";
		get_template(tparent_name).done(function (parent_data) {
			get_template(tchild_name).done(function (child_data) {
				// console.log(parent_data);
				// console.log(child_data);
				var template = Handlebars.compile(parent_data);
				Handlebars.registerPartial("subitemtemplate",child_data);
				var html = template(data);
				$("#navaccordion").html(html);
				$("#navaccordion").accordion({
					heightStyle: "content",
					active: getNavAccordionActive(),
					animate: 200,
					activate: function(event,ui) {
						var active = $( "#navaccordion" ).accordion( "option", "active" );
						setNavAccordionActive(active);
					}
				});
			});
		});
	});
	$.ajax({
		url: "http://quote-service.local:60/api.php",
		dataType: "jsonp",
		timeout: 300,
		success: function(data) {
			// console.log(data);
			get_template("lovely-quote").done(function (templ) {
				var template = Handlebars.compile(templ);
				var html = template(data);
				$("#loveluquot").html(html);
			})
		},
		error: function(jqXhr, textStatus, errorMessage) {
			$("#loveluquot").text("Error: " + errorMessage);
		}
	});

	function greetMessage(mes) {
		$.get("templates/login/greet-register-inlay.html", function (templ) {
			var template = Handlebars.compile(templ);
			var html = template(mes);
			$("#hlogin").html(html);
		});
	}
	function loginUser() {
		//validation
		var login = logreg_dialog.find("#flogin").val();
		greetMessage({message: "You are logged in as " + login});
		logreg_dialog.dialog("close");
	}
	function registerUser() {
		//validation
		var email = logreg_dialog.find("#femail").val();
		greetMessage({message: "Thanks for the registration. You are logged in as " + email});
		logreg_dialog.dialog("close");
	}
	$("#hlogin a").click(function (event) {
		event.preventDefault();
		$.get("templates/login/login-register-overlay.html", function (templ) {
			//console.log(templ);
			logreg_dialog = $('<div></div>').html(templ)
			.dialog({
				modal: true,
				resizable: false,
				title: "Login or Register"
			});
			logreg_dialog.find("#login button").on("click", function (event) {
				event.preventDefault();
				loginUser();
			});
			logreg_dialog.find("#register button").on("click" , function (event) {
				event.preventDefault();
				registerUser();
			})
		});
	});
});