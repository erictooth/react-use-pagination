//@flow
import * as React from "react";

const getPreviousEnabled = (currentPage: number) => currentPage > 0;

const getNextEnabled = (currentPage: number, totalPages: number) => currentPage + 1 < totalPages;

const getTotalPages = (totalItems: number, pageSize: number) => Math.ceil(totalItems / pageSize);

const getStartIndex = (pageSize: number, currentPage: number) => pageSize * currentPage;

const getEndIndex = (pageSize: number, currentPage: number, totalItems: number) => {
    const lastPageEndIndex = pageSize * (currentPage + 1);

    if (lastPageEndIndex > totalItems) {
        return totalItems - 1;
    }

    return lastPageEndIndex - 1;
};

const getPaginationState = ({
    totalItems,
    pageSize,
    currentPage,
}: {
    totalItems: number,
    pageSize: number,
    currentPage: number,
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

type CurrentPageReducerActions = {| type: "SET", page: number |} | {| type: "NEXT" | "PREV" |};

function usePagination({
    totalItems = 0,
    initialPage = 0,
    initialPageSize = 0,
}: {
    totalItems?: number,
    initialPage?: number,
    initialPageSize?: number,
} = {}) {
    const [pageSize, setPageSize] = React.useState<number>(initialPageSize);

    const [currentPage, dispatch] = React.useReducer<number, CurrentPageReducerActions>(
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
        setPage: React.useCallback(
            (page: number) => {
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
            (pageSize: number, nextPage?: number = 0) => {
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

type PaginationProps = {|
    children: ($Call<typeof usePagination>) => React.Node,
    totalItems?: number,
    initialPage?: number,
    initialPageSize: number,
|};

function Pagination({
    children,
    totalItems = 0,
    initialPage = 0,
    initialPageSize,
}: PaginationProps) {
    return children(usePagination({ totalItems, initialPage, initialPageSize }));
}

Pagination.displayName = "Pagination";

export { getPaginationState, usePagination };
export default Pagination;
