"use client";

import { useEffect, type ReactNode } from "react";
import { I18nProvider, useI18n } from "@/lib/i18n";

function DirSetter({ children }: { children: ReactNode }) {
  const { dir, lang } = useI18n();

  useEffect(() => {
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
  }, [dir, lang]);

  return <>{children}</>;
}

export function I18nWrapper({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <DirSetter>{children}</DirSetter>
    </I18nProvider>
  );
}
