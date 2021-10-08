<?php
/**
 * Database.php
 * 
 * The Database class is meant to simplify the task of accessing
 * information from the website's database.
 *
 * Please subscribe to our feeds at http://blog.geotitles.com for more such tutorials
 */
include("constants.php");
 
// Create connection
$conn = new mysqli(DB_SERVER, DB_USER, DB_PASS, DB_NAME);
// Check connection
if ($conn->connect_error) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
} 

function getHighScores(){
  global $conn;
  $sql = "SELECT * FROM  `marvel_game` ORDER BY  `marvel_game`.`id` ASC";
  $result = $conn->query($sql);
  if ($result->num_rows > 0) {        
    function graphLink($row){
        if($row["score_trail"]!=''){
            return '<a class="showGraph" onclick="getGraph('.$row['id'].');">View</a>';
        } else {
            return;
        }
    }    
    // output data of each row
    while($row = $result->fetch_assoc()) {         
        $output = '<tr>';
            $output .= '<td>';
                $output .= $row["score_date"];
            $output .= '</td>';
            $output .= '<td>';
                $output .= $row["player_name"];   
            $output .= '</td>';
            $output .= '<td>';
                $output .= $row["score_time"];      
            $output .= '</td>';
            $output .= '<td>';
                $output .= graphLink($row);        
            $output .= '</td>';
        $output .= '</tr>';                
        echo $output;      
    }    
  } else {     
    $output = '<tr>';
        $output .= '<td colspan="4">';
            $output .= 'No Results';
        $output .= '</td>';
    $output .= '</tr>';            
    echo $output;
  }  
 $conn->close();
}

function addScore($scoreDate, $playerName, $scoreTime, $scoreTimeStamp, $mouseTrail ){
  global $conn;
  $sql = "INSERT INTO `marvel_game` (`score_date`, `player_name`, `score_time`, `score_timestamp`, `score_trail`) 
          VALUES ('".$scoreDate."','".$playerName."','".$scoreTime."','".$scoreTimeStamp."','".$mouseTrail."');";
  $result = $conn->query($sql);
  return $result;
  
}

function getGraph($rowid){
  global $conn;
  $sql = "SELECT `score_trail` FROM `marvel_game` WHERE `id` = ".$rowid;
  $result = $conn->query($sql);  
  if ($result) {    
        while($row = $result->fetch_assoc()) { 
        $trail = $row["score_trail"];
        echo $trail;
       }
  } else {
    echo "Error: " . $sql;
  } 
}



function resultsSpan($spanPeriod){
  global $conn;
  $spanUnit = date($spanPeriod);
  switch ($spanPeriod){
      case 'd';
          $sql = "SELECT * FROM `marvel_game` WHERE FROM_UNIXTIME(`score_timestamp`, '%d') =".$spanUnit;
          break;
      case 'm';
          $month = date('m');
          $sql = "SELECT * FROM `marvel_game` WHERE FROM_UNIXTIME(`score_timestamp`, '%m') =".$spanUnit;
          break;
      case 'Y';
          $year = date('Y');
          $sql = "SELECT * FROM `marvel_game` WHERE FROM_UNIXTIME(`score_timestamp`, '%Y') =".$spanUnit;
          break;
      case 'ever';
          $sql = "SELECT * FROM  `marvel_game` ORDER BY `marvel_game`.`id` ASC";
          break;
  }  
  $result = $conn->query($sql);
  
  if ($result->num_rows > 0) {        
    function graphLink($row){
        if($row["score_trail"]!=''){
            return '<a class="showGraph" onclick="getGraph('.$row['id'].');">View</a>';
        } else {
            return;
        }
    }    
    // output data of each row
    while($row = $result->fetch_assoc()) {         
        $output = '<tr>';
            $output .= '<td>';
                $output .= $row["score_date"];
            $output .= '</td>';
            $output .= '<td>';
                $output .= $row["player_name"];   
            $output .= '</td>';
            $output .= '<td>';
                $output .= $row["score_time"];      
            $output .= '</td>';
            $output .= '<td>';
                $output .= graphLink($row);        
            $output .= '</td>';
        $output .= '</tr>';                
        echo $output;      
    }    
  } else {     
    $output = '<tr>';
        $output .= '<td colspan="4">';
            $output .= 'No Results';
        $output .= '</td>';
    $output .= '</tr>';            
    echo $output;
  }  
  
 $conn->close();
}