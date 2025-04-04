import { useState } from 'react';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="flex w-full flex-col items-center bg-gray-50 py-5">
            <div className="w-full max-w-sm overflow-hidden rounded-xl bg-white p-5 shadow-sm">
                <div className="flex overflow-hidden rounded-md bg-gray-600 focus:outline focus:outline-gray-500">
                    <input type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for a city..."
                        className="w-full rounded-bl-md rounded-tl-md bg-gray-200 px-4 py-2.5 text-gray-700 focus:outline-gray-500 " />
                    <button type={'submit'} className="bg-gray-200 cursor-pointer px-3.5 text-white duration-150 hover:bg-gray-600">
                        <img src="search.png" alt="" height={16} width={16}/>
                    </button>
                </div>
            </div>

        </form>
    );
};

export default SearchBar;
