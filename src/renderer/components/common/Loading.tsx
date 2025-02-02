export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center text-black dark:text-white bg-white dark:bg-[#1e1e1e]">
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
