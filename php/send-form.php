<?php

header('Content-Type: application/json');

/* -------------------
   Honeypot защита
------------------- */

if (!empty($_POST['website']) || !empty($_POST['company_name'])) {

    echo json_encode([
        "success" => false
    ]);

    exit;
}

/* -------------------
   Получаем данные
------------------- */

$name = $_POST['name'] ?? '';
$phone = $_POST['phone'] ?? '';
$email = $_POST['email'] ?? '';
$company = $_POST['company'] ?? '';
$role = $_POST['role'] ?? '';
$program = $_POST['program'] ?? '';

$date = date("d.m.Y H:i");

/* -------------------
   Сообщение
------------------- */

$message = "Новая заявка с сайта\n\n";

$message .= "Имя: $name\n";
$message .= "Телефон: $phone\n";
$message .= "Email: $email\n";
$message .= "Компания: $company\n";
$message .= "Роль: $role\n";
$message .= "Программа: $program\n\n";
$message .= "Дата: $date";

/* -------------------
   Email
------------------- */

$to = "crkteam@yandex.ru";   // сюда приходит заявка
$subject = "Новая заявка с сайта";

$headers = "From: site@crk.agency-innovation.com\r\n";
$headers .= "Content-Type: text/plain; charset=utf-8\r\n";

$mail = mail($to, $subject, $message, $headers);

/* -------------------
   Ответ JS
------------------- */

if ($mail) {

    echo json_encode([
        "success" => true
    ]);

} else {

    echo json_encode([
        "success" => false
    ]);

}