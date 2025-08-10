// src/app/dashboard/salones/layout.tsx
import { ReactNode } from 'react';

export default function SalonesLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
