import type { ReactNode } from "react";

interface Props { controls: ReactNode; children: ReactNode; search?: ReactNode }

export default function PickerLayout({ controls, children, search }: Props) {
  return <div className="picker-layout">
    <div className="picker-controls">{controls}</div>
    <div className="picker-result">{children}</div>
    {search && <div className="picker-search">{search}</div>}
  </div>;
}