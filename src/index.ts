import { useCallback, useMemo, useState, useReducer, ReactNode } from "react";

export const getPreviousEnabled = (currentPage: number): boolean => currentPage > 0;

export const getNextEnabled = (currentPage: number, totalPages: number): boolean =>
    currentPage + 1 < totalPages;

export const getTotalPages = (totalItems: number, pageSize: number): number =>
    Math.ceil(totalItems / pageSize);

export const getStartIndex = (pageSize: number, currentPage: number): number =>
    pageSize * currentPage;

export const getEndIndex = (pageSize: number, currentPage: number, totalItems: number): number => {
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

type CurrentPageReducerActions = { type: "SET"; page: number } | { type: "NEXT" | "PREV" };

export function usePagination({
    totalItems = 0,
    initialPage = 0,
    initialPageSize = 0,
}: {
    totalItems?: number;
    initialPage?: number;
    initialPageSize?: number;
} = {}) {
    const [pageSize, setPageSize] = useState<number>(initialPageSize);

    const [currentPage, dispatch] = useReducer(
        (state = initialPage, action: CurrentPageReducerActions) => {
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

    const paginationState = useMemo(
        () => getPaginationState({ totalItems, pageSize, currentPage }),
        [totalItems, pageSize, currentPage]
    );

    return {
        setPage: useCallback(
            (page: number) => {
                dispatch({
                    type: "SET",
                    page,
                });
            },
            [dispatch]
        ),
        setNextPage: useCallback(() => {
            dispatch({ type: "NEXT" });
        }, [dispatch]),
        setPreviousPage: useCallback(() => {
            dispatch({ type: "PREV" });
        }, [dispatch]),
        setPageSize: useCallback(
            (pageSize: number, nextPage: number = 0) => {
                setPageSize(pageSize);
                dispatch({ type: "SET", page: nextPage });
            },
            [setPageSize]
        ),
        currentPage,
        pageSize,
        totalItems,
        ...paginationState,
    };
}

type PaginationProps = {
    children: (arg0: ReturnType<typeof usePagination>) => ReactNode;
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
