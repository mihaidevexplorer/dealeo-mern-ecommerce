//src\views\components\Search.jsx
import PropTypes from 'prop-types';

const Search = ({ setParPage, setSearchValue, searchValue }) => {
    return (
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-white via-gray-100 to-white rounded-lg shadow-md">
            <select
                onChange={(e) => setParPage(parseInt(e.target.value))}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
            </select>
            <input
                onChange={(e) => setSearchValue(e.target.value)}
                value={searchValue}
                className="ml-4 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                type="text"
                placeholder="Search..."
            />
        </div>
    );
};


Search.propTypes = {
    setParPage: PropTypes.func.isRequired,
    setSearchValue: PropTypes.func.isRequired,
    searchValue: PropTypes.string.isRequired
};

export default Search;
