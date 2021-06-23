import { useCallback, useMemo, useState, useReducer } from "react";

import {
    getTotalPages,
    getNextEnabled,
    getPreviousEnabled,
    getPaginationState,
} from "./getPaginationState";

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
            (pageSize: number, nextPage = 0) => {
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
