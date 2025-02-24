import * as React from "react";
import SearchBar from "../../src/components/search-bar/search-bar";

// Define some sample suggestions
const suggestions = [
  { id: 1, value: "Apple" },
  { id: 2, value: "Banana" },
  { id: 3, value: "Cherry" },
  { id: 4, value: "Date" },
  { id: 5, value: "Elderberry" },
  { id: 6, value: "Fig" },
  { id: 7, value: "Grape" },
  { id: 8, value: "Honeydew" },
  { id: 9, value: "Kiwi" },
  { id: 10, value: "Lemon" },
  { id: 11, value: "Mango" },
  { id: 12, value: "Nectarine" },
  { id: 13, value: "Orange" },
  { id: 14, value: "Papaya" },
  { id: 15, value: "Quince" },
  { id: 16, value: "Raspberry" },
  { id: 17, value: "Strawberry" },
  { id: 18, value: "Tangerine" },
  { id: 19, value: "Ugli" },
  { id: 20, value: "Vanilla" },
  { id: 21, value: "Watermelon" },
  { id: 22, value: "Xylocarp" },
  { id: 23, value: "Yellow" },
  { id: 24, value: "Zucchini" },
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
          <SearchBar
            autoComplete
            suggestions={suggestions}
            onSelect={(e) => console.log(e)}
            onChange={(e) => console.log(e)}
          />
        </div>
      </section>
    </div>
  );
}

export default App;
