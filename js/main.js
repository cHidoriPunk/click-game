var pointer = $('#pointer');
var counter = 0;
var coordinates = [];
 
function startGame(){  
  pointer.addClass('miliseconds');   
  $.stopWatch.startTimer('sw');
  $('.click-zone').click(function(e){ 
      data = {lines:[coordinates]};
      var $this = $(this);
      $this.addClass('collected');      
      var countElements = $('.collected').length;  
      if(countElements == 1){  
       $('#action-zone').mousemove(function (e) {
            coordinates.push([e.pageX - $(this).offset().left, e.pageY - $(this).offset().top]);           
       });     
      }
      if(countElements == 3){
         $('#action-zone').unbind('mousemove');         
        coordsList = JSON.stringify(data);        
        var transformAngle = pointer.css('transform');
        pointer.css({'transform': transformAngle, 'transform-origin': 'bottom center'});
        pointer.removeClass('miliseconds'); 
        $.stopWatch.stopTimer('sw');
        var title = 'Please Fill Your Name';
        var content =
          '<form name="addscore">'+
            '<div class="form-group">'+
              '<label for="player_name">What\'s Your Name?</label>'+
              '<input name="player_name" class="form-control" type="text" onkeypress="if(event.keyCode ==13){ return false; }"/>'+
            '</div>'+
            '<div class="text-right">'+
              '<button id="send-score" type="button" class="btn btn-default">Send</button>'+
            '</div>'+
          '</form>';
        
        showModal(title, content, 'false'); 
        addScoreValidate();         
      }      
    
  });
}


function showModal(title, content, canClose, modalClass){
    if(canClose === 'true'){
      var backdrop = 'true'; 
      var keyboard = 'true';    
    } else {
      var backdrop = 'false'; 
      var keyboard = 'false';      
    }
    if(modalClass){
     $('#myModal').find('.modal-dialog').addClass(modalClass);   
    } else {
     $('#myModal').find('.modal-dialog').attr('class', 'modal-dialog');   
    }
    $('#myModal').find('.modal-title').html(title);
    $('#myModal').find('.modal-body').html(content);
    $('#myModal').modal({ show:true, keyboard: keyboard, backdrop: backdrop });
    
    $('#myModal').on('shown.bs.modal', function(){
     $(this).find('input[name="player_name"]').focus();
    });
    
    $('#myModal').on('hidden.bs.modal', function(){
        $.stopWatch.resetTimer('sw'); 
        $('.click-zone').unbind('click');
        $('.click-zone').removeClass('collected');
        pointer.css({transform: ''});  
        counter = 0;       
    });

}

var scoreDate =  function setScoreDate(){
  var MyDate = new Date();
  var MyDateString;
  MyDate.setDate(MyDate.getDate());
  MyDateString = ('0' + MyDate.getDate()).slice(-2) + '/' + ('0' + (MyDate.getMonth()+1)).slice(-2) + '/' + MyDate.getFullYear();
  return MyDateString;
}

var scoreTime = function setScoreTime(){
  var ms = $('#sw_ms').text();
  var sec = $('#sw_s').text();
  var resultFloat = sec +'.'+ms;
  return resultFloat + ' sec'; 
}

var timeStamp = function setScoreTimeStamp(){
  timeStamp = Math.round(new Date().getTime()/1000.0)
  return timeStamp;
}

function addScoreValidate(){
    
    $('button[id="send-score"]').click(function(){
        var playerName = $('input[name="player_name"]');
        var playerNameValue = playerName.val();
        var scoreData = { scoreDate: scoreDate, playerName: playerNameValue, scoreTime: scoreTime, timeStamp: timeStamp, coordList: coordsList};
        //console.log(scoreData);        
        if(playerNameValue!=''){ 
          $.ajax({
            type: "post",
            url: 'response.php',
            data: scoreData,            
            success: function(response){ 
               var scoresContainer = $('#scores');
               $(scoresContainer).html(response);  
               $("#high_scores table").trigger('sortRestart'); 
               coordinates = []; //empty coordinats array for next outcome
               clearModal();
               $('html,body').animate({
                    scrollTop: $('#high_scores').offset().top
                }, 1000);
               //console.log("Form submitted successfully!");           
            },        
            error:function(response){ 
              //console.log("Form submission failed!");
            }
          });

        } else {
          playerName.prop('placeholder', theNameLess());
          return false; 
        }

    });
}

function clearModal(){
  $('#myModal').modal('hide');
  $('#myModal .modal-title').html('');
  $('#myModal .modal-body').html('');
}


function theNameLess(){ 
  var reply;
  counter++;
  var myArray = ['What\'s your name?', 'How are you called?', 'Give me a name..', 'One might call you..?', 'Your name is..?'];
  
 if(counter == 5){
   reply = 'A Girl As No Name';  
 } else if(counter == 6){
   reply = $('input[name="player_name"]').val('Arya Stark');  
 } else {
   reply = myArray[Math.floor(Math.random() * myArray.length)];
 }
 return reply;
}

function getGraph(id){
         
    $.ajax({
       type: "post",
       url: 'response.php',
       data: {graphid: id},
       dataType: 'json',
       success: function (response) {
        var title = 'Score Graph';
        var content = '<canvas id="myCanvas"></canvas>';
        showModal(title, content, 'true');
        var jsonOBJ = response;
        var objLines = jsonOBJ.lines[0];
        var canvas = $('#myCanvas').get(0);
        var ctx = canvas.getContext("2d"); 
        ctx.canvas.width  = 568;
        ctx.canvas.height = 300;
        ctx.lineWidth = 1; 
        ctx.strokeStyle = "#2E4272";            
        for (i=0; i<objLines.length; i++){
          var coordX = objLines[i][0] / 2;
          var coordY = objLines[i][1] / 2;
          ctx.lineTo(coordX, coordY);
        }
        ctx.stroke();           
        //console.log("Request submitted successfully!");
       },
       error:function(response){ 
         //console.log("Request submission failed!");         
       }        
     });
}


$(document).ready(function(){          
  $("#high_scores table").tablesorter({headers: { 3:{sorter: false}}});   
  $(window).bind('keypress', function(e){ 
    if (e.keyCode === 32) {
        e.preventDefault();
        startGame();
    }       
  });  
  
  $('#results button').click(function(){
      var $this = $(this);
      var resultsSpan = $this.attr('data-results');
      var data = {results: resultsSpan};
      $.ajax({
        type: "post",
        url: 'response.php',
        data: data,            
        success: function(response){ 
           var scoresContainer = $('#scores');
           $(scoresContainer).html(response);  
           //console.log("Form submitted successfully!");           
        },        
        error:function(response){ 
          //console.log("Form submission failed!");
        }
      });

      
  });
  
});