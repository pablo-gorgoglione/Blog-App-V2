import { Box } from '@chakra-ui/react';
import Comment from './Comment';

interface Props {}

const CommentsSection = ({}: Props) => {
  return (
    <Box as='section'>
      <Box>Add comment</Box>
      <Box>Comments</Box>
      <Comment></Comment>
    </Box>
  );
};

export default CommentsSection;
