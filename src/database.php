<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
    header("Content-Type: application/json; charset=UTF-8");

    $data = json_decode(file_get_contents("php://input"));

    $idNumber = $data->idNumber;
    $password = $data->password;

    // Dummy validation for example purposes
    if ($idNumber == '1234' && $password == 'password') {
         echo json_encode(['success' => true]);
    } else {
         echo json_encode(['success' => false]);
    }
    ?>