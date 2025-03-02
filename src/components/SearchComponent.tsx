import { useCallback, useState, useEffect } from 'react';
import debounce from 'lodash.debounce';

const SearchComponent = ({ onSearch, value, onClear }: { onSearch: (query: string) => void, value: string, onClear: () => void }) => {
    const [query, setQuery] = useState(value);

    const debouncedSearch = useCallback(
        debounce((searchTerm: string) => {
            onSearch(searchTerm);
        }, 500),
        []
    );

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setQuery(value);
        debouncedSearch(value);
    };

    useEffect(() => {
        setQuery(value);
    }, [value]);

    const handleClearClick = () => {
        setQuery('');
        onClear();
    };

    return (
        <div className="mb-4 relative">
            <input
                type="text"
                value={query}
                onChange={handleChange}
                className="border p-2 rounded-lg w-full pr-10"
                placeholder="Search recipes..."
            />
            {query && (
                <button
                    onClick={handleClearClick}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default SearchComponent;
