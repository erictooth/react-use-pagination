import * as React from "react";

export const getPreviousEnabled = (currentPage: number) => currentPage > 0;

export const getNextEnabled = (currentPage: number, totalPages: number) =>
    currentPage + 1 < totalPages;

export const getTotalPages = (totalItems: number, pageSize: number) =>
    Math.ceil(totalItems / pageSize);

export const getStartIndex = (pageSize: number, currentPage: number) => pageSize * currentPage;

export const getEndIndex = (pageSize: number, currentPage: number, totalItems: number) => {
    const lastPageEndIndex = pageSize * (currentPage + 1);

    if (lastPageEndIndex > totalItems) {
        return totalItems - 1;
    }

    return lastPageEndIndex - 1;
};

export const getPaginationState = ({
    totalItems,
    pageSize,
    currentPage,
}: {
    totalItems: number;
    pageSize: number;
    currentPage: number;
}) => {
    const totalPages = getTotalPages(totalItems, pageSize);
    return {
        totalPages,
        startIndex: getStartIndex(pageSize, currentPage),
        endIndex: getEndIndex(pageSize, currentPage, totalItems),
        previousEnabled: getPreviousEnabled(currentPage),
        nextEnabled: getNextEnabled(currentPage, totalPages),
    };
};

type CurrentPageReducerActions = React.Reducer<
    number,
    Partial<{ type: "SET"; page: number } | { type: "NEXT" | "PREV" }>
>;

export function usePagination({
    totalItems = 0,
    initialPage = 0,
    initialPageSize = 0,
}: {
    totalItems?: number;
    initialPage?: number;
    initialPageSize?: number;
} = {}) {
    const [pageSize, setPageSize] = React.useState<number>(initialPageSize);

    const [currentPage, dispatch] = React.useReducer<CurrentPageReducerActions>(
        (state = initialPage, action = {}) => {
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
        },
        initialPage
    );

    const paginationState = React.useMemo(
        () => getPaginationState({ totalItems, pageSize, currentPage }),
        [totalItems, pageSize, currentPage]
    );

    return {
        setPage: React.useCallback((page: number) => {
            dispatch({
                type: "SET",
                page,
            });
        }, []),
        setNextPage: React.useCallback(() => {
            dispatch({ type: "NEXT" });
        }, []),
        setPreviousPage: React.useCallback(() => {
            dispatch({ type: "PREV" });
        }, []),
        setPageSize: React.useCallback((pageSize: number, nextPage: number = 0) => {
            setPageSize(pageSize);
            dispatch({ type: "SET", page: nextPage });
        }, []),
        currentPage,
        pageSize,
        totalItems,
        ...paginationState,
    };
}

export type PaginationProps = {
    children: (args: ReturnType<typeof usePagination>) => React.ReactNode;
    totalItems?: number;
    initialPage?: number;
    initialPageSize: number;
};

function Pagination({
    children,
    totalItems = 0,
    initialPage = 0,
    initialPageSize,
}: PaginationProps) {
    return children(usePagination({ totalItems, initialPage, initialPageSize }));
}

Pagination.displayName = "Pagination";

export default Pagination;
