<?php require("database.php"); ?>
<?php

    if(isset($_POST['playerName'])){

        $scoreDate = htmlspecialchars($_POST['scoreDate']);
        $playerName = htmlspecialchars($_POST['playerName']);
        $scoreTime = htmlspecialchars($_POST['scoreTime']);
        $scoreTimeStamp = htmlspecialchars($_POST['timeStamp']);
        $mouseTrail = $_POST['coordList'];
        //Do your MySQL or whatever you wanna do with received data
        addScore($scoreDate, $playerName, $scoreTime, $scoreTimeStamp, $mouseTrail);
        getHighScores();
    } 

    if(isset($_POST['graphid'])){
        getGraph($_POST['graphid']);
    }

    if(isset($_POST['results'])){
        resultsSpan($_POST['results']);
    }

?>