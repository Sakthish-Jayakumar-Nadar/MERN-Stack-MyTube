import { Box, Button, Flex, Img, Link, Menu, MenuButton, MenuItem, MenuList, SimpleGrid, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { FaUserCircle } from "react-icons/fa";
import { FaEllipsisVertical } from "react-icons/fa6";
import Sidebar from "./Sidebar";
import useWindowDimensions from "./useWindowDimensions";
import BottomBar from "./BottomBar";
import sidebarToggle from "../../utils/sidebarToggle";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import channelContext from "../../utils/channelContext";
import loggedInUser from "../../utils/loggedInUser";
import EditVideoModal from "./EditVideoModal";

export default function Channel(){
    const { sideBarToggle, setSideBarToggle } = useContext(sidebarToggle);
    const { user } = useContext(loggedInUser);
    const [editVideo, setEditVideo] = useState({})
    const [channelVideos, setChannelVideos] = useState([]);
    const {channel, setChannel} = useContext(channelContext);
    const {height, width} = useWindowDimensions();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const { id } = useParams();
    useEffect(()=>{
        return () => {
            setSideBarToggle(false)
        }
    },[])
    useEffect(()=>{
        fetch(`http://localhost:3000/api/channel/${id}`)
        .then(response => response.json())
        .then((data) => { setChannel(data)})
        .catch(error => console.error('Error:', error.message));
        fetch(`http://localhost:3000/api/channel/${id}/videos`)
        .then(response => response.json())
        .then((data) => { setChannelVideos(data)})
        .catch(error => console.error('Error:', error.message));
    },[id])
    function views(count){
        if(count > 999999){
            return (count/1000000).toFixed(2) + "M"
        }
        if(count > 999){
            return (count/1000).toFixed(2) + "K"
        }
        return count;
    }
    function handleVideoDelete(videoId){
        const token = localStorage.getItem('token');
        if(token){
            fetch(`http://localhost:3000/api/channel/${id}/deleteVideo/${videoId}`, {
                method: 'DELETE', 
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
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
        else{
            toast({
                title: "Login first",
                status: 'error',
                duration: 1000,
                isClosable: true,
                position: 'top'
            })
        }
    }
    return (
        <>
            {width > 770 ? <Sidebar sideBarToggle = {sideBarToggle}/> : <BottomBar />}
            { (channel._id) &&
                <>
                    <Flex mt='8vh' ml={width > 770 && (sideBarToggle ? '12rem' : '5rem')} p='1rem'>
                        <Text fontSize='6rem' pl='10px'><FaUserCircle /></Text>
                        <Flex direction='column' pl='10px'>
                            <Text className="channel" fontSize='1.5rem' fontWeight='bold'>{channel.channelName}</Text>
                            <Text>{views(channel.subscribers)+" subscribers . "+views(channelVideos.length)+" videos"}</Text>
                        </Flex>
                    </Flex>
                    <SimpleGrid mt='1rem' mb='8vh' ml= {width > 770 && (sideBarToggle ? '12rem' : '5rem')} p='1rem' columns={width < 430 ? 1 : (width < 770 ? 2 : (sideBarToggle ? 3 : 4))} spacing={10}>
                        {
                            channelVideos.map((video) => (
                                <Box key={video._id} height={undefined} w='100%' rounded='md' aspectRatio={6/5} _hover={{boxShadow:'base'}}> 
                                    <Link  as={RouterLink} to={'/playing/'+video._id} w='100%'><Img src={video.thumbnailUrl} rounded='md'w='100%' h={undefined} aspectRatio={5/3}  alt='Video Image'/></Link>
                                    <Box w='100%' display='flex' justifyContent='space-between' alignItems='flex-start'>
                                        <Box as={RouterLink} to={'/playing/'+video._id} h={undefined} aspectRatio={6/1} pl='10px'>
                                            <Box className="title" fontSize='100%'>{video.title}</Box>
                                            <Text>{channel.channelName}</Text>
                                            <Text fontSize='0.9rem'>{views(video.views) + " views"}</Text>
                                        </Box>
                                        {
                                            (user.channelId && id == user.channelId) &&
                                            (<Flex alignItems='flex-end'>
                                                <Menu>
                                                <MenuButton as={Button}>
                                                <FaEllipsisVertical/>
                                                </MenuButton>
                                                <MenuList>
                                                    <MenuItem onClick={() => { setEditVideo(video); onOpen()}}>Edit</MenuItem>
                                                    <MenuItem onClick={() => handleVideoDelete(video._id)}>Delete</MenuItem>
                                                </MenuList>
                                                </Menu>
                                            </Flex>)
                                        }
                                    </Box>
                                </Box>
                            ))
                        }
                    </SimpleGrid>
                </>
            }
            <EditVideoModal isOpen={isOpen} onClose={onClose} video={editVideo} setChannelVideos={setChannelVideos} setEditVideo={setEditVideo}/>
        </>
    )
}