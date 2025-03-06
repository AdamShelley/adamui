# @adamui/search-bar

-- WIP - NOT WORKING YET -- 


A customizable search bar component with autocomplete and animations.

## Installation

```bash
npm install @adamui/search-bar
```

Or with yarn:

```bash
yarn add @adamui/search-bar
```

## Tailwind CSS Setup

This component uses Tailwind CSS for styling. To make it work properly in your project:

1. Make sure Tailwind CSS is installed and configured in your project

2. Add the component to your Tailwind content configuration in `tailwind.config.js`:

```js
module.exports = {
  content: [
    // ...other paths
    './node_modules/@adamui/search-bar/**/*.{js,ts,jsx,tsx}'
  ],
  // ...rest of your config
}
```

## Usage

### Important: Including the Styles
The component's CSS is automatically included when you import the component. However, if your bundler doesn't process CSS imports from node_modules correctly, you may need to import the styles manually:

```jsx
// Import styles first
import '@adamui/search-bar/dist/index.css';
// Then import the component
import { SearchBar } from '@adamui/search-bar';
```

### Basic Example

```jsx
import { SearchBar } from '@adamui/search-bar';

const ExampleComponent = () => {
  const suggestions = [
    { id: 1, value: 'Apple' },
    { id: 2, value: 'Banana' },
    { id: 3, value: 'Cherry' },
    { id: 4, value: 'Date' },
    { id: 5, value: 'Elderberry' }
  ];

  return (
    <SearchBar 
      autoComplete={true}
      suggestions={suggestions}
      onSelect={(value) => console.log(`Selected: ${value}`)}
      onChange={(value) => console.log(`Input: ${value}`)}
    />
  )
}
```

## Dependencies

This package requires the following peer dependencies:

- React 18+
- Framer Motion 10+
- Tailwind CSS 3+

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | string | | Optional className to apply to the container |
| alwaysOpen | boolean | false | Whether the search is always open or toggles |
| autoComplete | boolean | false | Whether to show autocomplete suggestions |
| suggestions | Array<{ id: string \| number, value: string }> | [] | Suggestions for autocomplete |
| showClear | boolean | true | Whether to show a clear button when text is entered |
| onSelect | (value: string) => void | | Callback when a suggestion is selected |
| onChange | (value: string) => void | | Callback when input value changes |
| variant | 'default' \| 'minimal' \| 'bordered' | 'default' | Visual style variant |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Size of the search bar |
| placeholder | string | 'Search...' | Input placeholder text |
| borderColor | string | 'border-transparent' | Tailwind border color class |
| backgroundColor | string | 'bg-white' | Tailwind background color class |
| textColor | string | 'text-black' | Tailwind text color class |
| iconColor | string | | Tailwind icon color class |
| suggestionHighlightColor | string | 'bg-gray-100' | Tailwind bg color for highlighted suggestions |
| clearOnSelect | boolean | false | Whether to clear input when a suggestion is selected |
| closeOnSelect | boolean | false | Whether to close dropdown when a suggestion is selected |
| maxSuggestions | number | 4 | Maximum number of suggestions to show |

## Customization

The search bar is highly customizable using Tailwind CSS classes. You can change colors, sizes, and behaviors using the provided props.

```jsx
<SearchBar 
  variant="bordered"
  size="lg"
  backgroundColor="bg-slate-900"
  textColor="text-white"
  borderColor="border-slate-700"
  iconColor="text-blue-400"
/>
```

## Animation Configuration

You can customize the spring animations:

```jsx
<SearchBar 
  springConfig={{
    stiffness: 500,
    damping: 40
  }}
/>
```

## License

MIT
