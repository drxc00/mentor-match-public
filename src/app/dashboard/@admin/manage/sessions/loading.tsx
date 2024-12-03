import { Spinner } from "@/components/spinner";

export default function Loading() {
  return (
    <div>
      <div className="bg-gold w-full flex h-screen items-center justify-center">
        <Spinner size={"lg"} />
      </div>
    </div>
  );
}