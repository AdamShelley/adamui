# @adamui/search-bar

A customizable search bar component with autocomplete and animations for React applications.

## Installation

```bash
npm install @adamui/search-bar
```

### Peer Dependencies

This package requires the following peer dependencies:

```bash
npm install react framer-motion tailwindcss
```

## Features

- 🎨 Customizable styling with Tailwind CSS
- ✨ Smooth animations using Framer Motion
- 🔍 Autocomplete suggestions
- 📱 Responsive design
- 🎯 Different sizes and variants

## Usage

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

## Props

| Prop | Type | Description |
|------|------|-------------|
| placeholder | string | Placeholder text for the search input |
| suggestions | Array<{ id: string, label: string }> | Array of suggestion items |
| onSearch | (value: string) => void | Callback when search is triggered |
| onSuggestionClick | (suggestion: Suggestion) => void | Callback when a suggestion is clicked |
| variant | 'default' \| 'outline' \| 'ghost' | Visual style variant |
| size | 'sm' \| 'md' \| 'lg' | Size of the search bar |

