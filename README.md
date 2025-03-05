# AdamUI

A collection of modern React components built with TypeScript, Tailwind CSS, and Framer Motion.

## Components

### SearchBar

A customizable search bar component with autocomplete and animations.

```bash
npm install @adamui/search-bar
```

#### Required Peer Dependencies

```bash
npm install react react-dom framer-motion tailwindcss
```

#### Features

- 🎨 Customizable styling with Tailwind CSS
- ✨ Smooth animations using Framer Motion
- 🔍 Autocomplete suggestions
- 📱 Responsive design
- 🔄 Clear input button option

#### Basic Usage

```tsx
import { SearchBar } from "@adamui/search-bar";

function App() {
  // Your suggestions should have id and value properties
  const suggestions = [
    { id: 1, value: "Apple" },
    { id: 2, value: "Banana" },
    { id: 3, value: "Cherry" },
  ];

  return (
    <SearchBar
      autoComplete
      showClear={true}
      suggestions={suggestions}
      onSelect={(item) => console.log("Selected:", item)}
      onChange={(value) => console.log("Input changed:", value)}
    />
  );
}
```

#### Props

| Prop         | Type                                                | Default   | Description                            |
| ------------ | --------------------------------------------------- | --------- | -------------------------------------- |
| alwaysOpen   | boolean                                             | false     | Keep the search input always visible   |
| autoComplete | boolean                                             | false     | Enable autocomplete dropdown           |
| showClear    | boolean                                             | false     | Show a clear button in the input       |
| suggestions  | Array<{id: string\|number, value: string}>          | []        | Suggestions to display in the dropdown |
| onSelect     | (item: {id: string\|number, value: string}) => void | undefined | Callback when a suggestion is selected |
| onChange     | (value: string) => void                             | undefined | Callback when input value changes      |

For detailed documentation of each component, please refer to their individual README files in the components directory.
