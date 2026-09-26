@echo off
chcp 65001 > nul
title Painel Visual Integrado (Dashboard)

echo ========================================================
echo   Iniciando Painel Visual Integrado com IA...
echo ========================================================
echo.

:: Verificar se Python está disponível
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Python detectado. Iniciando servidor local na porta 8000...
    echo.
    echo Abrindo http://localhost:8000/dashboard.html no seu navegador...
    start http://localhost:8000/dashboard.html
    echo.
    echo --------------------------------------------------------
    echo Servidor ativo! Atualizacoes do tasks.json refletirao
    echo automaticamente ao recarregar a pagina.
    echo Para encerrar o painel, basta fechar esta janela.
    echo --------------------------------------------------------
    echo.
    python -m http.server 8000
) else (
    echo [AVISO] Python nao foi encontrado no PATH.
    echo Abrindo o dashboard diretamente no navegador...
    start dashboard.html
)
pause
