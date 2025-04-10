import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearchClick = () => {
    if (query.trim() !== '') {
      onSearch(query); // ✅ 关键点：点击按钮时触发这个函数
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Enter product name..."
      />
      <button type="button" onClick={handleSearchClick}>Search</button>

    </div>
  );
};

export default SearchBar;
