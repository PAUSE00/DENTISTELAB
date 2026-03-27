<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Demande reçue</title>
<style>
  body { margin:0; padding:0; background:#080610; font-family:'Segoe UI',sans-serif; color:#f1f0f8; }
  .wrapper { max-width:520px; margin:40px auto; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:20px; overflow:hidden; }
  .header { background:linear-gradient(135deg,#60ddc6,#4f46e5); padding:32px 40px; text-align:center; }
  .header img { width:48px; height:48px; object-fit:contain; margin-bottom:12px; }
  .header h1 { margin:0; font-size:22px; font-weight:900; color:#fff; letter-spacing:-0.5px; }
  .body { padding:40px; }
  .body h2 { font-size:18px; font-weight:800; color:#fff; margin:0 0 12px; }
  .body p { font-size:14px; color:rgba(241,240,248,0.7); line-height:1.7; margin:0 0 16px; }
  .chip { display:inline-block; background:rgba(96,221,198,0.12); color:#60ddc6; border:1px solid rgba(96,221,198,0.25); border-radius:8px; padding:4px 12px; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:24px; }
  .footer { padding:20px 40px; text-align:center; font-size:11px; color:rgba(241,240,248,0.3); border-top:1px solid rgba(255,255,255,0.05); }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>DentalLab<span style="color:rgba(255,255,255,0.6)">Pro</span></h1>
  </div>
  <div class="body">
    <h2>Bonjour {{ $fullName }},</h2>
    <p>Nous avons bien reçu votre demande d'accès à la plateforme <strong>DentalLabPro</strong>.</p>
    <div class="chip">{{ $type === 'clinic' ? '🏥 Clinique Dentaire' : '🧪 Laboratoire Prothétique' }}</div>
    <p>Notre équipe va examiner votre dossier dans les meilleurs délais. Vous recevrez un e-mail dès que votre compte sera créé, avec vos identifiants de connexion.</p>
    <p style="font-size:13px;color:rgba(241,240,248,0.5);">Si vous avez des questions urgentes, contactez-nous à <a href="mailto:contact@dentallabpro.com" style="color:#60ddc6">contact@dentallabpro.com</a>.</p>
  </div>
  <div class="footer">© 2026 DentalLabPro — Agadir, Maroc</div>
</div>
</body>
</html>
