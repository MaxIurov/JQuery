var templates = {};
function display_template(tmpl, data) {
	if (templates[tmpl] === undefined) { 
		jQuery.get("templates/"+tmpl+".html", function(resp) {
			console.log(resp);
			templates[tmpl] = Handlebars.compile(resp);
			//templates[tmpl] = Handlebars.compile('{{#each this}}<p>{{id}}</p>{{/each}}');
			display_template(tmpl,data);
		});
		return;
	}
	var template = templates[tmpl];
	var html = template(data);
	$("#navaccordion").html(html);
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
		console.log(data);
		var tname = "nav-cats";
		display_template(tname,data);
	});
});