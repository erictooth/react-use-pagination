import { paginationStateReducer } from "../paginationStateReducer";
import { PaginationState } from "../getPaginationMeta";

const MULTI_PAGE_FIRST_PAGE: PaginationState = {
    totalItems: 100,
    pageSize: 10,
    currentPage: 0,
};

describe("paginationStateReducer", () => {
    it("sets the next page when not on the last page", () => {
        const nextState = paginationStateReducer(MULTI_PAGE_FIRST_PAGE, { type: "NEXT_PAGE" });
        expect(nextState.currentPage).toBe(1);
    });

    it("does not set the next page when on the last page", () => {
        const nextState = paginationStateReducer(
            { totalItems: 1, pageSize: 1, currentPage: 0 },
            { type: "NEXT_PAGE" }
        );
        expect(nextState.currentPage).toBe(0);
    });

    it("sets the previous page when not on the first page", () => {
        const nextState = paginationStateReducer(
            { totalItems: 2, pageSize: 1, currentPage: 1 },
            { type: "PREVIOUS_PAGE" }
        );
        expect(nextState.currentPage).toBe(0);
    });

    it("does not set the previous page when on the first page", () => {
        const nextState = paginationStateReducer(MULTI_PAGE_FIRST_PAGE, { type: "PREVIOUS_PAGE" });
        expect(nextState.currentPage).toBe(0);
    });

    it("allows totalPages to be set", () => {
        const nextTotalItems = 12;
        const nextState = paginationStateReducer(MULTI_PAGE_FIRST_PAGE, {
            type: "SET_TOTALITEMS",
            totalItems: nextTotalItems,
        });

        expect(nextState.totalItems).toBe(nextTotalItems);
    });

    it("allows pageSize to be set", () => {
        const nextPageSize = 12;
        const nextState = paginationStateReducer(MULTI_PAGE_FIRST_PAGE, {
            type: "SET_PAGESIZE",
            pageSize: nextPageSize,
        });

        expect(nextState.pageSize).toBe(nextPageSize);
    });

    it("allows currentPage to be set", () => {
        const nextCurrentPage = 12;
        const nextState = paginationStateReducer(
            { totalItems: 100, pageSize: 1, currentPage: 0 },
            {
                type: "SET_PAGE",
                page: nextCurrentPage,
            }
        );

        expect(nextState.currentPage).toBe(nextCurrentPage);
    });

    it("disallows currentPage from being set below 0", () => {
        const nextCurrentPage = -1;
        const nextState = paginationStateReducer(MULTI_PAGE_FIRST_PAGE, {
            type: "SET_PAGE",
            page: nextCurrentPage,
        });

        expect(nextState.currentPage).toBe(0);
    });

    it("disallows currentPage from being set above totalPages", () => {
        const nextCurrentPage = 1;
        const nextState = paginationStateReducer(
            { totalItems: 1, pageSize: 1, currentPage: 0 },
            {
                type: "SET_PAGE",
                page: nextCurrentPage,
            }
        );

        expect(nextState.currentPage).toBe(0);
    });

    it("limits currentPage within totalPages when pageSize is increased", () => {
        const nextState = paginationStateReducer(
            { totalItems: 100, pageSize: 10, currentPage: 9 },
            {
                type: "SET_PAGESIZE",
                pageSize: 50,
            }
        );

        expect(nextState.currentPage).toBe(1);
    });

    it("doesn't change currentPage if it wouldn't be out of bounds when pageSize is increased", () => {
        const nextState = paginationStateReducer(
            { totalItems: 100, pageSize: 10, currentPage: 2 },
            {
                type: "SET_PAGESIZE",
                pageSize: 25,
            }
        );

        expect(nextState.currentPage).toBe(2);
    });

    it("limits currentPage within totalPages when totalItems is decreased", () => {
        const nextState = paginationStateReducer(
            { totalItems: 100, pageSize: 10, currentPage: 9 },
            {
                type: "SET_TOTALITEMS",
                totalItems: 20,
            }
        );

        expect(nextState.currentPage).toBe(1);
    });

    it("doesn't change currentPage if it wouldn't be out of bounds when totalItems is decreased", () => {
        const nextState = paginationStateReducer(
            { totalItems: 100, pageSize: 10, currentPage: 9 },
            {
                type: "SET_TOTALITEMS",
                totalItems: 95,
            }
        );

        expect(nextState.currentPage).toBe(9);
    });
});
