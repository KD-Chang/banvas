var eventnum = 0,i,id=2;
//$("div").qrcode("http://www.google.com.tw");
var Banvas_id = getCookie('Banvas_id'),
	Banvas_token = getCookie('Banvas_token');
var FB_temp = {};
var timeline = {
		"timeline":
		{
				"headline":"Welcome To Banvas",
				"type":"default",
				"text":"Make professional connect easier and closer",
				"startDate":"2000,1,1",
				"date": [{"startDate":"2000,1,1","endDate":"2000,1,30","headline":"Default","text":"<p>Join Banvas</p>","asset":{"media":"","credit":"","caption":""},"my_post_id":0}] 
		}
};
$.post('/'+Banvas_id+'/status',{"token": Banvas_token},function(data){
	var info = JSON.parse(data);
	if(info.err!=0)
		window.location.replace('/');
	else{
		if(info.data[0].name)		$('.name').html(info.data[0].name.first+' '+info.data[0].name.last);
		if(info.data[0].School)		$('.school').html(info.data[0].School);
		if(info.data[0].Intro)		$('.intro').html(info.data[0].Intro);
		if(info.data[0].Skill)		$('.skill').html(info.data[0].Skill);
		if(info.data[0].Position)	$('.position').html(info.data[0].Position);
		if(info.data[0].Image_pkt){
			var img_url=JSON.parse(info.data[0].Image_pkt);
			$('img.head').attr('src','/uploads/'+img_url.head_url);
		}
		if(info.data[0].linked)		$('a.FB').attr('href',info.data[0].linked.Facebook);
		if(info.data[0].TimeLine)	timeline=JSON.parse(info.data[0].TimeLine);
		$('#timeline-embed').empty();
		CreateTimeLine();
	}
})
$(".edit").click(edit_mode);
$(".FB_import").click(FB_import);
// Function Area
function edit_mode(){
		$(this).html("Done").removeClass("edit").click(function(){
			save();
			$(this).html("Edit").addClass("edit").unbind('.click');
			$(".static").unbind('click');
			$('.temp').remove();
			var post_data = {"token": Banvas_token,"School": $('.school:first').html(),"Intro":$('.intro').html(),"Skill":$('.skill').html(),"Position":$('.position:first').html(),"linked":{"Facebook":$('a.FB').attr('href'),"Blogger":'#',"Linkedin":'#'},"TimeLine":JSON.stringify(timeline)};
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
		$('<button class="temp" style="float : right;">-</button>').appendTo('.skill li').click(function(event){
			event.stopPropagation();
			$(this).parent('li').remove();
		});
		$('<button class="temp">+</button>').appendTo('.skill_header').click(function(){
			$('<li class="static">Click To Edit</li>').appendTo('ul.skill').click(edit).change(save).end();
		});
		$('<button class="temp" style="float : right;">Add Social Network Link</button>').appendTo('div.social').click(Social_url);
		$('<button class="temp" >Add Timeline Event</button>').insertAfter('div#timeline').click(AddTimeEvent);
		$('<button class="temp" >Timeline Config</button>').insertAfter('div#timeline').click(Timeline_config);
};
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
function Social_url(){
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
}
function AddTimeEvent(){
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
						"media":$('#url').val(),
						"credit":" ",
						"caption":" "
					}
				}
				timeline.timeline.date.push(new_event);
				$('#timeline-embed').empty();
				CreateTimeLine();
				$( this ).dialog( "close" );
			},
			"Cancel": function(){
				$( this ).dialog( "close" );
			}
		}
	});
}
function Timeline_config(){
	var temp = _.template($('#Timeline_config').html(),{});
	$(temp).dialog({
		height: 300,
		width: 400,
		modal: true,
		buttons : {
			"Update": function(){
				if($('#headname').val()!='')
					timeline.timeline.headline=$('#headname').val();
				if($('#time_des').val()!='')
					timeline.timeline.text=$('#time_des').val();
				if($('#time_start').val()!='')
					timeline.timeline.startDate=$('#time_start').val();
				$('#timeline-embed').empty();
				CreateTimeLine();
				$( this ).dialog( "close" );
			},
			"Cancel": function(){
				$( this ).dialog( "close" );
			}
		}
	});
}
function CreateTimeLine(){
	createStoryJS({
		type:       'timeline',
		width:      '100%',
		height:     '600',
		source:     timeline,
		embed_id:   'timeline-embed',           // ID of the DIV you want to load the timeline into
	});	
}
window.fbAsyncInit = function() {
		FB.init({
	appId      : '471817496195401', // App ID from the App Dashboard
	channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel File for x-domain communication
	status     : true, // check the login status upon init?
	cookie     : true, // set sessions cookies to allow your server to access the session?
	xfbml      : true  // parse XFBML tags on this page?
});
};

(function(d, debug){
	var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	if (d.getElementById(id)) {return;}
	js = d.createElement('script'); js.id = id; js.async = true;
	js.src = "//connect.facebook.net/en_US/all" + (debug ? "/debug" : "") + ".js";
	ref.parentNode.insertBefore(js, ref);
}(document, /*debug*/ false));

function FB_import(){
	FB.login(function(response) {
		if (response.authResponse) {
			console.log('Welcome!  Fetching your information.... ');
			FB.api('/me?fields=bio,birthday,education,work', function(response) {
				//console.log(response);
				//console.log(response['education']);
				for (i in response['education']){
					if( response['education'][i]['type'] == 'College' || response['education'][i]['type'] == 'Graduate School' ){
						//console.log(response['education'][i]['school']['name'])
						FB_temp['School'] = response['education'][i]['school']['name'];
					}
				}
				if(response['work']) FB_temp['Job_exp'] = JSON.stringify(response['work'][0]);
				FB_temp['token']=Banvas_token;
				console.log(FB_temp);
				$.post('/'+Banvas_id+'/modify', FB_temp, function(message){
					console.log(message);
				})
				window.location.replace('/user');
			});
		} else console.log('User cancelled login or did not fully authorize.');
	});
}
