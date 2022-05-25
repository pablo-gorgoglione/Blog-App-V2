import { Box } from '@chakra-ui/react';
import { useContext } from 'react';
import PostsContext from '../context/Posts/PostsContext';
import Card from './Card';
import Divider from './Divider';

const Home = () => {
  const { postsState } = useContext(PostsContext);

  const renderPostCardList = () =>
    postsState.posts.map((post) => {
      return <Card key={post.id} post={post} />;
    });

  return (
    <Box
      as='main'
      border='1px'
      height={'80vh'}
      overflow={'scroll'}
      borderColor='red'
      margin={'0% 5%'}
    >
      <Divider height='50px' />
      {postsState.loading && <h2>Loading...</h2>}
      {postsState.posts.length > 0 && renderPostCardList()}
      <Divider height='50px' />
    </Box>
  );
};

export default Home;
