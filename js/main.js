$(function(){
	var ENABLE_LOGGING = false;
	$('.roulette').find('img').hover(function(){
		console.log($(this).height());
	});
	var appendLogMsg = function(msg) {
		if (!ENABLE_LOGGING) {
			return;
		}
		$('.msg')
	.append('<p class="muted">' + msg + '</p>')
	.scrollTop(100000000);

	}
	var p = {
		startCallback : function() {
			var instanceId = this.instanceId;
			appendLogMsg('start');

			$(`.speed[data-id="${instanceId}"], .duration[data-id="${instanceId}"]`).slider('disable');
			$(`.stopImageNumber[data-id="${instanceId}"]`).spinner('disable');
			$(`.start[data-id="${instanceId}"]`).attr('disabled', 'true');
			$(`.stop[data-id="${instanceId}"]`).removeAttr('disabled');
		},
		slowDownCallback : function() {
			var instanceId = this.instanceId;
			appendLogMsg('slowdown');
			$(`.stop[data-id="${instanceId}"]`).attr('disabled', 'true');
		},
		stopCallback : function($stopElm) {
			var instanceId = this.instanceId;
			appendLogMsg('stop');
			$(`.speed[data-id="${instanceId}"], .duration[data-id="${instanceId}"]`).slider('enable');
			$(`.stopImageNumber[data-id="${instanceId}"]`).spinner('enable');
			$(`.start[data-id="${instanceId}"]`).removeAttr('disabled');
			$(`.stop[data-id="${instanceId}"]`).attr('disabled', 'true');
		}
	}

	var rouletter = $('div.roulette');
	rouletter.roulette(null, {options: p});

	$('.stop').click(function(ev){
		var instanceId = $(ev.target).attr('data-id');
		var stopImageNumber = $(`.stopImageNumber[data-id="${instanceId}"]`).val();
		if(stopImageNumber == "") {
			stopImageNumber = null;
		}
		rouletter.roulette('stop', {instanceId});
	});
	$('.stop').attr('disabled', 'true');
	$('.start').click(function(ev){
		var instanceId = $(ev.target).attr('data-id');
		rouletter.roulette('start', {instanceId});
	});

	var updateParameter = function(instanceId){
		p['speed'] = Number($(`.speed_param[data-id="${instanceId}"]`).eq(0).text());
		p['duration'] = Number($(`.duration_param[data-id="${instanceId}"]`).eq(0).text());
		p['stopImageNumber'] = Number($(`.stop_image_number_param[data-id="${instanceId}"]`).eq(0).text());
		rouletter.roulette('option', {options: p, instanceId});	
	}

	var updateSpeed = function(instanceId, speed){
		$(`.speed_param[data-id="${instanceId}"]`).text(speed);
	}
	var handleSpeedEvent = function(event, {value = 10}) {
		var instanceId = $(event.target).attr('data-id');
		updateParameter(instanceId);
		updateSpeed(instanceId, value);
	}
	$('.speed').slider({
		min: 1,
		max: 30,
		value : 10,
		create: handleSpeedEvent,
		slide: handleSpeedEvent
	});

	var updateDuration = function(instanceId, duration){
		$(`.duration_param[data-id="${instanceId}"]`).text(duration);
	}
	var handleDurationEvent = function(event, {value = 3}) {
		var instanceId = $(event.target).attr('data-id');
		updateParameter(instanceId);
		updateDuration(instanceId, value);
	}
	$('.duration').slider({
		min: 2,
		max: 10,
		value : 3,
		create: handleDurationEvent,
		slide: handleDurationEvent
	});

	var updateStopImageNumber = function(instanceId, stopImageNumber) {
		$('.image_sample').children().css('opacity' , 0.2);
		$('.image_sample').children().filter('[data-value="' + stopImageNumber + '"]').css('opacity' , 1);
		$('.stop_image_number_param').text(stopImageNumber);
		updateParameter(instanceId);
	}

	$('.stopImageNumber').spinner({
		spin: function( event, ui ) {
			var instanceId = $(event.target).attr('data-id');
			var imageNumber = ui.value;
			if ( ui.value > 4 ) {
				$( this ).spinner( "value", -1 );
				imageNumber = 0;
				updateStopImageNumber(instanceId, -1);
				return false;
			} else if ( ui.value < -1 ) {
				$( this ).spinner( "value", 4 );
				imageNumber = 4;
				updateStopImageNumber(instanceId, 4);
				return false;
			}
			updateStopImageNumber(instanceId, imageNumber);
		}
	});

	$('.image_sample').children().click(function(ev){
		var instanceId = $(ev.target).attr('data-id');
		var stopImageNumber = $(this).attr('data-value');
		$('.stopImageNumber').spinner('value', stopImageNumber);
		updateStopImageNumber(instanceId, stopImageNumber);
	});
});
