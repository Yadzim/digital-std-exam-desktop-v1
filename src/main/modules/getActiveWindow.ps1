try {
  [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
  Add-Type @"
  using System;
  using System.Runtime.InteropServices;
  using System.Text;
  public class Win32 {
    [DllImport("user32.dll")]
    public static extern IntPtr GetForegroundWindow();
    [DllImport("user32.dll")]
    public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);
    [DllImport("user32.dll")]
    public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint processId);
  }
"@
  $hWnd = [Win32]::GetForegroundWindow()
  $sb = New-Object System.Text.StringBuilder 256
  $null = [Win32]::GetWindowText($hWnd, $sb, $sb.Capacity)
  $processId = 0
  $null = [Win32]::GetWindowThreadProcessId($hWnd, [ref]$processId)
  $process = Get-Process -Id $processId -ErrorAction SilentlyContinue

  $result = @{
    title       = $sb.ToString()
    processName = if ($process) { $process.ProcessName } else { "" }
    id          = $processId
  }
  $result | ConvertTo-Json
}
catch {
  Write-Error $_
}
