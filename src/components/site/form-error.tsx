export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-sm border border-error/30 bg-error/5 p-3 text-sm text-error">
      {message}
    </p>
  );
}
