import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  useToast,
  useDisclosure,
  Flex,
} from '@chakra-ui/react'
import { useContext, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import loggedInUser from '../../utils/loggedInUser';
import useWindowDimensions from './useWindowDimensions';
import CreateChannelModel from './CreateChannelModel';
import { Link as RouterLink } from 'react-router-dom';
import { LuView } from 'react-icons/lu';
import { GrChannel } from 'react-icons/gr';

export default function LoginModal({isOpen, onClose}) {
  const finalRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [emailInvalid, setEmailInvalid] = useState(false)
  const [emailErroMessage, setEmailErrorMessage] = useState("")
  const [passwordInvalid, setPasswordInvalid] = useState(false)
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("")
  const { user, setUser } = useContext(loggedInUser)
  const { width } = useWindowDimensions();
  const toast = useToast();
  const {isOpen : open, onClose : Close, onOpen : Open} = useDisclosure()

  function validate(){
    const email = emailRef.current.value
    const password = passwordRef.current.value
    let noErros = true;
    if(email.trim() == "") {
        noErros = false;
        setEmailInvalid(true);
        setEmailErrorMessage("Required")
    }
    else if(!email.trim().includes('@')){
        noErros = false;
        setEmailInvalid(true);
        setEmailErrorMessage("Email should contain '@'")
    }
    if(password.trim() == "") {
        noErros = false;
        setPasswordInvalid(true);
        setPasswordErrorMessage("Required")
    }
    return noErros;
  }

  function handleLogin(){
    const email = emailRef.current.value
    const password = passwordRef.current.value
    if(validate()){
        fetch("http://localhost:3000/api/login", {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                emailId : email,
                plainPassword : password,
            })
          })
          .then(response => response.json())
          .then(data => {
            if(data.token) {
              if(localStorage.getItem('token')){
                localStorage.removeItem('token');
              }
              localStorage.setItem('token', data.token);
              const decodedToken = jwtDecode(data.token);
              setUser(decodedToken.user);
              toast({
                title: "Logged In",
                status: 'success',
                duration: 1000,
                isClosable: true,
                position: 'top'
              })
              onClose();
            }
            else if(data.firstRegisterMessage){
              toast({
                title: data.firstRegisterMessage,
                status: 'warning',
                duration: 1000,
                isClosable: true,
                position: 'top'
              })
            }
            else if(data.invalidLoginInputMessage){
              toast({
                title: data.invalidLoginInputMessage,
                status: 'error',
                duration: 1000,
                isClosable: true,
                position: 'top'
              })
            }
            else {
              toast({
                title: "Something went wrong",
                status: 'error',
                duration: 1000,
                isClosable: true,
                position: 'top'
              })
            }
          })
          .catch(error => console.error('Error:', error.message));
    }
  }

  function handleRegister(){
      const email = emailRef.current.value
      const password = passwordRef.current.value
      if(validate()){
          fetch("http://localhost:3000/api/register", {
              method: 'POST', 
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  emailId : email,
                  plainPassword : password,
              })
            })
            .then(response => response.json())
            .then(data => {
              if(data.userExistMessage){
                toast({
                  title: data.userExistMessage,
                  status: 'error',
                  duration: 1000,
                  isClosable: true,
                  position: 'top'
                })
              }
              else if(data._id){
                toast({
                  title: "User Created",
                  status: 'success',
                  duration: 1000,
                  isClosable: true,
                  position: 'top'
                })
                onClose();
              }
              else {
                toast({
                  title: data.message,
                  status: 'error',
                  duration: 1000,
                  isClosable: true,
                  position: 'top'
                })
              }
            })
            .catch(error => console.error('Error:', error.message));
      }
  }

  return (
    <>
      <Modal
        initialFocusRef={emailRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        size='xs'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{(user._id)?'LogOut':'Login / Register'}</ModalHeader>
          <ModalCloseButton onClick={()=>{
            setEmailInvalid(false);
            setEmailErrorMessage("");
            setPasswordInvalid(false);
            setPasswordErrorMessage("");
          }} />
          <ModalBody pb={6}>
            {
              (user._id) ? (
                <Flex direction={'column'}>
                  <Button onClick={()=>{
                    setUser({});
                    localStorage.removeItem('token');
                  }}>LogOut</Button> 
                  {
                    (width < 770) && (
                        (user.creator) 
                        ?<Button mt='0.2rem' as={RouterLink} to={`/channel/${user.channelId}`}><LuView/> View Channel</Button>
                        :<Button mt='0.2rem' onClick={Open}><GrChannel/> Create Channel</Button>
                    )
                }
                </Flex>
              ) :
              (<>
                <FormControl isRequired isInvalid = {emailInvalid} onFocus={()=>{
                    setEmailErrorMessage("");
                    setEmailInvalid(false);
                }}>
                    <FormLabel>Email id</FormLabel>
                    <Input ref={emailRef} type='email' placeholder='Email'/>
                    <FormErrorMessage>{emailErroMessage}</FormErrorMessage>
                </FormControl>
                <FormControl mt={4} isRequired isInvalid = {passwordInvalid} onFocus={()=>{
                    setPasswordErrorMessage("");
                    setPasswordInvalid(false);
                }}>
                    <FormLabel>Password</FormLabel>
                    <Input ref={passwordRef} type='password' placeholder='Password'/>
                    <FormErrorMessage>{passwordErrorMessage}</FormErrorMessage>
                </FormControl>
              </>)
            }
          </ModalBody>
          {(!user._id) && 
            <ModalFooter>
            <Button mr='5px' onClick={handleLogin}> 
                Login
              </Button>
              <Button onClick={handleRegister}> 
                Register
              </Button>
            </ModalFooter>
          }
        </ModalContent>
      </Modal>
      {
        (width < 770) && <CreateChannelModel isOpen={open} onClose={Close} />
      }
    </>
  )
}