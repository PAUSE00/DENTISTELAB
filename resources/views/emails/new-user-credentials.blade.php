<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Vos identifiants DentalLabPro</title>
<style>
  body { margin:0; padding:0; background:#080610; font-family:'Segoe UI',sans-serif; color:#f1f0f8; }
  .wrapper { max-width:520px; margin:40px auto; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:20px; overflow:hidden; }
  .header { background:linear-gradient(135deg,#60ddc6,#4f46e5); padding:32px 40px; text-align:center; }
  .header h1 { margin:0; font-size:22px; font-weight:900; color:#fff; letter-spacing:-0.5px; }
  .body { padding:40px; }
  .body h2 { font-size:18px; font-weight:800; color:#fff; margin:0 0 12px; }
  .body p { font-size:14px; color:rgba(241,240,248,0.7); line-height:1.7; margin:0 0 16px; }
  .creds-box { background:rgba(96,221,198,0.06); border:1px solid rgba(96,221,198,0.2); border-radius:14px; padding:24px; margin:24px 0; }
  .creds-box p { margin:0 0 8px; font-size:13px; color:rgba(241,240,248,0.6); }
  .creds-box p:last-child { margin:0; }
  .creds-box strong { color:#60ddc6; font-size:15px; display:block; margin-top:2px; }
  .btn { display:block; text-align:center; background:linear-gradient(135deg,#60ddc6,#4f46e5); color:#fff; text-decoration:none; padding:14px 24px; border-radius:12px; font-weight:800; font-size:15px; margin-top:28px; }
  .warning { font-size:12px; color:rgba(241,240,248,0.4); margin-top:20px; text-align:center; }
  .footer { padding:20px 40px; text-align:center; font-size:11px; color:rgba(241,240,248,0.3); border-top:1px solid rgba(255,255,255,0.05); }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>🦷 DentalLab<span style="color:rgba(255,255,255,0.6)">Pro</span></h1>
  </div>
  <div class="body">
    <h2>Bienvenue {{ $name }} !</h2>
    <p>Votre compte <strong>DentalLabPro</strong> a été créé. Vous pouvez maintenant accéder à la plateforme avec les identifiants ci-dessous.</p>

    <div class="creds-box">
      <p>📧 Adresse e-mail
        <strong>{{ $email }}</strong>
      </p>
      <p>🔑 Mot de passe temporaire
        <strong>{{ $password }}</strong>
      </p>
      <p>👤 Rôle
        <strong>{{ ucfirst(str_replace('_', ' ', $role)) }}</strong>
      </p>
    </div>

    <a href="{{ $loginUrl }}" class="btn">Accéder à la plateforme →</a>

    <p class="warning">⚠️ Pour votre sécurité, veuillez changer votre mot de passe dès votre première connexion.</p>
  </div>
  <div class="footer">© 2026 DentalLabPro — Agadir, Maroc</div>
</div>
</body>
</html>
