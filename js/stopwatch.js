 (function($){
    
        $.extend({
            
            stopWatch : {                
                
                formatTimer : function(a) {
                    if (a < 10) {
                        a = '0' + a;
                    }                              
                    return a;
                },
                formatTimerSec : function(a) {
                    return a;
                },    
                
                startTimer : function(dir) {
                    
                    var a;
                    
                    // save type
                    $.stopWatch.dir = dir;
                    
                    // get current date
                    $.stopWatch.d1 = new Date();
                    
                    switch($.stopWatch.state) {
                            
                        case 'pause' :
                            
                            // resume timer
                            // get current timestamp (for calculations) and
                            // substract time difference between pause and now
                            $.stopWatch.t1 = $.stopWatch.d1.getTime() - $.stopWatch.td;                            
                            
                        break;
                            
                        default :
                            
                            // get current timestamp (for calculations)
                            $.stopWatch.t1 = $.stopWatch.d1.getTime(); 
                            
                            // if countdown add ms based on seconds in textfield
                            if ($.stopWatch.dir === 'cd') {
                                $.stopWatch.t1 += parseInt($('#cd_seconds').val())*1000;
                            }    
                        
                        break;
                            
                    }                                   
                    
                    // reset state
                    $.stopWatch.state = 'alive';   
                    $('#' + $.stopWatch.dir + '_status').html('Running');
                    
                    // start loop
                    $.stopWatch.loopTimer();
                    
                },
                
                pauseTimer : function() {
                    
                    // save timestamp of pause
                    $.stopWatch.dp = new Date();
                    $.stopWatch.tp = $.stopWatch.dp.getTime();
                    
                    // save elapsed time (until pause)
                    $.stopWatch.td = $.stopWatch.tp - $.stopWatch.t1;
                    
                    // change button value
                    $('#' + $.stopWatch.dir + '_start').val('Resume');
                    
                    // set state
                    $.stopWatch.state = 'pause';
                    $('#' + $.stopWatch.dir + '_status').html('Paused');
                    
                },
                
                stopTimer : function() {
                    
                    // change button value
                    $('#' + $.stopWatch.dir + '_start').val('Restart');                    
                    
                    // set state
                    $.stopWatch.state = 'stop';
                    $('#' + $.stopWatch.dir + '_status').html('Stopped');
                    
                },
                
                resetTimer : function() {

                    // reset display
                    $('#' + $.stopWatch.dir + '_ms,#' + $.stopWatch.dir + '_s,#' + $.stopWatch.dir + '_m,#' + $.stopWatch.dir + '_h').html('00');                 
                    
                    // change button value
                    $('#' + $.stopWatch.dir + '_start').val('Start');                    
                    
                    // set state
                    $.stopWatch.state = 'reset';  
                    $('#' + $.stopWatch.dir + '_status').html('Reset & Idle again');
                    
                },
                
                endTimer : function(callback) {
                   
                    // change button value
                    $('#' + $.stopWatch.dir + '_start').val('Restart');
                    
                    // set state
                    $.stopWatch.state = 'end';
                    
                    // invoke callback
                    if (typeof callback === 'function') {
                        callback();
                    }    
                    
                },    
                
                loopTimer : function() {
                    
                    var td;
                    var d2,t2;
                    
                    var ms = 0;
                    var s  = 0;
                    var m  = 0;
                    var h  = 0;
                    
                    if ($.stopWatch.state === 'alive') {
                                
                        // get current date and convert it into 
                        // timestamp for calculations
                        d2 = new Date();
                        t2 = d2.getTime();   
                        
                        // calculate time difference between
                        // initial and current timestamp
                        if ($.stopWatch.dir === 'sw') {
                            td = t2 - $.stopWatch.t1;
                        // reversed if countdown
                        } else {
                            td = $.stopWatch.t1 - t2;
                            if (td <= 0) {
                                // if time difference is 0 end countdown
                                $.stopWatch.endTimer(function(){
                                    $.stopWatch.resetTimer();
                                    $('#' + $.stopWatch.dir + '_status').html('Ended & Reset');
                                });
                            }    
                        }    
                        
                        // calculate milliseconds
                        ms = td%1000;
                        if (ms < 1) {
                            ms = 0;
                        } else {    
                            // calculate seconds
                            s = (td-ms)/1000;
                            if (s < 1) {
                                s = 0;
                            } else {
                                // calculate minutes   
                                var m = (s-(s%60))/60;
                                if (m < 1) {
                                    m = 0;
                                } else {
                                    // calculate hours
                                    var h = (m-(m%60))/60;
                                    if (h < 1) {
                                        h = 0;
                                    }                             
                                }    
                            }
                        }
                      
                        // substract elapsed minutes & hours
                        ms = Math.round(ms/100);
                        s  = s-(m*60);
                        m  = m-(h*60);                                
                        
                        // update display
                        $('#' + $.stopWatch.dir + '_ms').html($.stopWatch.formatTimer(ms));
                        $('#' + $.stopWatch.dir + '_s').html($.stopWatch.formatTimerSec(s));
                        $('#' + $.stopWatch.dir + '_m').html($.stopWatch.formatTimer(m));
                        $('#' + $.stopWatch.dir + '_h').html($.stopWatch.formatTimer(h));
                        
                        // loop
                        $.stopWatch.t = setTimeout($.stopWatch.loopTimer,1);
                    
                    } else {
                    
                        // kill loop
                        clearTimeout($.stopWatch.t);
                        return true;
                    
                    }  
                    
                }
                    
            }    
        
        });
          
        
        // count up
        //    $.stopWatch.startTimer('sw');
      //count down

        
          //  $.stopWatch.startTimer('cd');
           
        
        // stop
            //$.stopWatch.stopTimer();
        
        //reset
        
            //$.stopWatch.resetTimer();
        
        
        //pause
            //$.stopWatch.pauseTimer();
                    
                
    })(jQuery);