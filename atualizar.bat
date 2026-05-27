@echo off
echo.
echo ========================================
echo   Acerto Motorista - Atualizador
echo ========================================
echo.

cd /d C:\Users\Vitor\Downloads\Acerto_Web_Github

echo Copiando arquivos novos da pasta Downloads...

if exist "%USERPROFILE%\Downloads\index.html" (
    copy /Y "%USERPROFILE%\Downloads\index.html" index.html > nul
    echo   OK - index.html copiado
) else (
    echo   AVISO - index.html nao encontrado em Downloads
)

if exist "%USERPROFILE%\Downloads\manifest.json" (
    copy /Y "%USERPROFILE%\Downloads\manifest.json" . > nul
    echo   OK - manifest.json copiado
)

if exist "%USERPROFILE%\Downloads\service-worker.js" (
    copy /Y "%USERPROFILE%\Downloads\service-worker.js" . > nul
    echo   OK - service-worker.js copiado
)

echo.
set /p MENSAGEM="O que foi alterado? "
echo.

echo Enviando para o GitHub...
git add .
git commit -m "%MENSAGEM%"
git push

echo.
echo ========================================
echo   Pronto! App atualizado no celular.
echo   (pode fechar esta janela)
echo ========================================
echo.
pause
