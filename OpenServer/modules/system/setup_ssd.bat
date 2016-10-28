@echo off
"%windir%\system32\reg.exe" ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem" /v DisableDeleteNotification /t REG_DWORD /d 0x0 /f   2>nul >nul
"%windir%\system32\reg.exe" ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem" /v NtfsDisableLastAccessUpdate /t REG_DWORD /d 0x1 /f 2>nul >nul
"%windir%\system32\reg.exe" ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\iaStor\Parameters\Port0" /v LPM /t REG_DWORD /d 0x0 /f           2>nul >nul
"%windir%\system32\reg.exe" ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\iaStor\Parameters\Port0" /v LPMDSTATE /t REG_DWORD /d 0x0 /f     2>nul >nul
"%windir%\system32\reg.exe" ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\iaStor\Parameters\Port0" /v DIPM /t REG_DWORD /d 0x0 /f          2>nul >nul
"%windir%\system32\reg.exe" ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\iaStor\Parameters\Port1" /v LPM /t REG_DWORD /d 0x0 /f           2>nul >nul
"%windir%\system32\reg.exe" ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\iaStor\Parameters\Port1" /v LPMDSTATE /t REG_DWORD /d 0x0 /f     2>nul >nul
"%windir%\system32\reg.exe" ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\iaStor\Parameters\Port1" /v DIPM /t REG_DWORD /d 0x0 /f          2>nul >nul
"%windir%\system32\reg.exe" ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\iaStor\Parameters\Port2" /v LPM /t REG_DWORD /d 0x0 /f           2>nul >nul
"%windir%\system32\reg.exe" ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\iaStor\Parameters\Port2" /v LPMDSTATE /t REG_DWORD /d 0x0 /f     2>nul >nul
"%windir%\system32\reg.exe" ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\iaStor\Parameters\Port2" /v DIPM /t REG_DWORD /d 0x0 /f          2>nul >nul
"%windir%\system32\reg.exe" ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\iaStor\Parameters\Port3" /v LPM /t REG_DWORD /d 0x0 /f           2>nul >nul
"%windir%\system32\reg.exe" ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\iaStor\Parameters\Port3" /v LPMDSTATE /t REG_DWORD /d 0x0 /f     2>nul >nul
"%windir%\system32\reg.exe" ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\iaStor\Parameters\Port3" /v DIPM /t REG_DWORD /d 0x0 /f          2>nul >nul
"%windir%\system32\reg.exe" ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\iaStor\Parameters\Port4" /v LPM /t REG_DWORD /d 0x0 /f           2>nul >nul
"%windir%\system32\reg.exe" ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\iaStor\Parameters\Port4" /v LPMDSTATE /t REG_DWORD /d 0x0 /f     2>nul >nul
"%windir%\system32\reg.exe" ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\iaStor\Parameters\Port4" /v DIPM /t REG_DWORD /d 0x0 /f          2>nul >nul
"%windir%\system32\reg.exe" ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\iaStor\Parameters\Port5" /v LPM /t REG_DWORD /d 0x0 /f           2>nul >nul
"%windir%\system32\reg.exe" ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\iaStor\Parameters\Port5" /v LPMDSTATE /t REG_DWORD /d 0x0 /f     2>nul >nul
"%windir%\system32\reg.exe" ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\iaStor\Parameters\Port5" /v DIPM /t REG_DWORD /d 0x0 /f          2>nul >nul
"%windir%\system32\reg.exe" ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v ClearPageFileAtShutdown /t REG_DWORD /d 0x0 /f             2>nul >nul
"%windir%\system32\reg.exe" ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v LargeSystemCache /t REG_DWORD /d 0x0 /f                    2>nul >nul
"%windir%\system32\reg.exe" ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\PrefetchParameters" /v EnablePrefetcher /t REG_DWORD /d 0x0 /f 2>nul >nul
"%windir%\system32\reg.exe" ADD "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\PrefetchParameters" /v EnableSuperfetch /t REG_DWORD /d 0x0 /f 2>nul >nul
EXIT