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
  } from '@chakra-ui/react'
  import { useContext, useRef, useState } from "react";
  import loggedInUser from '../../utils/loggedInUser';
  
  export default function CreateChannelModel({isOpen, onClose}) {
    const finalRef = useRef(null);
    const channelNameRef = useRef(null);
    const [channelNameInvalid, setChannelNameInvalid] = useState(false)
    const [channelNameErrorMesage, setChannelNameErrorMessage] = useState("")
    const { setUser } = useContext(loggedInUser);
    const toast = useToast();
  
    function validate(){
      const channelName = channelNameRef.current.value
      let noErros = true;
      if(channelName.trim() == "") {
          noErros = false;
          setChannelNameInvalid(true);
          setChannelNameErrorMessage("Required");
      }
      return noErros;
    }
  
    function handleCreateChannel(){
        const channelName = channelNameRef.current.value
        const token = localStorage.getItem('token');
        if(validate()){
          fetch("http://localhost:3000/api/channel", {
              method: 'POST', 
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                  channelName : channelName,
              })
            })
            .then(response => response.json())
            .then(data => {
              if(data._id){
                fetch(`http://localhost:3000/api/user/${data.userId}`)
                .then(response => response.json())
                .then((data) => {
                  setUser(data);
                  toast({
                    title: "User Created",
                    status: 'success',
                    duration: 1000,
                    isClosable: true,
                    position: 'top'
                  })
                  onClose();
                })
                .catch(error => console.error('Error:', error.message));
              }
              else if(data.tokenExpiredMessage){
                toast({
                  title: data.tokenExpiredMessage,
                  status: 'error',
                  duration: 1000,
                  isClosable: true,
                  position: 'top'
                })
              }
              else if(data.unauthorizedMessage){
                toast({
                  title: data.unauthorizedMessage,
                  status: 'error',
                  duration: 1000,
                  isClosable: true,
                  position: 'top'
                })
              }
              else {
                toast({
                  title: "Error occured",
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
          initialFocusRef={channelNameRef}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create channel</ModalHeader>
            <ModalCloseButton onClick={()=>{
              setChannelNameInvalid(false);
              setChannelNameErrorMessage("");
            }} />
            <ModalBody pb={6}>
                    <FormControl isRequired isInvalid = {channelNameInvalid} onFocus={()=>{
                        setChannelNameInvalid(false);
                        setChannelNameErrorMessage("");
                    }}>
                        <FormLabel>Channel name</FormLabel>
                        <Input ref={channelNameRef} type='text' placeholder='Channel name'/>
                        <FormErrorMessage>{channelNameErrorMesage}</FormErrorMessage>
                    </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleCreateChannel}> 
                Create
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }