import * as React from "react";

const getPreviousEnabled = currentPage => currentPage > 0;

const getNextEnabled = (currentPage, totalPages) => currentPage + 1 < totalPages;

const getTotalPages = (totalItems, pageSize) => Math.ceil(totalItems / pageSize);

const getStartIndex = (pageSize, currentPage) => pageSize * currentPage;

const getEndIndex = (pageSize, currentPage, totalItems) => {
    const lastPageEndIndex = pageSize * (currentPage + 1);

    if (lastPageEndIndex > totalItems) {
        return totalItems - 1;
    }

    return lastPageEndIndex - 1;
};

export const getPaginationState = ({ totalItems, pageSize, currentPage }) => {
    const totalPages = getTotalPages(totalItems, pageSize);
    return {
        totalPages,
        startIndex: getStartIndex(pageSize, currentPage),
        endIndex: getEndIndex(pageSize, currentPage, totalItems),
        previousEnabled: getPreviousEnabled(currentPage),
        nextEnabled: getNextEnabled(currentPage, totalPages),
    };
};

export function usePagination({ totalItems = 0, initialPage = 0, initialPageSize = 0 }) {
    const [pageSize, setPageSize] = React.useState(initialPageSize);

    const [currentPage, dispatch] = React.useReducer((state, action) => {
        switch (action.type) {
            case "SET":
                return action.page;
            case "NEXT":
                if (!getNextEnabled(state, getTotalPages(totalItems, pageSize))) {
                    return state;
                }
                return state + 1;
            case "PREV":
                if (!getPreviousEnabled(state)) {
                    return state;
                }
                return state - 1;
            default:
                return state;
        }
    }, initialPage);

    const paginationState = React.useMemo(
        () => getPaginationState({ totalItems, pageSize, currentPage }),
        [totalItems, pageSize, currentPage]
    );

    return {
        setPage: React.useCallback(
            page => {
                dispatch({
                    type: "SET",
                    page,
                });
            },
            [dispatch]
        ),
        setNextPage: React.useCallback(() => {
            dispatch({ type: "NEXT" });
        }, [dispatch]),
        setPreviousPage: React.useCallback(() => {
            dispatch({ type: "PREV" });
        }, [dispatch]),
        setPageSize: React.useCallback(
            (pageSize, nextPage = 0) => {
                setPageSize(pageSize);
                dispatch({ type: "SET", page: nextPage });
            },
            [setPageSize]
        ),
        currentPage,
        pageSize,
        ...paginationState,
    };
}

function Pagination({ children, totalItems = 0, initialPage = 0, initialPageSize }) {
    return children(usePagination({ totalItems, initialPage, initialPageSize }));
}

Pagination.displayName = "Pagination";

export default Pagination;
