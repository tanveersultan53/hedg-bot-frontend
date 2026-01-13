# Components Folder

This folder contains **shared/reusable components** used across multiple pages.

## Current Components

### Spinner
- **File**: `Spinner.jsx`, `Spinner.css`
- **Purpose**: Loading spinner using HEDG logo
- **Usage**: Can be used in any page that needs a loading state

```jsx
import Spinner from '../components/Spinner';

<Spinner size={80} speed={1} />
```

## Guidelines

- ✅ **DO**: Add reusable components here (buttons, inputs, cards, etc.)
- ✅ **DO**: Keep components generic and configurable
- ❌ **DON'T**: Add page-specific components (those go in `/pages`)
- ❌ **DON'T**: Add business logic (use services or hooks)

## Examples of Components to Add

- Button components (primary, secondary, etc.)
- Input/Form components
- Card/Modal components
- Navigation components
- Icon components
