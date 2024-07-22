import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import { range } from 'lodash'; // Helper function for generating ranges

const SidePanel = ({
  isOpen,
  onClose,
  columns,
  onColumnVisibilityChange,
  onFilterChange,
  filters,
  data,
}) => {
  const [createdAtRange, setCreatedAtRange] = useState(filters.createdAt || [null, null]);
  const [priceRange, setPriceRange] = useState(filters.price || [0, 100]);
  const [selectedCategories, setSelectedCategories] = useState(
    filters.category.map(value => ({ value, label: value }))
  );
  const [selectedSubcategories, setSelectedSubcategories] = useState(
    filters.subcategory.map(value => ({ value, label: value }))
  );

  const handleRangeChange = (setter, values) => {
    setter(values);
    onFilterChange('price', values);
  };

  const handleDateRangeChange = (setter, values) => {
    setter(values);
    onFilterChange('createdAt', values);
  };

  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions);
    onFilterChange('category', selectedOptions.map(option => option.value));
  };

  const handleSubcategoryChange = (selectedOptions) => {
    setSelectedSubcategories(selectedOptions);
    onFilterChange('subcategory', selectedOptions.map(option => option.value));
  };

  const getOptions = (field) => {
    const uniqueValues = Array.from(new Set(data.map(item => item[field])));
    return uniqueValues.map(value => ({ value, label: value }));
  };

  useEffect(() => {
    setCreatedAtRange(filters.createdAt || [null, null]);
    setPriceRange(filters.price || [0, 100]);
    setSelectedCategories(filters.category.map(value => ({ value, label: value })));
    setSelectedSubcategories(filters.subcategory.map(value => ({ value, label: value })));
  }, [filters]);

  return (
    <div
      className={`fixed inset-y-0 right-0 bg-white w-64 p-4 shadow-lg z-50 transform ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } transition-transform duration-300 ease-in-out`}
      style={{ height: '100vh', overflowY: 'auto' }} 
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Filters</h2>
        <button onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      <div className="mb-4">
        <h3 className="font-bold mb-2">View/Hide Columns</h3>
        {columns.map(column => (
          <div key={column.accessor} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={column.isVisible !== false}
              onChange={() => onColumnVisibilityChange(column.accessor)}
              className="mr-2"
            />
            <span>{column.Header}</span>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="font-bold mb-2">Categories</h3>
        <Select
          isMulti
          value={selectedCategories}
          onChange={handleCategoryChange}
          options={getOptions('category')}
          className="mb-2"
          placeholder="Select categories..."
        />
      </div>

      <div className="mb-4">
        <h3 className="font-bold mb-2">Subcategories</h3>
        <Select
          isMulti
          value={selectedSubcategories}
          onChange={handleSubcategoryChange}
          options={getOptions('subcategory')}
          className="mb-2"
          placeholder="Select subcategories..."
        />
      </div>

      <div className="mb-4">
        <h3 className="font-bold mb-2">Price Range</h3>
        <input
          type="range"
          min={0}
          max={100}
          value={priceRange[0]}
          onChange={e => handleRangeChange(setPriceRange, [Number(e.target.value), priceRange[1]])}
          className="w-full mb-2"
        />
        <input
          type="range"
          min={0}
          max={100}
          value={priceRange[1]}
          onChange={e => handleRangeChange(setPriceRange, [priceRange[0], Number(e.target.value)])}
          className="w-full mb-2"
        />
        <div className="flex justify-between">
          <span>{`$${priceRange[0]}`}</span>
          <span>{`$${priceRange[1]}`}</span>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-bold mb-2">Date Range</h3>
        <DatePicker
          selected={createdAtRange[0]}
          onChange={date => handleDateRangeChange(setCreatedAtRange, [date, createdAtRange[1]])}
          selectsStart
          startDate={createdAtRange[0]}
          endDate={createdAtRange[1]}
          className="w-full mb-2"
          placeholderText="Start date"
        />
        <DatePicker
          selected={createdAtRange[1]}
          onChange={date => handleDateRangeChange(setCreatedAtRange, [createdAtRange[0], date])}
          selectsEnd
          startDate={createdAtRange[0]}
          endDate={createdAtRange[1]}
          className="w-full mb-2"
          placeholderText="End date"
        />
      </div>

      <div className="flex justify-between mb-4">
        <button
          onClick={() => {
            setCreatedAtRange([null, null]);
            setPriceRange([0, 100]);
            setSelectedCategories([]);
            setSelectedSubcategories([]);
            onFilterChange('price', [0, 100]);
            onFilterChange('createdAt', [null, null]);
            onFilterChange('category', []);
            onFilterChange('subcategory', []);
            onFilterChange('name', '');
          }}
          className="p-2 bg-red-500 text-white rounded"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default SidePanel;
