<div align="center">
  <img src='https://github.com/erictooth/react-use-pagination/raw/master/media/react-use-pagination.png' width="50%" alt='react-use-pagination' />
</div>

<h3 align="center">A React hook to help manage pagination state</h3>

<p align="center">
  <a href="https://github.com/erictooth/react-use-pagination/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License">
  </a>
  <a href="https://www.npmjs.com/package/react-use-pagination">
    <img src="https://img.shields.io/npm/v/react-use-pagination.svg">
  </a>
  <a href="https://prettier.io">
    <img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg" alt="Code Style: Prettier">
  </a>
  <img src="https://img.shields.io/badge/coverage-100%25-brightgreen.svg" alt="100% coverage">
  <a href="https://bundlephobia.com/package/react-use-pagination@latest">
    <img src="https://badgen.net/bundlephobia/minzip/react-use-pagination@latest">
  </a>
</p>

## ✨ Features

-   🛠 State-only hook & callbacks, you provide your own UI controls
-   📦 Compatible with any pagination method like [GraphQL Relay Cursor](https://facebook.github.io/relay/graphql/connections.htm), OData, etc.
-   ⚡️ Works with both server side and client side pagination
-   🐜 Simple and lightweight — less than 2KB gzipped

## Example

```jsx
import { usePagination } from "react-use-pagination";

function App() {
    const [data] = React.useState([]); // <- your data

    const {
        currentPage,
        totalPages,
        setNextPage,
        setPreviousPage,
        nextEnabled,
        previousEnabled,
        startIndex,
        endIndex,
    } = usePagination({ totalItems: data.length });

    return (
        <div>
            <MyDataTable data={data.slice(startIndex, endIndex)} />

            <button onClick={setPreviousPage} disabled={!previousEnabled}>
                Previous Page
            </button>
            <span>
                Current Page: {currentPage} of {totalPages}
            </span>
            <button onClick={setNextPage} disabled={!nextEnabled}>
                Next Page
            </button>
        </div>
    );
}
```

## API

`const paginationState = usePagination(options);`

### `options`

```ts
type Options = {
    totalItems: number;
    initialPage?: number; // (default: 0)
    initialPageSize?: number; // (default: 0)
};
```

### `paginationState`

```ts
type PaginationState = {
    // The current page
    currentPage: number;

    // The first index of the page window
    startIndex: number;

    // The last index of the page window
    endIndex: number;

    // Whether the next button should be enabled
    nextEnabled: number;

    // Whether the previous button should be enabled
    previousEnabled: number;

    // The total page size
    pageSize: number;

    // Jump directly to a page
    setPage: (page: number) => void;

    // Jump to the next page
    setNextPage: () => void;

    // Jump to the previous page
    setPreviousPage: () => void;

    // Set the page size
    setPageSize: (pageSize: number, nextPage?: number = 0) => void;
};
```

### Client Side Pagination

`startIndex` and `endIndex` can be used to implement client-side pagination. The simplest possible usage is to pass these properties directly to `Array.slice`:

```jsx
const [data] = React.useState(["apple", "banana", "cherry"]);
const { startIndex, endIndex } = usePagination({ totalItems: data.length, initialPageSize: 1 });

return (
    <ul>
        {data.slice(startIndex, endIndex).map((item) => (
            <li>{item}</li>
        ))}
    </ul>
);
```

### Server Side Pagination

`startIndex` and `pageSize` can be used to implement a standard limit/offset (also known as top/skip) type of pagination:

```jsx
// Keep track of length separately from data, since data fetcher depends on pagination state
const [length, setLength] = React.useState(0);

// Pagination hook
const { startIndex, pageSize } = usePagination({ totalItems: length, initialPageSize: 1 });

// Fetch Data
const [_, data] = usePromise(
    React.useCallback(
        () => fetchUsers({ offset: startIndex, limit: pageSize }),
        [startIndex, pageSize]
    )
);

// When data changes, update length
React.useEffect(() => {
    setLength(data.length);
}, [data]);

return (
    <ul>
        {data.slice(startIndex, endIndex).map((item) => (
            <li>{item}</li>
        ))}
    </ul>
);
```
