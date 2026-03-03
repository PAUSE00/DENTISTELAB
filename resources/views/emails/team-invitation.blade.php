<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background: linear-gradient(135deg, #059669, #10b981);
            color: white;
            padding: 30px;
            border-radius: 12px 12px 0 0;
            text-align: center;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
        }

        .content {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            padding: 30px;
        }

        .btn {
            display: inline-block;
            background: #059669;
            color: white;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
        }

        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #9ca3af;
            border-radius: 0 0 12px 12px;
            background: #f9fafb;
        }

        .credentials {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 12px 16px;
            margin: 16px 0;
            border-radius: 0 8px 8px 0;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>🦷 DentalLab</h1>
        <p>Bienvenue dans notre équipe</p>
    </div>
    <div class="content">
        <p>Bonjour <strong>{{ $invitedUser->name }}</strong>,</p>
        <p><strong>{{ $inviter->name }}</strong> vous a ajouté à son équipe sur la plateforme DentalLab.</p>

        <p>Voici vos informations de connexion par défaut. Nous vous recommandons de les modifier rapidement :</p>

        <div class="credentials">
            <strong>Email :</strong> {{ $invitedUser->email }}<br>
            <strong>Mot de passe :</strong> {{ $password }}
        </div>

        <div style="text-align: center;">
            <a href="{{ route('login') }}" class="btn">Me connecter</a>
        </div>

    </div>
    <div class="footer">
        <p>&copy; {{ date('Y') }} DentalLab — Plateforme de gestion de prothèses dentaires</p>
    </div>
</body>

</html>