import { renderHook, act } from "@testing-library/react-hooks";
import { usePagination } from "../usePagination";

const DEFAULT_STATE = {
    totalItems: 100,
    initialPageSize: 10,
    initialPage: 1,
};

describe("usePagination", () => {
    it("correctly initializes the page state and contains the expected metadata", () => {
        const { result } = renderHook(() => usePagination(DEFAULT_STATE));

        expect(result.current.currentPage).toBe(DEFAULT_STATE.initialPage);
        expect(result.current.totalItems).toBe(DEFAULT_STATE.totalItems);
        expect(result.current.pageSize).toBe(DEFAULT_STATE.initialPageSize);
        expect(result.current.startIndex).toBe(
            DEFAULT_STATE.initialPage * DEFAULT_STATE.initialPageSize
        );
        expect(result.current.endIndex).toBe(
            (DEFAULT_STATE.initialPage + 1) * DEFAULT_STATE.initialPageSize - 1
        );
        expect(result.current.nextEnabled).toBe(true);
        expect(result.current.previousEnabled).toBe(true);
    });

    it("sets the next page when setNextPage is called", () => {
        const { result } = renderHook(usePagination, { initialProps: DEFAULT_STATE });

        expect(result.current.currentPage).toBe(DEFAULT_STATE.initialPage);

        act(() => {
            result.current.setNextPage();
        });

        expect(result.current.currentPage).toBe(DEFAULT_STATE.initialPage + 1);
    });

    it("sets the previous page when setPreviousPage is called", () => {
        const { result } = renderHook(usePagination, { initialProps: DEFAULT_STATE });

        expect(result.current.currentPage).toBe(DEFAULT_STATE.initialPage);

        act(() => {
            result.current.setPreviousPage();
        });

        expect(result.current.currentPage).toBe(DEFAULT_STATE.initialPage - 1);
    });

    it("sets the page when setPage is called", () => {
        const { result } = renderHook(usePagination, { initialProps: DEFAULT_STATE });

        expect(result.current.currentPage).toBe(DEFAULT_STATE.initialPage);

        act(() => {
            result.current.setPage(0);
        });

        expect(result.current.currentPage).toBe(0);
    });

    it("sets the pageSize when setPageSize is called", () => {
        const { result } = renderHook(usePagination, { initialProps: DEFAULT_STATE });

        expect(result.current.pageSize).toBe(DEFAULT_STATE.initialPageSize);

        act(() => {
            result.current.setPageSize(5);
        });

        expect(result.current.pageSize).toBe(5);
    });

    // This is required so that the hook can be rendered before server-provided data is available
    it("initializes configurations to 0 when not provided", () => {
        const { result } = renderHook(usePagination, { initialProps: undefined });

        expect(result.current.totalItems).toBe(0);
        expect(result.current.pageSize).toBe(0);
        expect(result.current.currentPage).toBe(0);
    });

    it("updates the totalItems in the reducer when re-rendered", async () => {
        const { result, rerender } = renderHook(usePagination, { initialProps: undefined });
        expect(result.current.totalItems).toBe(0);

        act(() => {
            rerender({ totalItems: 123 });
        });

        expect(result.current.totalItems).toBe(123);
    });
});
