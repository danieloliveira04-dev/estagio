<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Convite</title>
</head>
<body>
    <h1>Você foi convidado!</h1>
    <p>Olá, {{ $invitation['email'] }}!</p>
    <p>
        Clique no link abaixo para aceitar o convite:
        <a href="{{ url('/invitation/' . $invitation['token']) }}">
            Aceitar Convite
        </a>
    </p>
</body>
</html>
