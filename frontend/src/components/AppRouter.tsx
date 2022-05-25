import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';
import Navbar from './Navbar';
import Footer from './Footer';
import Home from './Home';
import { UserProdiver } from '../context/User/UserContext';
import { PostsProvider } from '../context/Posts/PostsContext';
import PostPage from '../pages/PostPage';

const AppRouter = () => {
  return (
    <>
      <PostsProvider>
        <UserProdiver>
          <Router>
            <Flex margin={'0% 7%'} flexDirection={'column'}>
              <Navbar />
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/posts/:id' element={<PostPage />} />
              </Routes>
              <Footer />
            </Flex>
          </Router>
        </UserProdiver>
      </PostsProvider>
    </>
  );
};

export default AppRouter;
