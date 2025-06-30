import { Input } from "@/components/ui/input";

type SearchInputProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export function SearchInput({ searchQuery, setSearchQuery }: SearchInputProps) {
  return (
    <Input
      type="text"
      placeholder="Поиск"
      className="w-[250px]"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  );
}
