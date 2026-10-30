#!/usr/bin/env sh
# Local secret scan for staged changes. CI always enforces gitleaks, so a
# missing local binary only prints an install hint instead of blocking commits.
if command -v gitleaks >/dev/null 2>&1; then
  exec gitleaks git --pre-commit --staged --redact --no-banner
fi
echo "gitleaks not installed - skipping local secret scan (CI enforces it)."
echo "Install: https://github.com/gitleaks/gitleaks#installing"
