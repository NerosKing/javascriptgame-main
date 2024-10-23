<?php
if (isset($_POST['score'])) {
    $score = $_POST['score'];
    $name = isset($_POST['name']) ? $_POST['name'] : 'Anonymous';

    $entry = $name . ": " . $score . "\n";
    file_put_contents('highscores.txt', $entry, FILE_APPEND);
}
?>
