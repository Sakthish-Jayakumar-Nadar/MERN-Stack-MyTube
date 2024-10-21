import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Button, FormErrorMessage,  useToast, } from '@chakra-ui/react'
import { useEffect, useRef, useState } from "react";
  
  export default function EditVideoModal({isOpen, onClose, video, setChannelVideos, setEditVideo}) {
    const finalRef = useRef(null);
    const videoTitleRef = useRef(null);
    const [videoTitle, setVideoTitle] = useState("")
    const [videoDescription, setVideoDescription] = useState("")
    const toast = useToast();

    useEffect(()=>{
        if(video.title) setVideoTitle(video.title);
        if(video.description) setVideoDescription(video.description);
    },[video])
  
    function handleEditVideo(){
        const token = localStorage.getItem('token');
        if(token && video.channelId && video._id){
            fetch(`http://localhost:3000/api/channel/${video.channelId}/editVideo/${video._id}`, {
                method: 'POST', 
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                },
                body : JSON.stringify({
                    title : videoTitle,
                    description : videoDescription,
                })
            }).then((response) => response.json())
            .then(data => {
                if((data.length > 0 && data[0]._id) || (data.length == 0)){
                    setChannelVideos(data);
                    toast({
                    title: "Video deleted",
                    status: 'success',
                    duration: 1000,
                    isClosable: true,
                    position: 'top'
                    })
                    setEditVideo({})
                    onClose();
                }
                else if(data.tokenExpiredMessage){
                    toast({
                        title: data.tokenExpiredMessage,
                        description: "Re-Login",
                        status: 'error',
                        duration: 1000,
                        isClosable: true,
                        position: 'top'
                    })
                    setEditVideo({})
                    onClose();
                }
                else if(data.unauthorizedMessage){
                    toast({
                        title: data.unauthorizedMessage,
                        status: 'error',
                        duration: 1000,
                        isClosable: true,
                        position: 'top'
                    })
                    setEditVideo({})
                    onClose();
                }
                else {
                    toast({
                        title: "Error occured",
                        status: 'error',
                        duration: 1000,
                        isClosable: true,
                        position: 'top'
                    })
                    setEditVideo({})
                    onClose();
                }
            })
            .catch(error => console.error('Error:', error.message));
        }
        else{
            toast({
                title: "Login first",
                status: 'error',
                duration: 1000,
                isClosable: true,
                position: 'top'
            })
            setEditVideo({})
            onClose();
        }
    }
  
    return (
      <>
        <Modal
          initialFocusRef={videoTitleRef}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit video</ModalHeader>
            <ModalCloseButton/>
            <ModalBody pb={6}>
                <FormControl isRequired isInvalid = {videoTitle.trim().length <= 0}>
                    <FormLabel>Title</FormLabel>
                    <Input ref={videoTitleRef} type='text' placeholder='Title' value={videoTitle} onChange={(e)=>{setVideoTitle(e.target.value)}}/>
                    <FormErrorMessage>Required</FormErrorMessage>
                </FormControl>
                <FormControl mt={4} isRequired isInvalid = {videoDescription.trim().length <= 0}>
                    <FormLabel>Description</FormLabel>
                    <Input type='text' placeholder='Description' value={videoDescription} onChange={(e)=>{setVideoDescription(e.target.value)}}/>
                    <FormErrorMessage>Required</FormErrorMessage>
                </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleEditVideo}> 
                Edit
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }