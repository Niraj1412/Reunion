"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useTable, useSortBy, useFilters, usePagination } from "react-table";
import Fuse from "fuse.js";
import columnsData from "./columns"; // Import columns data
import SidePanel from "./SidePanel"; // Import your SidePanel

const DataTable = ({ data }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState({
    name: "",
    category: [],
    subcategory: [],
    price: [0, 100],
    createdAt: [null, null],
  });
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState(
    columnsData.map((col) => ({ id: col.accessor, isVisible: true }))
  );

  // Apply global search filter
  const filteredData = useMemo(() => {
    let result = data;

    if (globalFilter) {
      const fuse = new Fuse(data, {
        keys: ["name"],
        includeScore: true,
      });
      result = fuse.search(globalFilter).map((result) => result.item);
    }

    if (filters.name) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.category.length > 0) {
      result = result.filter((item) =>
        filters.category.includes(item.category)
      );
    }

    if (filters.subcategory.length > 0) {
      result = result.filter((item) =>
        filters.subcategory.includes(item.subcategory)
      );
    }

    if (filters.price) {
      result = result.filter(
        (item) =>
          item.price >= filters.price[0] && item.price <= filters.price[1]
      );
    }

    if (filters.createdAt[0] && filters.createdAt[1]) {
      result = result.filter(
        (item) =>
          new Date(item.createdAt) >= new Date(filters.createdAt[0]) &&
          new Date(item.createdAt) <= new Date(filters.createdAt[1])
      );
    }

    return result;
  }, [data, globalFilter, filters]);

  const handleFilterChange = useCallback((filterType, values) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: values,
    }));
  }, []);

  const handleTogglePanel = () => {
    setIsPanelOpen((prev) => !prev);
  };

  const handleColumnVisibilityChange = useCallback((columnId) => {
    setColumnVisibility((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, isVisible: !col.isVisible } : col
      )
    );
  }, []);

  // Update columns based on column visibility state
  const columns = useMemo(() => {
    return columnsData.filter(
      (column) =>
        columnVisibility.find((c) => c.id === column.accessor)?.isVisible !==
        false
    );
  }, [columnVisibility]);

  const tableInstance = useTable(
    {
      columns,
      data: filteredData,
      initialState: { pageIndex: 0, pageSize: 10 },
      manualFilters: true,
    },
    useFilters,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance;

  const renderPagination = () => {
    const visiblePages = 5;
    const totalPages = pageOptions.length;
    const pages = [];

    if (totalPages <= visiblePages) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(pageIndex - Math.floor(visiblePages / 2), 0);
      let endPage = startPage + visiblePages - 1;

      if (endPage >= totalPages) {
        endPage = totalPages - 1;
        startPage = endPage - visiblePages + 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (startPage > 0) {
        pages.unshift("...");
        pages.unshift(0);
      }

      if (endPage < totalPages - 1) {
        pages.push("...");
        pages.push(totalPages - 1);
      }
    }

    return (
      <div className="flex justify-center mt-2 space-x-1">
        {pages.map((pageNumber, index) => (
          <button
            key={index}
            onClick={() => gotoPage(pageNumber)}
            className={`p-2 rounded ${
              pageNumber === pageIndex
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            disabled={pageNumber === "..."}
          >
            {pageNumber === "..." ? "..." : pageNumber + 1}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleTogglePanel}
            className="p-2 bg-gray-200 rounded"
          >
            Filters
          </button>
        </div>
        <input
          type="text"
          placeholder="Search"
          className="p-2 border rounded w-1/3 text-sm"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>
      <table
        {...getTableProps()}
        className="min-w-full bg-white border border-gray-200 text-sm"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className="border-b"
              key={headerGroup.id}
            >
              {headerGroup.headers.map(
                (column) =>
                  column.isVisible !== false && (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="p-2 text-left font-medium text-gray-600"
                      key={column.id}
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <span className="inline ml-2">↓</span>
                          ) : (
                            <span className="inline ml-2">↑</span>
                          )
                        ) : (
                          <span className="inline ml-2">↕</span>
                        )}
                      </span>
                    </th>
                  )
              )}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className="hover:bg-gray-100"
                key={row.id}
              >
                {row.cells.map(
                  (cell) =>
                    cell.column.isVisible !== false && (
                      <td
                        {...cell.getCellProps()}
                        className="p-2 border-t border-gray-200"
                        key={cell.column.id}
                      >
                        {cell.column.id === "createdAt" ||
                        cell.column.id === "updatedAt"
                          ? new Date(cell.value).toLocaleDateString()
                          : cell.render("Cell")}
                      </td>
                    )
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          className="p-2 bg-gray-200 rounded"
        >
          Previous
        </button>
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className="p-2 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
      {renderPagination()}
      {isPanelOpen && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-50 z-40"
            onClick={handleTogglePanel}
          ></div>
          <div className="relative z-50">
            <SidePanel
              isOpen={isPanelOpen}
              onClose={handleTogglePanel}
              columns={columnsData} // Pass full columns data
              onColumnVisibilityChange={handleColumnVisibilityChange}
              onGroupingChange={() => {}}
              onSortingChange={() => {}}
              onFilterChange={handleFilterChange}
              filters={filters}
              data={data}
              sortBy={[]}
              groupBy={[]}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DataTable;
