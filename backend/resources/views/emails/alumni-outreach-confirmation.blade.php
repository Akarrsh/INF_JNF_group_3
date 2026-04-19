<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Alumni Outreach – Submission Confirmed</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1a237e 0%, #1565c0 100%); padding: 32px 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px;">IIT (ISM) Dhanbad</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 14px;">Career Development Centre – Alumni Outreach Program</p>
    </div>

    <!-- Body -->
    <div style="padding: 32px 24px; background: #ffffff; border: 1px solid #e0e0e0;">
        <p style="font-size: 16px;">Dear <strong>{{ $alumniName }}</strong>,</p>

        <p>
            Thank you for registering with the <strong>IIT (ISM) Dhanbad Alumni Outreach Program</strong>! 
            We are delighted to have you as part of our growing mentor community.
        </p>

        <div style="background: #f3f4f6; border-left: 4px solid #1565c0; padding: 16px 20px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0 0 8px; font-weight: bold; color: #1565c0;">Your Submission Summary</p>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                    <td style="padding: 4px 8px 4px 0; color: #666; width: 40%;">Degree</td>
                    <td style="padding: 4px 0; font-weight: 500;">{{ $degree }}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 8px 4px 0; color: #666;">Branch</td>
                    <td style="padding: 4px 0; font-weight: 500;">{{ $branch }}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 8px 4px 0; color: #666;">Year of Completion</td>
                    <td style="padding: 4px 0; font-weight: 500;">{{ $completionYear }}</td>
                </tr>
            </table>
        </div>

        <p>
            Our team will review your profile and match you with students based on your areas of interest. 
            We will reach out to you shortly with next steps.
        </p>

        <p>
            If you have any questions, please feel free to reach us at 
            <a href="mailto:iitismcdc@gmail.com" style="color: #1565c0;">iitismcdc@gmail.com</a>.
        </p>

        <p>Warm regards,<br>
        <strong>Career Development Centre</strong><br>
        IIT (Indian School of Mines), Dhanbad</p>
    </div>

    <!-- Footer -->
    <div style="background: #f5f5f5; padding: 16px 24px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;">
        <p style="font-size: 12px; color: #999; margin: 0;">
            This is an automated message from the IIT (ISM) Dhanbad CDC Portal. Please do not reply directly to this email.
        </p>
    </div>
</body>
</html>
