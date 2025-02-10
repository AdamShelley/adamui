import SearchBar from "../../src/components/search-bar/search-bar";

// Define some sample suggestions
const suggestions = [
  { id: 1, value: "Apple" },
  { id: 2, value: "Banana" },
  { id: 3, value: "Cherry" },
  { id: 4, value: "Date" },
  { id: 5, value: "Elderberry" },
];

function App() {
  return (
    <div className="min-h-screen p-8 flex flex-col w-screen gap-4">
      <h1 className="text-3xl font-bold mb-8 text-center">ADAMUI</h1>

      <h2 className="text-2xl font-bold mb-4">Search Bar</h2>
      <section className="w-full flex justify-center gap-2">
        <div className="flex flex-col align-center gap-4">
          <span>Standard</span>
          <SearchBar />
          <span>Always Open</span>
          <SearchBar alwaysOpen />
          <span>Autocomplete Dropdown</span>
          <SearchBar autoComplete suggestions={suggestions} />
        </div>
      </section>
    </div>
  );
}

export default App;
