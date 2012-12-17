var eventnum = 0,i,id=2;
//$("div").qrcode("http://www.google.com.tw");
var Banvas_id = getCookie('Banvas_id'),
	Banvas_token = getCookie('Banvas_token');
$.post('/'+Banvas_id+'/status',{"token": Banvas_token},function(data){
	console.log(data);
	var info = JSON.parse(data);
	if(info.err!=0)
		window.location.replace('/');
	else{
		if(info.data[0].name)
		$('.name').html(info.data[0].name.first+' '+info.data[0].name.last);
		$('.school').html(info.data[0].School);
		$('.intro').html(info.data[0].Intro);
		$('.skill').html(info.data[0].Skill);
		$('.position').html(info.data[0].Position);
		console.log(info.data[0].Image_pkt);
		var img_url=JSON.parse(info.data[0].Image_pkt);
		$('img.head').attr('src','/uploads/'+img_url.head_url);
		$('a.FB').attr('href',info.data[0].linked.Facebook);
	}
})
$(".edit").click(edit_mode);
function edit_mode(){
		$(this).html("Done").removeClass("edit").click(function(){
			save();
			$(this).html("Edit").addClass("edit").unbind('.click');
			$(".static").unbind('click');
			$('.temp').remove();
			var post_data = {"token": Banvas_token,"School": $('.school:first').html(),"Intro":$('.intro').html(),"Skill":$('.skill').html(),"Position":$('.position:first').html(),"linked":{"Facebook":$('a.FB').attr('href'),"Blogger":'#',"Linkedin":'#'}};
			$.post('/'+Banvas_id+'/modify',post_data,function(data){
				console.log(data);
			});
			console.log('Posting new data....');
			console.log(post_data);
			$(this).unbind('click').bind('click',edit_mode);
		});
		$(".static").click(edit).change(save).end();
		$('<button class="temp head_change">+</button>').insertAfter('img.head').click(function(){
			$("<form method='post' action='/"+Banvas_id+"/mod_img' ENCTYPE=\"multipart/form-data\"><input type='file' name='file' /><input name='token' type='hidden' value='"+Banvas_token+"'/><input type='hidden' name='title' value='head'/> <button>送出</button></form>").dialog();
});
		$('<button class="temp" style="float : right;">-</button>').appendTo('li.static').click(function(event){
			event.stopPropagation();
			$(this).parent('li').remove();	
		});
		$('<button class="temp">+</button>').appendTo('.skill_header').click(function(){
			$('<li class="static">default</li>').appendTo('ul.skill').click(edit).change(save).end();
		});
		$('<button class="temp" style="float : right;">Add Social Network Link</button>').appendTo('div.social').click(function(){
			$("<form><label>Facebook:</label><input type='text' id='FB_url'/><br><label>Blog:</label><input type='text' id='Blog_url'/><br><label>LinkedIn:</label><input type='text' id='Linked_url'/></form>").dialog({
				buttons: {
					"Set": function(){
						$('a.FB').attr('href',$('#FB_url').val());
						$( this ).dialog( "close" );
					},
					"Cancel": function(){
						$( this ).dialog( "close" );
					}
				}
			});
		});
};
$('#scroll-right').on('mouseup mouseleave',function(){
	window.clearInterval(i);
}).mousedown(function(){
	var temp = $('.ui-slider').css('left');
	i = window.setInterval(function() {$('.ui-slider').css('left','+=10');$('ul.timeline').css('left','+=10');}, 100);
});
$('#scroll-left').on('mouseup mouseleave',function(){
	window.clearInterval(i);
}).mousedown(function(){
	var temp = $('.ui-slider').css('left');
	i = window.setInterval(function() {$('.ui-slider').css('left','-=10');$('ul.timeline').css('left','-=10');}, 100);
});
var timeline = {
		"timeline":
		{   
				"headline":"Sh*t People Say",
				"type":"default",
				"text":"People say stuff",
				"startDate":"2012,1,26",
				"date": [
				{   
						"startDate":"2012,1,27",
						"endDate":"2012,1,28",
						"headline":"Sh*t Politicians Say",
						"text":"<p>In true political fashion, his character rattles off common jargon heard from people running for office.</p>",
						"asset":{
								"media":"http://www.google.com",
								"credit":"",
								"caption":""
						}   
				},  
				{   
						"startDate":"2012,1,29",
						"endDate":"2012,1,30",
						"headline":"Test",
						"text":"<p>hahaha</p>",
						"asset":{}
				},  
				{   
						"startDate":"2012,1,17",
						"endDate":"2012,1,18",
						"headline":"Meow",
						"text":"<p>Already 00:12!!time to sleep</p>",
						"asset":{}
				}   
				] 
		}   
};
$('#timeline-embed').ready(function(){
	createStoryJS({
		type:       'timeline',
		width:      '100%',
		height:     '600',
		source:     timeline,
		embed_id:   'timeline-embed',           // ID of the DIV you want to load the timeline into
	});
});
$('button#add_time_event').click(function(){
	var temp = _.template($('#add_time_form').html(),{});
	$(temp).dialog({
		height: 300,
		width: 400,
		modal: true,
		buttons : {
			"Create": function(){
				var new_event={
					"startDate": $('#startDate').val(),
					"endDate": $('#endDate').val(),
					"headline":$('#headline').val(),
					"text": '<p>'+$('#text').val()+'</p>',
					"asset":{
						"media":$('#url').val()
					}
				}
				timeline.timeline.date.push(new_event);
				$('#timeline-embed').empty();
				createStoryJS({
					type:       'timeline',
					width:      '100%',
					height:     '600',
					source:     timeline,
					embed_id:   'timeline-embed',           // ID of the DIV you want to load the timeline into
				});
				$( this ).dialog( "close" );
			},
			"Cancel": function(){
				$( this ).dialog( "close" );
			}
		}
	});
});
function save(){
			$(".editing").each(function(){
				var temp=$(this).val();
				$(this).parent(".changing").removeClass("changing").addClass("static").unbind('click').bind('click',edit).html(temp);
			});
}
function edit(){
			temp=$(this).removeClass("static").addClass("changing").html();
			$(this).html('<input class=\"editing\" type="text" value=\''+temp+'\'>').unbind('click').bind('click',save);
}
function getCookie(c_name){
		var i,x,y,ARRcookies=document.cookie.split(";");
		for (i=0;i<ARRcookies.length;i++)
		{
				x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
				y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
				x=x.replace(/^\s+|\s+$/g,"");
				if (x==c_name)
				{
						return unescape(y);
				}
		}
}
