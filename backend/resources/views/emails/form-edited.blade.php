<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ $formType }} Edited by Admin</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
    <h2>IIT ISM CDC Portal</h2>
    <p>The CDC Administration has made some modifications to your submitted {{ $formType }}: <strong>{{ $title }}</strong>.</p>
    
    <p>Below is a summary of the fields that were updated:</p>
    
    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <thead>
            <tr style="background-color: #f8f9fa; text-align: left;">
                <th style="padding: 10px; border: 1px solid #dee2e6;">Field</th>
                <th style="padding: 10px; border: 1px solid #dee2e6;">Previous Value</th>
                <th style="padding: 10px; border: 1px solid #dee2e6;">New Value</th>
            </tr>
        </thead>
        <tbody>
            @foreach($changes as $field => $change)
            <tr>
                <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">{{ $field }}</td>
                <td style="padding: 10px; border: 1px solid #dee2e6; color: #dc3545;">
                    @if(is_array($change['old']))
                        <pre style="margin: 0; font-size: 0.9em; white-space: pre-wrap;">{{ json_encode($change['old'], JSON_PRETTY_PRINT) }}</pre>
                    @elseif(is_bool($change['old']))
                        {{ $change['old'] ? 'true' : 'false' }}
                    @else
                        {{ $change['old'] ?? '(Empty)' }}
                    @endif
                </td>
                <td style="padding: 10px; border: 1px solid #dee2e6; color: #198754;">
                    @if(is_array($change['new']))
                        <pre style="margin: 0; font-size: 0.9em; white-space: pre-wrap;">{{ json_encode($change['new'], JSON_PRETTY_PRINT) }}</pre>
                    @elseif(is_bool($change['new']))
                        {{ $change['new'] ? 'true' : 'false' }}
                    @else
                        {{ $change['new'] ?? '(Empty)' }}
                    @endif
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <p style="margin-top: 20px;">Please review these changes in your Company Portal dashboard.</p>
    
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="font-size: 12px; color: #777;">
        This is an automated message from the IIT (ISM) Dhanbad Career Development Centre. Please do not reply directly to this email.
    </p>
</body>
</html>
