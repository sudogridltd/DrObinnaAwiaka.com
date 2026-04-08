<?php
/**
 * JMA Autos USA — Unified Form Handler API
 * 
 * Accepts POST requests for all website forms:
 *   - vehicle_request  (How to Buy page)
 *   - contact          (Contact Us page)
 *   - newsletter       (Newsletter subscription)
 * 
 * Saves to MySQL database, sends admin notification & user confirmation emails.
 * 
 * SETUP:
 *   1. Create a MySQL database and update the credentials below
 *   2. Run this script once with ?setup=1 to create tables: api.php?setup=1
 *   3. Update ADMIN_EMAIL and SMTP settings
 *   4. Deploy alongside the built React app
 */

// ─── Configuration ──────────────────────────────────────────────────────────────

define('DB_HOST', 'localhost');
define('DB_NAME', 'jmaautos_us');
define('DB_USER', 'root');
define('DB_PASS', '');

define('ADMIN_EMAIL', 'info@jmaautosusa.com');
define('ADMIN_NAME', 'JMA Autos USA');
define('SITE_NAME', 'JMA Autos USA');
define('SITE_URL', 'https://jmaautosusa.com');

// Set to true to use SMTP (recommended for production)
define('USE_SMTP', false);
define('SMTP_HOST', 'smtp.example.com');
define('SMTP_PORT', 587);
define('SMTP_USER', '');
define('SMTP_PASS', '');

// ─── CORS & Headers ────────────────────────────────────────────────────────────

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ─── Database Connection ────────────────────────────────────────────────────────

function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $pdo = new PDO(
                'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]
            );
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
            error_log('DB Connection Error: ' . $e->getMessage());
            exit;
        }
    }
    return $pdo;
}

// ─── Table Setup ────────────────────────────────────────────────────────────────

