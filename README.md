# AdamUI

A collection of modern React components built with TypeScript, Tailwind CSS, and Framer Motion.

## Components

### SearchBar

A customizable search bar component with autocomplete and animations.

```bash
npm install @adamui/search-bar
```

#### Required Peer Dependencies

Requires Tailwind 

```bash

npm install motion
```

#### Features

- 🎨 Customizable styling with Tailwind CSS
- ✨ Smooth animations using Framer Motion
- 🔍 Autocomplete suggestions
- 📱 Responsive design
- 🎯 Different sizes and variants

#### Basic Usage

```tsx
import { SearchBar } from '@adamui/search-bar';

function App() {
  const suggestions = [
    { id: '1', label: 'Suggestion 1' },
    { id: '2', label: 'Suggestion 2' },
  ];

  return (
    <SearchBar
      placeholder="Search..."
      suggestions={suggestions}
      onSearch={(value) => console.log('Search:', value)}
      onSuggestionClick={(suggestion) => console.log('Selected:', suggestion)}
    />
  );
}
```

For detailed documentation of each component, please refer to their individual README files in the components directory.


