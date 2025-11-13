<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Atualização de Usuário</title>
</head>
<body>
    <h1>Atualização de Usuário</h1>

    <p>Olá,</p>

    <p>O usuário <strong>{{ $user['name'] }}</strong> foi {{ $status }}.</p>

    <p>O projeto afetado foi:</p>
    <ul>
        <li>
            <strong>{{ $project['name'] }}</strong>
            @if(count($project['tasks']))
                <ul>
                    @foreach($project['tasks'] as $task)
                        <li>{{ $task['title'] }}</li>
                    @endforeach
                </ul>
            @endif
        </li>
    </ul>

    <p>Por favor, verifique os projetos afetados e as tarefas associadas, se necessário.</p>
</body>
</html>