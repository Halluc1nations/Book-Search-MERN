import { useMutation } from '@apollo/client';
import { REMOVE_BOOK } from '../utils/mutations';

const RemoveButton = ({ bookId }: { bookId: string }) => {
  const [removeBook] = useMutation(REMOVE_BOOK, {
    refetchQueries: ['me'], // refresh savedBooks list after deletion
  });

  const handleRemove = async () => {
    try {
      await removeBook({ variables: { bookId } });
      alert('Book removed!');
    } catch (err) {
      console.error(err);
    }
  };

  return <button onClick={handleRemove}>Remove Book</button>;
};

export default RemoveButton;
