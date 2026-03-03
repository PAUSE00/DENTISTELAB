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
            background: linear-gradient(135deg, #2563eb, #7c3aed);
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
            background: #2563eb;
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

        .expires {
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
        <p>Invitation à rejoindre notre réseau</p>
    </div>
    <div class="content">
        <p>Bonjour,</p>
        <p>Le laboratoire <strong>{{ $labName }}</strong> vous invite à rejoindre la plateforme DentalLab pour simplifier la gestion de vos commandes de prothèses dentaires.</p>

        <p>En acceptant cette invitation, vous pourrez :</p>
        <ul>
            <li>Passer des commandes en ligne 24h/24</li>
            <li>Suivre l'avancement en temps réel</li>
            <li>Communiquer directement avec le laboratoire</li>
            <li>Télécharger vos factures et fiches de travail</li>
        </ul>

        <div style="text-align: center;">
            <a href="{{ $invitationUrl }}" class="btn">Accepter l'invitation</a>
        </div>

        <div class="expires">
            ⏰ Cette invitation expire le <strong>{{ $expiresAt }}</strong>.
        </div>

        <p>Si vous n'avez pas demandé cette invitation, vous pouvez simplement ignorer cet email.</p>
    </div>
    <div class="footer">
        <p>&copy; {{ date('Y') }} DentalLab — Plateforme de gestion de prothèses dentaires</p>
    </div>
</body>

</html>