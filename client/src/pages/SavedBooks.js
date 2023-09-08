import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME as GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import { removeBookId, getSavedBookIds } from '../utils/localStorage';
import Auth from '../utils/auth';

function SavedBooks() {
  const { loading, data } = useQuery(GET_ME);
  const userData = data?.me || {};

  const [removeBook, { error }] = useMutation(REMOVE_BOOK);

  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeBook({
        variables: { bookId },
        update(cache) {
          const { me } = cache.readQuery({ query: GET_ME });
          cache.writeQuery({
            query: GET_ME,
            data: { me: { ...me, savedBooks: me.savedBooks.filter(book => book.bookId !== bookId) } },
          });
        }
      });
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <h2>LOADING...</h2>;

  return (
    <div>
      <h1>View Your Saved Books!</h1>
      {userData.savedBooks.map((book) => (
        <div key={book.bookId}>
          <h2>{book.title}</h2>
          <p>Authors: {book.authors.join(', ')}</p>
          <p>Description: {book.description}</p>
          <img src={book.image} alt={book.title} />
          <button onClick={() => handleDeleteBook(book.bookId)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default SavedBooks;
