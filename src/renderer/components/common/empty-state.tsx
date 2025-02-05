import { ReactNode } from 'react';

interface Props {
  text: string;
  iconComponent?: ReactNode;
  description?: string;
}

export default function EmptyState({
  text,
  iconComponent,
  description,
}: Props) {
  return (
    <div className="w-full flex flex-col mt-3 gap-4">
      {iconComponent && iconComponent}
      <p className="font-bold">{text}</p>
      {description && <p>{description}</p>}
    </div>
  );
}
