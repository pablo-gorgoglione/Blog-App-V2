import {
  Box,
  Text,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Spacer,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import { useContext } from 'react';
import UserContext from '../context/User/UserContext';
import { Link } from 'react-router-dom';
import LoginButton from './LoginButton';

const Navbar = () => {
  const { userState, login } = useContext(UserContext);

  return (
    <Flex
      height={'10vh'}
      as={'nav'}
      border='1px'
      borderColor='red'
      minWidth='max-content'
      alignItems='center'
      gap='2'
    >
      <Box p='2'>
        <Link to='/'>
          <Heading size='md'>Blog App</Heading>
        </Link>
      </Box>
      <Spacer />
      <ButtonGroup gap='2'>
        {!userState.loading && !userState.loading && (
          <Text>{userState.user.username}</Text>
        )}
        <Button colorScheme='teal'>Sign Up</Button>
        <Button
          colorScheme='teal'
          onClick={() => {
            login('Pablo', '12345');
          }}
        >
          Log in
        </Button>
        <LoginButton />
        <ColorModeSwitcher justifySelf='flex-end' />
      </ButtonGroup>
    </Flex>
  );
};

export default Navbar;
