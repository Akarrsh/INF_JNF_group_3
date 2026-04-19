<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>New Alumni Outreach Submission</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 650px; margin: 0 auto;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #4a148c 0%, #7b1fa2 100%); padding: 28px 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 20px;">🎓 New Alumni Outreach Submission</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 14px;">IIT (ISM) Dhanbad – Career Development Centre</p>
    </div>

    <!-- Body -->
    <div style="padding: 28px 24px; background: #ffffff; border: 1px solid #e0e0e0;">
        <p>A new alumni has registered for the mentorship outreach program. Please review the details below:</p>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 12px;">
            <thead>
                <tr style="background-color: #f3e5f5;">
                    <th style="padding: 10px; border: 1px solid #e0e0e0; text-align: left; color: #6a1b9a; width: 35%;">Field</th>
                    <th style="padding: 10px; border: 1px solid #e0e0e0; text-align: left; color: #6a1b9a;">Details</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="padding: 9px 10px; border: 1px solid #e0e0e0; font-weight: 600; color: #444;">Full Name</td>
                    <td style="padding: 9px 10px; border: 1px solid #e0e0e0;">{{ $alumniName }}</td>
                </tr>
                <tr style="background:#fafafa;">
                    <td style="padding: 9px 10px; border: 1px solid #e0e0e0; font-weight: 600; color: #444;">Email</td>
                    <td style="padding: 9px 10px; border: 1px solid #e0e0e0;">
                        <a href="mailto:{{ $alumniEmail }}" style="color: #6a1b9a;">{{ $alumniEmail }}</a>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 9px 10px; border: 1px solid #e0e0e0; font-weight: 600; color: #444;">Phone</td>
                    <td style="padding: 9px 10px; border: 1px solid #e0e0e0;">{{ $phone }}</td>
                </tr>
                <tr style="background:#fafafa;">
                    <td style="padding: 9px 10px; border: 1px solid #e0e0e0; font-weight: 600; color: #444;">Degree</td>
                    <td style="padding: 9px 10px; border: 1px solid #e0e0e0;">{{ $degree }}</td>
                </tr>
                <tr>
                    <td style="padding: 9px 10px; border: 1px solid #e0e0e0; font-weight: 600; color: #444;">Branch</td>
                    <td style="padding: 9px 10px; border: 1px solid #e0e0e0;">{{ $branch }}</td>
                </tr>
                <tr style="background:#fafafa;">
                    <td style="padding: 9px 10px; border: 1px solid #e0e0e0; font-weight: 600; color: #444;">Year of Completion</td>
                    <td style="padding: 9px 10px; border: 1px solid #e0e0e0;">{{ $completionYear }}</td>
                </tr>
                <tr>
                    <td style="padding: 9px 10px; border: 1px solid #e0e0e0; font-weight: 600; color: #444;">Current Job</td>
                    <td style="padding: 9px 10px; border: 1px solid #e0e0e0;">{{ $currentJob }}</td>
                </tr>
                <tr style="background:#fafafa;">
                    <td style="padding: 9px 10px; border: 1px solid #e0e0e0; font-weight: 600; color: #444;">Current Location</td>
                    <td style="padding: 9px 10px; border: 1px solid #e0e0e0;">{{ $currentLocation ?: '(Not provided)' }}</td>
                </tr>
                <tr>
                    <td style="padding: 9px 10px; border: 1px solid #e0e0e0; font-weight: 600; color: #444;">Areas of Interest</td>
                    <td style="padding: 9px 10px; border: 1px solid #e0e0e0;">{{ $areasOfInterest }}</td>
                </tr>
                <tr style="background:#fafafa;">
                    <td style="padding: 9px 10px; border: 1px solid #e0e0e0; font-weight: 600; color: #444;">LinkedIn Profile</td>
                    <td style="padding: 9px 10px; border: 1px solid #e0e0e0;">
                        <a href="{{ $linkedinProfile }}" style="color: #0077b5;">{{ $linkedinProfile }}</a>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 9px 10px; border: 1px solid #e0e0e0; font-weight: 600; color: #444;">Willing to Visit Campus</td>
                    <td style="padding: 9px 10px; border: 1px solid #e0e0e0;">
                        @if($willingToVisit === 'yes')
                            ✅ Yes
                        @elseif($willingToVisit === 'maybe')
                            🤔 Maybe
                        @elseif($willingToVisit === 'no')
                            ❌ No
                        @else
                            (Not specified)
                        @endif
                    </td>
                </tr>
                @if($generalComments)
                <tr style="background:#fafafa;">
                    <td style="padding: 9px 10px; border: 1px solid #e0e0e0; font-weight: 600; color: #444;">General Comments</td>
                    <td style="padding: 9px 10px; border: 1px solid #e0e0e0; white-space: pre-wrap;">{{ $generalComments }}</td>
                </tr>
                @endif
            </tbody>
        </table>
    </div>

    <!-- Footer -->
    <div style="background: #f5f5f5; padding: 16px 24px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;">
        <p style="font-size: 12px; color: #999; margin: 0;">
            This is an automated notification from the IIT (ISM) CDC Placement Portal.
        </p>
    </div>
</body>
</html>
