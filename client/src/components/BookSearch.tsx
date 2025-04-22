import { useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { SEARCH_BOOKS } from '../utils/queries';
import { SAVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';

const BookSearch = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchBooks, { loading, data, error }] = useLazyQuery(SEARCH_BOOKS);
  const [saveBook] = useMutation(SAVE_BOOK);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput) return;
    try {
      await searchBooks({ variables: { query: searchInput } });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveBook = async (book: any) => {
    const token = Auth.getToken();
    if (!token) return;

    try {
      await saveBook({
        variables: { bookData: { ...book } },
      });
      alert('Book saved!');
    } catch (err) {
      console.error(err);
    }
  };

  const books = data?.searchBooks || [];

  return (
    <div>
      <h2>Search for Books</h2>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search books..."
          value={searchInput}
          onChange={handleInputChange}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}

      <div className="book-results">
        {books.length > 0 ? (
          books.map((book: any) => (
            <div key={book.bookId} className="book-card">
              <h3>{book.title}</h3>
              <p>Authors: {book.authors.join(', ')}</p>
              <img src={book.image} alt={book.title} />
              <p>{book.description}</p>
              {Auth.loggedIn() && (
                <button onClick={() => handleSaveBook(book)}>Save</button>
              )}
            </div>
          ))
        ) : (
          <p>No books yet. Try searching above!</p>
        )}
      </div>
    </div>
  );
};

export default BookSearch;
