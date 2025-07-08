<?php
// إعدادات البريد الإلكتروني
$to = "Mahmud@sgsintercool.com"; // استبدل هذا بعنوان البريد الإلكتروني الذي تريد استقبال الطلبات عليه
$subject = "New Job Application Submission";

// معالجة بيانات النموذج
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // تنظيف المدخلات
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $phone = strip_tags(trim($_POST["phone"]));
    $position = strip_tags(trim($_POST["position"]));
    $experience = strip_tags(trim($_POST["experience"]));
    $message = strip_tags(trim($_POST["message"]));
    
    // التحقق من البيانات
    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Please complete the form and try again.";
        exit;
    }
    
    // بناء محتوى البريد الإلكتروني
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Phone: $phone\n\n";
    $email_content .= "Desired Position: $position\n";
    $email_content .= "Years of Experience: $experience\n\n";
    $email_content .= "Cover Letter:\n$message\n";
    
    // رأس البريد الإلكتروني
    $email_headers = "From: $name <$email>";
    
    // معالجة ملف السيرة الذاتية المرفق
    if (isset($_FILES['cv']) && $_FILES['cv']['error'] == UPLOAD_ERR_OK) {
        $file_name = $_FILES['cv']['name'];
        $file_size = $_FILES['cv']['size'];
        $file_tmp = $_FILES['cv']['tmp_name'];
        $file_type = $_FILES['cv']['type'];
        
        // تحديد أنواع الملفات المسموح بها
        $allowed_types = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/csv'];
        
        if (in_array($file_type, $allowed_types)) {
            // قراءة محتوى الملف
            $file_content = chunk_split(base64_encode(file_get_contents($file_tmp)));
            
            // حدود فريدة للبريد
            $boundary = md5(time());
            
            // تعديل الرأس ليتضمن مرفقات
            $email_headers = "From: $name <$email>\r\n";
            $email_headers .= "MIME-Version: 1.0\r\n";
            $email_headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";
            
            // بناء نص البريد مع المرفق
            $email_body = "--$boundary\r\n";
            $email_body .= "Content-Type: text/plain; charset=\"utf-8\"\r\n";
            $email_body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
            $email_body .= $email_content . "\r\n\r\n";
            
            $email_body .= "--$boundary\r\n";
            $email_body .= "Content-Type: $file_type; name=\"$file_name\"\r\n";
            $email_body .= "Content-Disposition: attachment; filename=\"$file_name\"\r\n";
            $email_body .= "Content-Transfer-Encoding: base64\r\n\r\n";
            $email_body .= $file_content . "\r\n";
            $email_body .= "--$boundary--";
            
            $email_content = $email_body;
        }
    }
    
    // إرسال البريد الإلكتروني
    if (mail($to, $subject, $email_content, $email_headers)) {
        http_response_code(200);
        echo "Thank you! Your application has been submitted.";
    } else {
        http_response_code(500);
        echo "Oops! Something went wrong and we couldn't send your message.";
    }
} else {
    http_response_code(403);
    echo "There was a problem with your submission, please try again.";
}
?>