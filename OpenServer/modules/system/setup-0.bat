@echo off
"%windir%\system32\cacls.exe"   "%windir%\system32\drivers\etc\hosts" /C /E /P  "%USERNAME%":F    2>nul >nul
"%windir%\system32\cacls.exe"   "%windir%\system32\drivers\etc\hosts" /C /E /G  "%USERNAME%":F    2>nul >nul
"%windir%\system32\icacls.exe"  "%windir%\system32\drivers\etc\hosts" /remove:d "%USERNAME%" /C   2>nul >nul
"%windir%\system32\icacls.exe"  "%windir%\system32\drivers\etc\hosts" /grant:r  "%USERNAME%":F /C 2>nul >nul
"%windir%\system32\takeown.exe" /f "%windir%\system32\drivers\etc\hosts"                          2>nul >nul
"%windir%\system32\attrib.exe"  -s -r -h "%windir%\system32\drivers\etc\hosts"                    2>nul >nul
"%windir%\system32\reg.exe" ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip6\Parameters" /v DisabledComponents /t REG_DWORD /d 0x20 /f     2>nul >nul
"%windir%\system32\reg.exe" ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\Tcpip\Parameters" /v MaxUserPort /t REG_DWORD /d 0x0000fffe /f       2>nul >nul
"%windir%\system32\reg.exe" ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\Tcpip\Parameters" /v TcpNumConnections /t REG_DWORD /d 0x0000fffe /f 2>nul >nul
"%windir%\system32\reg.exe" ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\Tcpip\Parameters" /v TcpTimedWaitDelay /t REG_DWORD /d 0x0000001e /f 2>nul >nul
"%windir%\system32\reg.exe" ADD "HKEY_CURRENT_USER\Control Panel\Desktop" /v AutoEndTasks /t REG_SZ /d 0 /f                                                2>nul >nul
"%windir%\system32\reg.exe" ADD "HKEY_CURRENT_USER\Control Panel\Desktop" /v WaitToKillAppTimeout /t REG_SZ /d 30000 /f                                    2>nul >nul
EXIT