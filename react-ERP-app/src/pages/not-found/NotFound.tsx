import { Undo2 } from "lucide-react";
import { Link } from "react-router";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-8">
      <p className="font-bold text-9xl">404</p>
      <p className="mt-2">Страница не найдена</p>
      <Link
        className="flex gap-3 font-bold bg-primary text-secondary p-3 rounded-2xl mt-10"
        to={"/"}
      >
        <Undo2 />
        Вернуться
      </Link>
    </div>
  );
}
