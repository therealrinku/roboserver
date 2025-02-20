import { ReactNode } from 'react';

interface Props {
  text: string;
  iconComponent?: ReactNode;
  description?: string;
  buttonText?: string;
  buttonOnClick?: () => void;
}

export default function EmptyState({
  text,
  iconComponent,
  description,
  buttonOnClick,
  buttonText,
}: Props) {
  return (
    <div className="w-full flex flex-col mt-3 gap-4">
      {iconComponent && iconComponent}
      <p className="font-bold">{text}</p>
      {description && <p>{description}</p>}
      {buttonText && (
        <button
          className="self-start font-bold text-green-800"
          onClick={buttonOnClick}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