if (isset($_GET['setup'])) {
    try {
        $pdo = new PDO(
            'mysql:host=' . DB_HOST . ';charset=utf8mb4',
            DB_USER,
            DB_PASS,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );

        $pdo->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        $pdo->exec("USE `" . DB_NAME . "`");

        // Vehicle Request submissions
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `vehicle_requests` (
                `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                `first_name` VARCHAR(100) NOT NULL,
                `last_name` VARCHAR(100) NOT NULL,
                `email` VARCHAR(255) NOT NULL,
                `phone` VARCHAR(50) NOT NULL,
                `car_interest` TEXT NOT NULL,
                `budget` VARCHAR(100) NOT NULL,
                `purchase_date` DATE DEFAULT NULL,
                `notes` TEXT DEFAULT NULL,
                `ip_address` VARCHAR(45) DEFAULT NULL,
                `status` ENUM('new','contacted','in_progress','completed','archived') DEFAULT 'new',
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX `idx_status` (`status`),
                INDEX `idx_created` (`created_at`)
            ) ENGINE=InnoDB
        ");

        // Contact form submissions
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `contact_messages` (
                `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                `first_name` VARCHAR(100) NOT NULL,
                `last_name` VARCHAR(100) NOT NULL,
                `email` VARCHAR(255) NOT NULL,
                `phone` VARCHAR(50) DEFAULT NULL,
                `subject` VARCHAR(255) NOT NULL,
                `message` TEXT NOT NULL,
                `ip_address` VARCHAR(45) DEFAULT NULL,
                `status` ENUM('new','read','replied','archived') DEFAULT 'new',
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX `idx_status` (`status`),
                INDEX `idx_created` (`created_at`)
            ) ENGINE=InnoDB
        ");

        // Newsletter subscriptions
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `newsletter_subscribers` (
                `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                `email` VARCHAR(255) NOT NULL,
                `ip_address` VARCHAR(45) DEFAULT NULL,
                `is_active` TINYINT(1) DEFAULT 1,
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE INDEX `idx_email` (`email`),
                INDEX `idx_active` (`is_active`)
            ) ENGINE=InnoDB
        ");

        echo json_encode([
            'success' => true,
            'message' => 'Database and tables created successfully!',
            'tables' => ['vehicle_requests', 'contact_messages', 'newsletter_subscribers'],
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Setup failed: ' . $e->getMessage()]);
    }
    exit;
}

// ─── Only accept POST ───────────────────────────────────────────────────────────

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// ─── Parse Input ────────────────────────────────────────────────────────────────

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['form_type'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request. form_type is required.']);
    exit;
}

$formType = $input['form_type'];
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

// ─── Helpers ────────────────────────────────────────────────────────────────────

function clean(string $value): string {
    return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
}

function validateEmail(string $email): bool {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function required(array $input, array $fields): ?string {
    foreach ($fields as $field) {
        if (empty($input[$field]) || trim($input[$field]) === '') {
            return "Field '{$field}' is required.";
        }
    }
    return null;
}

function sendMail(string $to, string $toName, string $subject, string $htmlBody): bool {
    $fromEmail = ADMIN_EMAIL;
    $fromName = SITE_NAME;

    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        "From: {$fromName} <{$fromEmail}>",
        "Reply-To: {$fromEmail}",
        'X-Mailer: JMA-Autos-PHP',
    ];

    return mail($to, $subject, $htmlBody, implode("\r\n", $headers));
}

function emailTemplate(string $title, string $body, string $footerText = ''): string {
    $siteUrl = SITE_URL;
    $siteName = SITE_NAME;
    $year = date('Y');

    return <<<HTML
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5; padding: 40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">

<!-- Header -->
<tr>
<td style="background-color:#060606; padding: 30px 40px; text-align:center;">
    <h1 style="color:#c8a45c; margin:0; font-size:24px; font-weight:700; letter-spacing:1px;">{$siteName}</h1>
</td>
</tr>

<!-- Title Bar -->
<tr>
<td style="background-color:#c8a45c; padding: 16px 40px;">
    <h2 style="color:#060606; margin:0; font-size:18px; font-weight:600;">{$title}</h2>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding: 32px 40px; color:#333333; font-size:15px; line-height:1.7;">
    {$body}
</td>
</tr>

<!-- Footer -->
<tr>
<td style="background-color:#f9f9f9; padding: 24px 40px; border-top: 1px solid #eee;">
    <p style="color:#999; font-size:13px; margin:0; text-align:center;">
        {$footerText}
    </p>
    <p style="color:#bbb; font-size:12px; margin:10px 0 0; text-align:center;">
        &copy; {$year} {$siteName}. All rights reserved.<br>
        <a href="{$siteUrl}" style="color:#c8a45c; text-decoration:none;">{$siteUrl}</a>
    </p>
</td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>
HTML;
}

function respond(bool $success, string $message, int $code = 200, array $extra = []): void {
    http_response_code($code);
    echo json_encode(array_merge(['success' => $success, 'message' => $message], $extra));
    exit;
}

// ─── Rate Limiting (simple, IP-based) ───────────────────────────────────────────

function checkRateLimit(string $ip, string $formType): void {
    $db = getDB();
    $table = match ($formType) {
        'vehicle_request' => 'vehicle_requests',
        'contact' => 'contact_messages',
        'newsletter' => 'newsletter_subscribers',
        default => null,
    };
    if (!$table) return;

    $stmt = $db->prepare(
        "SELECT COUNT(*) FROM `{$table}` WHERE ip_address = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)"
    );
    $stmt->execute([$ip]);
    $count = (int) $stmt->fetchColumn();

    if ($count >= 5) {
        respond(false, 'Too many submissions. Please try again later.', 429);
    }
}

// ─── Form Handlers ──────────────────────────────────────────────────────────────

try {
    match ($formType) {
        'vehicle_request' => handleVehicleRequest($input, $ip),
        'contact' => handleContact($input, $ip),
        'newsletter' => handleNewsletter($input, $ip),
        default => respond(false, 'Unknown form type.', 400),
    };
} catch (Exception $e) {
    error_log('Form Handler Error: ' . $e->getMessage());
    respond(false, 'An error occurred. Please try again.', 500);
}

// ─── Vehicle Request Handler ────────────────────────────────────────────────────

function handleVehicleRequest(array $input, string $ip): void {
    $requiredFields = ['firstName', 'lastName', 'email', 'phone', 'carInterest', 'budget'];
    $error = required($input, $requiredFields);
    if ($error) respond(false, $error, 422);

    if (!validateEmail($input['email'])) {
        respond(false, 'Invalid email address.', 422);
    }

    checkRateLimit($ip, 'vehicle_request');

    $db = getDB();
    $purchaseDate = !empty($input['purchaseDate']) ? date('Y-m-d', strtotime($input['purchaseDate'])) : null;

    $stmt = $db->prepare("
        INSERT INTO vehicle_requests (first_name, last_name, email, phone, car_interest, budget, purchase_date, notes, ip_address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        clean($input['firstName']),
        clean($input['lastName']),
        clean($input['email']),
        clean($input['phone']),
        clean($input['carInterest']),
        clean($input['budget']),
        $purchaseDate,
        clean($input['notes'] ?? ''),
        $ip,
    ]);

    $requestId = $db->lastInsertId();
    $name = clean($input['firstName']) . ' ' . clean($input['lastName']);

    // ── Admin notification ──
    $adminBody = "
        <p>A new vehicle request has been submitted:</p>
        <table style='width:100%; border-collapse:collapse;'>
            <tr><td style='padding:8px 0; border-bottom:1px solid #eee; color:#999; width:140px;'>Request ID</td><td style='padding:8px 0; border-bottom:1px solid #eee; font-weight:600;'>#{$requestId}</td></tr>
            <tr><td style='padding:8px 0; border-bottom:1px solid #eee; color:#999;'>Name</td><td style='padding:8px 0; border-bottom:1px solid #eee;'>{$name}</td></tr>
            <tr><td style='padding:8px 0; border-bottom:1px solid #eee; color:#999;'>Email</td><td style='padding:8px 0; border-bottom:1px solid #eee;'><a href='mailto:" . clean($input['email']) . "' style='color:#c8a45c;'>" . clean($input['email']) . "</a></td></tr>
            <tr><td style='padding:8px 0; border-bottom:1px solid #eee; color:#999;'>Phone</td><td style='padding:8px 0; border-bottom:1px solid #eee;'><a href='tel:" . clean($input['phone']) . "' style='color:#c8a45c;'>" . clean($input['phone']) . "</a></td></tr>
            <tr><td style='padding:8px 0; border-bottom:1px solid #eee; color:#999;'>Vehicle Interest</td><td style='padding:8px 0; border-bottom:1px solid #eee;'>" . nl2br(clean($input['carInterest'])) . "</td></tr>
            <tr><td style='padding:8px 0; border-bottom:1px solid #eee; color:#999;'>Budget</td><td style='padding:8px 0; border-bottom:1px solid #eee;'>" . clean($input['budget']) . "</td></tr>
            <tr><td style='padding:8px 0; border-bottom:1px solid #eee; color:#999;'>Purchase Date</td><td style='padding:8px 0; border-bottom:1px solid #eee;'>" . ($purchaseDate ?? 'Not specified') . "</td></tr>
            <tr><td style='padding:8px 0; color:#999;'>Notes</td><td style='padding:8px 0;'>" . nl2br(clean($input['notes'] ?? 'None')) . "</td></tr>
        </table>
    ";
    $adminHtml = emailTemplate('New Vehicle Request #' . $requestId, $adminBody, 'This is an automated notification from your website.');
    sendMail(ADMIN_EMAIL, ADMIN_NAME, "New Vehicle Request #{$requestId} from {$name}", $adminHtml);

    // ── User confirmation ──
    $userBody = "
        <p>Hi <strong>" . clean($input['firstName']) . "</strong>,</p>
        <p>Thank you for submitting your vehicle request! We've received your information and our team is already on it.</p>
        <p>Here's a summary of your request:</p>
        <table style='width:100%; border-collapse:collapse; margin:16px 0;'>
            <tr><td style='padding:8px 0; border-bottom:1px solid #eee; color:#999; width:140px;'>Reference</td><td style='padding:8px 0; border-bottom:1px solid #eee; font-weight:600;'>#{$requestId}</td></tr>
            <tr><td style='padding:8px 0; border-bottom:1px solid #eee; color:#999;'>Vehicle</td><td style='padding:8px 0; border-bottom:1px solid #eee;'>" . nl2br(clean($input['carInterest'])) . "</td></tr>
            <tr><td style='padding:8px 0; border-bottom:1px solid #eee; color:#999;'>Budget</td><td style='padding:8px 0; border-bottom:1px solid #eee;'>" . clean($input['budget']) . "</td></tr>
            <tr><td style='padding:8px 0; color:#999;'>Target Date</td><td style='padding:8px 0;'>" . ($purchaseDate ?? 'Flexible') . "</td></tr>
        </table>
        <p><strong>What's next?</strong></p>
        <p>A member of our team will review your request and reach out to you within <strong>24 hours</strong> with matching options. If you have any urgent questions, feel free to call us at <a href='tel:+18321234567' style='color:#c8a45c;'>(832) 123-4567</a>.</p>
        <p>We look forward to helping you find your perfect vehicle!</p>
        <p>Best regards,<br><strong>The JMA Autos Team</strong></p>
    ";
    $userHtml = emailTemplate('Your Vehicle Request #' . $requestId, $userBody, "You're receiving this because you submitted a request on our website.");
    sendMail(clean($input['email']), $name, "Your Vehicle Request #{$requestId} — " . SITE_NAME, $userHtml);

    respond(true, 'Your vehicle request has been submitted successfully! Check your email for confirmation.', 200, ['reference' => $requestId]);
}

// ─── Contact Form Handler ───────────────────────────────────────────────────────

function handleContact(array $input, string $ip): void {
    $requiredFields = ['firstName', 'lastName', 'email', 'subject', 'message'];
    $error = required($input, $requiredFields);
    if ($error) respond(false, $error, 422);

    if (!validateEmail($input['email'])) {
        respond(false, 'Invalid email address.', 422);
    }

    checkRateLimit($ip, 'contact');

    $db = getDB();
    $stmt = $db->prepare("
        INSERT INTO contact_messages (first_name, last_name, email, phone, subject, message, ip_address)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        clean($input['firstName']),
        clean($input['lastName']),
        clean($input['email']),
        clean($input['phone'] ?? ''),
        clean($input['subject']),
        clean($input['message']),
        $ip,
    ]);

    $msgId = $db->lastInsertId();
    $name = clean($input['firstName']) . ' ' . clean($input['lastName']);

    // ── Admin notification ──
    $adminBody = "
        <p>You have a new contact form message:</p>
        <table style='width:100%; border-collapse:collapse;'>
            <tr><td style='padding:8px 0; border-bottom:1px solid #eee; color:#999; width:140px;'>Message ID</td><td style='padding:8px 0; border-bottom:1px solid #eee; font-weight:600;'>#{$msgId}</td></tr>
            <tr><td style='padding:8px 0; border-bottom:1px solid #eee; color:#999;'>From</td><td style='padding:8px 0; border-bottom:1px solid #eee;'>{$name}</td></tr>
            <tr><td style='padding:8px 0; border-bottom:1px solid #eee; color:#999;'>Email</td><td style='padding:8px 0; border-bottom:1px solid #eee;'><a href='mailto:" . clean($input['email']) . "' style='color:#c8a45c;'>" . clean($input['email']) . "</a></td></tr>
            <tr><td style='padding:8px 0; border-bottom:1px solid #eee; color:#999;'>Phone</td><td style='padding:8px 0; border-bottom:1px solid #eee;'>" . clean($input['phone'] ?? 'Not provided') . "</td></tr>
            <tr><td style='padding:8px 0; border-bottom:1px solid #eee; color:#999;'>Subject</td><td style='padding:8px 0; border-bottom:1px solid #eee; font-weight:600;'>" . clean($input['subject']) . "</td></tr>
            <tr><td style='padding:8px 0; color:#999;'>Message</td><td style='padding:8px 0;'>" . nl2br(clean($input['message'])) . "</td></tr>
        </table>
        <p style='margin-top:16px;'><a href='mailto:" . clean($input['email']) . "' style='display:inline-block; background-color:#c8a45c; color:#060606; padding:10px 24px; border-radius:6px; text-decoration:none; font-weight:600;'>Reply to {$name}</a></p>
    ";
    $adminHtml = emailTemplate('New Contact Message #' . $msgId, $adminBody, 'This is an automated notification from your website.');
    sendMail(ADMIN_EMAIL, ADMIN_NAME, "New Message from {$name}: " . clean($input['subject']), $adminHtml);

    // ── User confirmation ──
    $userBody = "
        <p>Hi <strong>" . clean($input['firstName']) . "</strong>,</p>
        <p>Thank you for reaching out to JMA Autos! We've received your message and will get back to you shortly.</p>
        <div style='background-color:#f9f9f9; border-radius:8px; padding:20px; margin:16px 0;'>
            <p style='margin:0 0 8px; color:#999; font-size:13px;'>Your message:</p>
            <p style='margin:0; font-style:italic; color:#555;'>\"" . nl2br(clean($input['message'])) . "\"</p>
        </div>
        <p>Our team typically responds within <strong>24 hours</strong>. For urgent inquiries, you can reach us directly at <a href='tel:+18321234567' style='color:#c8a45c;'>(832) 123-4567</a>.</p>
        <p>Best regards,<br><strong>The JMA Autos Team</strong></p>
    ";
    $userHtml = emailTemplate('We Got Your Message!', $userBody, "You're receiving this because you contacted us through our website.");
    sendMail(clean($input['email']), $name, "We Got Your Message — " . SITE_NAME, $userHtml);

    respond(true, 'Your message has been sent successfully! Check your email for confirmation.');
}

// ─── Newsletter Handler ─────────────────────────────────────────────────────────

function handleNewsletter(array $input, string $ip): void {
    if (empty($input['email'])) {
        respond(false, 'Email address is required.', 422);
    }

    if (!validateEmail($input['email'])) {
        respond(false, 'Invalid email address.', 422);
    }

    checkRateLimit($ip, 'newsletter');

    $db = getDB();
    $email = clean($input['email']);

    // Check if already subscribed
    $stmt = $db->prepare("SELECT id, is_active FROM newsletter_subscribers WHERE email = ?");
    $stmt->execute([$email]);
    $existing = $stmt->fetch();

    if ($existing) {
        if ($existing['is_active']) {
            respond(true, "You're already subscribed! Stay tuned for updates.");
        }
        // Re-activate
        $stmt = $db->prepare("UPDATE newsletter_subscribers SET is_active = 1, created_at = NOW() WHERE id = ?");
        $stmt->execute([$existing['id']]);
    } else {
        $stmt = $db->prepare("INSERT INTO newsletter_subscribers (email, ip_address) VALUES (?, ?)");
        $stmt->execute([$email, $ip]);
    }

    // ── Admin notification ──
    $adminBody = "
        <p>A new subscriber has joined your newsletter:</p>
        <table style='width:100%; border-collapse:collapse;'>
            <tr><td style='padding:8px 0; color:#999; width:100px;'>Email</td><td style='padding:8px 0; font-weight:600;'><a href='mailto:{$email}' style='color:#c8a45c;'>{$email}</a></td></tr>
        </table>
    ";
    $adminHtml = emailTemplate('New Newsletter Subscriber', $adminBody, 'This is an automated notification from your website.');
    sendMail(ADMIN_EMAIL, ADMIN_NAME, "New Subscriber: {$email}", $adminHtml);

    // ── User welcome email ──
    $userBody = "
        <p>Welcome aboard! 🎉</p>
        <p>You've been successfully subscribed to the <strong>JMA Autos</strong> newsletter. Here's what you can look forward to:</p>
        <ul style='padding-left:20px; line-height:2;'>
            <li>Early access to newly sourced inventory</li>
            <li>Exclusive deals and pricing alerts</li>
            <li>Insider tips on the luxury auto market</li>
            <li>Behind-the-scenes content from our sourcing trips</li>
        </ul>
        <p>In the meantime, feel free to <a href='" . SITE_URL . "/how-to-buy' style='color:#c8a45c;'>explore our buying process</a> or <a href='" . SITE_URL . "/contact' style='color:#c8a45c;'>get in touch</a> with our team.</p>
        <p>Best regards,<br><strong>The JMA Autos Team</strong></p>
    ";
    $userHtml = emailTemplate('Welcome to JMA Autos!', $userBody, "You're receiving this because you subscribed on our website. To unsubscribe, reply with 'unsubscribe'.");
    sendMail($email, 'Subscriber', "Welcome to the " . SITE_NAME . " Newsletter!", $userHtml);

    respond(true, "You've been subscribed successfully! Check your email for a welcome message.");
}
