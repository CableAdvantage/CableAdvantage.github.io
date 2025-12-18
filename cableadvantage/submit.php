<?php
header('Content-Type: application/json');

// Prevent direct access
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

// Validate AJAX request
if (!isset($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
    exit;
}

// Initialize response array
$response = ['status' => 'error', 'message' => ''];

// Validate required fields
$required_fields = ['name', 'phone', 'email', 'subject', 'message'];
foreach ($required_fields as $field) {
    if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
        $response['message'] = 'Please fill in all required fields';
        echo json_encode($response);
        exit;
    }
}

// Sanitize input data
$name = filter_var(trim($_POST['name']), FILTER_SANITIZE_STRING);
$phone = filter_var(trim($_POST['phone']), FILTER_SANITIZE_STRING);
$email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
$subject = filter_var(trim($_POST['subject']), FILTER_SANITIZE_STRING);
$message = filter_var(trim($_POST['message']), FILTER_SANITIZE_STRING);

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $response['message'] = 'Please enter a valid email address';
    echo json_encode($response);
    exit;
}

// Validate phone (basic validation for numeric and common separators)
if (!preg_match("/^[0-9\-\(\)\/\+\s]*$/", $phone)) {
    $response['message'] = 'Please enter a valid phone number';
    echo json_encode($response);
    exit;
}

// Email configuration
$to = "pierre@cableadvantage.co.za"; // Replace with your email address
$email_subject = "New Contact Form Submission: $subject";
$email_body = "You have received a new message from your website contact form.\n\n"
    . "Name: $name\n"
    . "Phone: $phone\n"
    . "Email: $email\n"
    . "Subject: $subject\n\n"
    . "Message:\n$message";

$headers = "From: $email\n";
$headers .= "Reply-To: $email\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Try to send email
try {
    if (mail($to, $email_subject, $email_body, $headers)) {
        $response = [
            'status' => 'success',
            'message' => 'Thank you! Your message has been sent successfully.'
        ];
    } else {
        throw new Exception('Failed to send email');
    }
} catch (Exception $e) {
    $response = [
        'status' => 'error',
        'message' => 'Sorry, there was an error sending your message. Please try again later.'
    ];
    
    // Log the error (optional)
    error_log("Contact form error: " . $e->getMessage());
}

// Return JSON response
echo json_encode($response);