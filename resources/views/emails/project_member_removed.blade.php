<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Membro removido do projeto</title>
</head>
<body>
    <h2>Membro removido do projeto: {{ $project['name'] }}</h2>

    <p>O membro <strong>{{ $member['user']['name'] ?? 'Desconhecido' }}</strong> foi removido do projeto.</p>

    @if(!empty($tasks))
        <p>As tasks que estavam atribuídas a ele:</p>
        <ul>
            @foreach($tasks as $task)
                <li>{{ $task['title'] ?? 'Tarefa sem título' }}</li>
            @endforeach
        </ul>
    @else
        <p>Este membro não tinha tasks atribuídas.</p>
    @endif

    <p>Para mais detalhes, acesse o projeto: <a href="{{ url("/projects/{$project['id']}") }}">Ver projeto</a></p>

    <hr>
    <p>Esta é uma notificação automática.</p>
</body>
</html>