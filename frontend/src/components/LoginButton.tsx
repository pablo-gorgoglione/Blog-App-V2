import {
  Box,
  Text,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Input,
  useDisclosure,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/react';
import { useContext, useRef, useState } from 'react';
import UserContext from '../context/User/UserContext';

const LoginButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user, setUser] = useState<{ username: string; password: string }>({
    username: '',
    password: '',
  });
  const [isLog, setIsLog] = useState<boolean>(false);
  const { password, username } = user;
  const btnRef = useRef<any>();
  const { login, userState } = useContext(UserContext);

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    const res = await login(username, password);
    setIsLog(res);
    if (res) {
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <>
      <Button ref={btnRef} colorScheme='teal' onClick={onOpen}>
        Me quiero logear
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Log in</DrawerHeader>

          <Flex flexDirection={'column'}>
            <DrawerBody>
              <Input
                name='username'
                onChange={(e) => handleUserChange(e)}
                value={username}
                placeholder='Username...'
              />
              <Divider height={'15px'} borderBottom={'none'} />
              <Input
                name='password'
                onChange={(e) => handleUserChange(e)}
                value={password}
                type={'password'}
                placeholder='Password...'
              />
              <Divider height={'20px'} borderBottom={'none'} />
              {isLog && (
                <Alert status='success'>
                  <AlertIcon />
                  Logged succesfully!
                </Alert>
              )}
              {userState.error && (
                <Alert rounded={'xl'} justifyContent={'center'} status='error'>
                  <AlertIcon />
                  <AlertTitle wordBreak={'keep-all'} fontSize={'small'}>
                    Error trying to login!
                  </AlertTitle>
                </Alert>
              )}
            </DrawerBody>

            {/* <Flex justifyContent={'space-evenly'}>
              <Text> Don't have an accoutn?</Text>
              <Text cursor={'pointer'}> Create one</Text>
            </Flex> */}

            <DrawerFooter>
              <Button variant='outline' mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleLogin}
                colorScheme='blue'
                isLoading={userState.loading}
              >
                Login
              </Button>
            </DrawerFooter>
          </Flex>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default LoginButton;
