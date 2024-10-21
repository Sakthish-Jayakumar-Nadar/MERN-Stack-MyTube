import { AspectRatio, Box, Flex, Img, Link, SimpleGrid, Text } from "@chakra-ui/react";
import { FaUserCircle } from "react-icons/fa";
import { videoData } from "../../utils/videoData";
import Sidebar from "./Sidebar";
import useWindowDimensions from "./useWindowDimensions";
import BottomBar from "./BottomBar";
import { useContext, useEffect, useState } from "react";
import sidebarToggle from "../../utils/sidebarToggle";
import { Link as RouterLink } from "react-router-dom";
import Filter from "./Filter";
import Loader from "./loader";

export default function Home() {
    const {sideBarToggle, setSideBarToggle} = useContext(sidebarToggle)
    const {height, width} = useWindowDimensions();
    const [videos , setVideos] = useState([]);
    useEffect(() => {  
        fetch('http://localhost:3000/api/videos')
        .then(response => response.json())
        .then((data)=>{setVideos(data)})
        .catch((err)=>{console.log("error : "+err)});
        return ()=>{
            setSideBarToggle(false);
        }
    },[])
    function views(count){
        if(count > 999999){
            return (count/1000000).toFixed(2) + "M"
        }
        if(count > 999){
            return (count/1000).toFixed(2) + "K"
        }
        return count;
    }
    return (
        <>
            {width > 770 ? <Sidebar sideBarToggle = {sideBarToggle}/> : <BottomBar />}
            <Filter width={width} sideBarToggle={sideBarToggle} setVideos={setVideos}/>
            <SimpleGrid mb='8vh' ml= {width < 770 ? '0' : (sideBarToggle ? '12rem' : '5rem')} p='0.5rem' columns={width < 430 ? 1 : (width < 770 ? 2 : (sideBarToggle ? 3 : 4))} spacing={10}>
                {
                    videos.map((video) => (
                        <Box key={video._id} h={undefined} w='100%' rounded='md' aspectRatio={6/5} _hover={{boxShadow:'base'}}> 
                            <Link as={RouterLink} to={'/playing/'+video._id}>
                            <Img src={video.thumbnailUrl} rounded='md'  h={undefined} aspectRatio={5/3}  alt='Video Image'/>
                            </Link> 
                            <Flex w='100%' h={undefined} aspectRatio={6/1} alignItems='center'>
                                <Text fontSize='3rem' pl='10px' w='20%' display='flex' justifyContent='center' alignItems='center'>
                                    <Link as={RouterLink} to={'/channel/'+video.channelId}> <FaUserCircle /> </Link>
                                </Text>
                                <Box pl='10px'>
                                    <Box className="title" fontSize='100%'><Link as={RouterLink} to={'/playing/'+video._id} _hover={{textDecoration:'none'}}>{video.title}</Link></Box>
                                    <Text><Link _hover={{textDecoration:'none'}}>{video.channelName}</Link></Text>
                                    <Text fontSize='0.9rem'><Link as={RouterLink} to={'/playing/'+video._id} _hover={{textDecoration:'none'}}>{views(video.views) + " views"}</Link></Text>
                                </Box>
                            </Flex>
                        </Box>
                    ))
                }
            </SimpleGrid>
        </>
    )
}