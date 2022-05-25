import { Box, Button, List, ListItem, Progress } from '@chakra-ui/react';
import { Link, useParams } from 'react-router-dom';
import CommentsSection from '../components/CommentsSection';
import Divider from '../components/Divider';
import usePost from '../hooks/usePost';

interface Props {}

const PostPage = ({}: Props) => {
  const params = useParams();
  const postId = params.id as string;

  const { post, error, loading } = usePost(postId);

  const {
    commentCounter,
    comments,
    content,
    createdAt,
    id,
    likeCounter,
    likes,
    tags,
    title,
  } = post;
  return (
    <Box as='article'>
      <Divider height={'50px'} />
      <Link to={'../'}>
        <Box as='button' border={'1px solid yellow'}>
          Go Back
        </Box>
      </Link>
      {loading && <Progress size='xs' isIndeterminate />}
      <h2>{title}</h2>
      <p>{content}</p>
      <Button>{likeCounter}</Button>
      <List spacing={tags ? tags.length : 0}>
        {tags &&
          tags.map((t) => {
            return <ListItem>{t}</ListItem>;
          })}
      </List>
      <footer>Created on {new Date(createdAt).toLocaleDateString()}</footer>
      <Divider height={'50px'} />
      <CommentsSection />
    </Box>
  );
};

export default PostPage;
