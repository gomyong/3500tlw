#!/usr/bin/env bash
set -euo pipefail

jdk17=""
for c in "/opt/homebrew/opt/openjdk@17" "/usr/local/opt/openjdk@17"; do
  if [[ -x "$c/bin/java" ]]; then
    jdk17="$c"
    break
  fi
done
if [[ -z "$jdk17" ]] && command -v /usr/libexec/java_home >/dev/null 2>&1; then
  jdk17="$(/usr/libexec/java_home -v 17 2>/dev/null || true)"
fi

if [[ -z "$jdk17" ]]; then
  echo "Android 빌드에는 JDK 17이 필요합니다. 설치 예: brew install openjdk@17" >&2
  exit 1
fi

export JAVA_HOME="$jdk17"
export PATH="$JAVA_HOME/bin:$PATH"

if [[ -z "${ANDROID_HOME:-}" ]]; then
  if [[ -d "$HOME/Library/Android/sdk" ]]; then
    export ANDROID_HOME="$HOME/Library/Android/sdk"
  fi
fi
if [[ -z "${ANDROID_HOME:-}" ]]; then
  echo "Android SDK를 찾을 수 없습니다. Android Studio를 설치하거나 ANDROID_HOME을 설정하세요." >&2
  echo "예: export ANDROID_HOME=\"\$HOME/Library/Android/sdk\"" >&2
  exit 1
fi

exec npx expo run:android "$@"
