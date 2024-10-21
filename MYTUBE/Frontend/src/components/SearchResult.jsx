import { Box, Flex, Img, Link, Text } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import { FaUserCircle } from "react-icons/fa";
import BottomBar from "./BottomBar";
import useWindowDimensions from "./useWindowDimensions";
import { useContext, useEffect, useState } from "react";
import sidebarToggle from "../../utils/sidebarToggle";
import { useParams } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

export default function SearchResult() {
    const {sideBarToggle} = useContext(sidebarToggle);
    const {height, width} = useWindowDimensions();
    const { searchText } = useParams();
    const [videos, setVideos] = useState([]);
    useEffect(()=>{
        fetch(`http://localhost:3000/api/searchVideos/${searchText}`)
        .then((response) => response.json())
        .then(data => {setVideos(data)})
        .catch((err) => {console.log("error : "+err.message)})
    },[searchText])
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
            <Flex my='8vh' ml= {width > 770 && (sideBarToggle ? '12rem' : '5rem')} minH='90vh' direction='column' p='1rem'>
                {
                    videos.map((video) => (
                        <Flex key={video._id} pt='1rem' direction={width < 427 && 'column'}>
                            <Link as={RouterLink} to={'/playing/'+video._id}>
                                <Img src={video.thumbnailUrl} w={width > 427 ? '35vw' : '95vw'} h={undefined} aspectRatio={5/3} rounded='md'/>
                            </Link>
                            <Box pl={width > 427 && '10px'}>
                                <Box className="title" fontWeight='bold' fontSize={width > 770 && '1.5rem'} w={width > 427 ? '40vw' : '95vw'}>
                                <Link _hover={{textDecoration:'none'}} as={RouterLink} to={'/playing/'+video._id}>{video.title}</Link>
                                </Box>
                                <Text fontSize='1rem'> <Link _hover={{textDecoration:'none'}} as={RouterLink} to={'/playing/'+video._id}>{views(video.views)} views</Link> </Text>
                                <Link _hover={{textDecoration:'none'}} as={RouterLink} to={'/channel/'+video.channelId}> <Text display='flex' alignItems='center' fontSize='2rem'> <FaUserCircle /> <span style={{fontSize:'1rem', paddingLeft:'10px'}}>{video.channelName}</span></Text> </Link>
                                {width > 427 && <Box className="channel" fontSize='1rem' w={width > 425 ? '40vw' : '95vw'}>
                                    <Link _hover={{textDecoration:'none'}} as={RouterLink} to={'/playing/'+video._id}>{video.description}</Link>
                                </Box>}
                            </Box>
                        </Flex>
                    ))
                }
            </Flex>
        </>
    )
}