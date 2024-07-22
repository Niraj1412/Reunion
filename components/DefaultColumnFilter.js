"use client";

import React, { useState, useMemo } from 'react';
import Fuse from 'fuse.js';

const DefaultColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter, id },
  globalFilter,
  setGlobalFilter
}) => {
  const count = preFilteredRows.length;
  
  const handleChange = e => {
    setGlobalFilter(e.target.value || undefined);
  };

  return (
    <input
      value={globalFilter || ''}
      onChange={handleChange}
      placeholder={`Search ${count} records...`}
      className="p-2 border rounded w-full"
    />
  );
};

export default DefaultColumnFilter;
