import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  return (
    <div className="relative ml-auto flex-1 md:grow-0">
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
      <Input
        type="search"
        placeholder="Search..."
        className="w-full rounded-lg bg-white pl-8 dark:bg-slate-950 md:w-[200px] lg:w-[320px]"
      />
    </div>
  );
}
