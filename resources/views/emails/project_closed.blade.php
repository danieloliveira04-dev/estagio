<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Encerramento de Projeto</title>
</head>
<body>
    <h1>Projeto Encerrado</h1>

    <p>Olá,</p>

    <p>
        Informamos que o projeto <strong>{{ $project['name'] }}</strong> foi 
        <strong>encerrado</strong>.
    </p>

    @if(!empty($project['closeReason']))
        <p>
            <strong>Justificativa do encerramento:</strong><br>
            {{ $project['closeReason'] }}
        </p>
    @endif

    <p>
        Caso seja necessário revisar alguma informação ou documentação do projeto,
        ela permanecerá disponível no sistema para consulta.
    </p>
</body>
</html>
