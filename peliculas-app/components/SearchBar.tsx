"use client";

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
  onSearch: () => void;
  loading: boolean;
}

export default function SearchBar({ search, setSearch, onSearch, loading }: SearchBarProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="flex gap-4 mb-8 max-w-2xl mx-auto">
      <input
        type="text"
        placeholder="Buscar películas..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-1 p-4 rounded-xl bg-gray-800/80 border border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all duration-300 backdrop-blur-sm"
      />
      <button
        onClick={onSearch}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
      >
        {loading ? "Buscando..." : "Buscar"}
      </button>
    </div>
  );
}