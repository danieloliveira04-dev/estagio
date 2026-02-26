<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Convite para o projeto</title>
</head>
<body>
    <h1>Você foi convidado para um projeto!</h1>

    <p>Olá, {{ $invitation['user'] ? $invitation['user']['name'] : '' }}</p>

    <p>
        Você foi convidado para participar do projeto
        <strong>{{ $invitation['project']['name'] }}</strong>
        com a função de
        <strong>{{ $invitation['role']['name'] }}</strong>.
    </p>

    <p>
        Para aceitar o convite, clique no link abaixo:
    </p>

    <p>
        <a href="{{ url('/projects/' . $invitation['projectId'] . '/invitation/accept') }}">
            Aceitar Convite
        </a>
    </p>

    <p>Se você não esperava este convite, apenas ignore este email.</p>
</body>
</html>