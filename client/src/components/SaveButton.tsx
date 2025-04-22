import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';

const SaveButton = ({ book }: { book: any }) => {
  const [saveBook] = useMutation(SAVE_BOOK);

  const handleSave = async () => {
    try {
      await saveBook({ variables: { bookData: book } });
      alert('Book saved!');
    } catch (err) {
      console.error(err);
    }
  };

  return <button onClick={handleSave}>Save Book</button>;
};

export default SaveButton;
