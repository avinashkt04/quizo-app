import loading from "../assets/loading.gif";

export function Spinner({ className }: { className?: string }) {
  return (
    <div className="flex justify-center items-center">
      <img src={loading} alt="Loading" className={`${className}`} />
    </div>
  );
}