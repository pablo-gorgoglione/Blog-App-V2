import { Box, Flex } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { PostCard } from '../types';

interface Props {
  post: PostCard;
}

const Card = ({ post }: Props) => {
  return (
    <Link to={`../posts/${post.id}`}>
      <Box height={'200px'} border='1px' borderColor='yellow' as='article'>
        <h2>{post.title}</h2>
        <hr />
        {post.content}
        <br />
        <br />
        <Flex justifyContent={'space-around'}>
          <Box>comments:{post.commentCounter}</Box>
          <Box>likes:{post.likeCounter}</Box>
        </Flex>
      </Box>
    </Link>
  );
};

export default Card;
