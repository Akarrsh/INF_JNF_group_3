<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #1976d2;">Edit Requested for {{ $formType }}</h2>
    
    <p>Hello Admin,</p>
    
    <p>A company has requested to edit a previously submitted form. The status has been automatically updated to <strong>edit_requested</strong>.</p>
    
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 120px;">Company:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{ $companyName }}</td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Requested By:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{ $requestedBy }}</td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Form Type:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{ $formType }}</td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Title:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{ $formTitle }}</td>
        </tr>
    </table>
    
    <p>Please log in to the CDC Admin Portal to review their request, or unlock the form for them.</p>
    
    <p style="margin-top: 30px; font-size: 0.9em; color: #777;">
        This is an automated message from the IIT ISM CDC Placement Portal.
    </p>
</body>
</html>
