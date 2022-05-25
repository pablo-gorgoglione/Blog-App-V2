import { Box } from '@chakra-ui/react';

interface Props {}

const Comment = ({}: Props) => {
  return (
    <Box as='article'>
      <h2>Commented by user</h2>
      <p>Content</p>
      <footer>
        posted on <time>timecomment</time>{' '}
      </footer>
    </Box>
  );
};

export default Comment;
