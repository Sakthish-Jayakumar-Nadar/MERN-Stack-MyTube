import { AspectRatio, Box, Button, Flex, FormControl, Img, Link, Text, Textarea, useToast } from "@chakra-ui/react";
import { FaUserCircle } from "react-icons/fa";
import { SlDislike, SlLike } from "react-icons/sl";
import { PiDownloadSimpleThin, PiShareFatThin } from "react-icons/pi";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import SideDrawer from "./SideDrawer";
import useWindowDimensions from "./useWindowDimensions";
import BottomBar from "./BottomBar";
import sidebarToggle from "../../utils/sidebarToggle";
import loggedInUser from "../../utils/loggedInUser";
import { useParams } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

export default function PlayVideo() {
    const { id } = useParams();
    const [toggleDiscription, setToggleDiscription] = useState(false);
    const [playing, setPlaying] = useState(null);
    const [sideVideos, setSideVideos] = useState([]);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    const [editComment, setEditComment] = useState("");
    const [editId, setEditId] = useState('');
    const { sideBarToggle, setSideBarToggle } = useContext(sidebarToggle);
    const { user } = useContext(loggedInUser);
    const toast = useToast();

    useEffect(()=>{
        return () => {
            setSideBarToggle(false);
            setPlaying(null);
            setSideVideos([]);
        }
    },[])
    useEffect(()=>{
        fetch(`http://localhost:3000/api/video/${id}`)
        .then(response => response.json())
        .then((data)=>{setPlaying(data);
            setComments(data.comments);
        })
        .catch((err)=>{console.log("error : "+err)});

        fetch(`http://localhost:3000/api/sideVideo/${id}`)
        .then(response => response.json())
        .then((data)=>{setSideVideos(data)})
        .catch((err)=>{console.log("error : "+err)});
    },[id])
    const { height, width } = useWindowDimensions();
    function likesAndDislikes(count){
        if(count > 999999){
            return (count/1000000).toFixed(2) + "M"
        }
        if(count > 999){
            return (count/1000).toFixed(2) + "K"
        }
        return count;
    }
    function handleAddComment(){
        const token = localStorage.getItem('token');
        if(token){
            fetch(`http://localhost:3000/api/video/${id}/addComment`, {
                method: 'POST', 
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId : user._id,
                    text : comment
                })
              }).then((response) => response.json())
              .then(data => {
                if(data._id){
                    setComments(data.comments);
                    setComment('');
                    toast({
                      title: "Comment added",
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
    function handleEditComment(){
        const token = localStorage.getItem('token');
        if(token){
            fetch(`http://localhost:3000/api/video/${id}/editComment/${editId}`, {
                method: 'POST', 
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    text : editComment  
                })
              }).then((response) => response.json())
              .then(data => {
                if(data._id){
                    setComments(data.comments);
                    setEditId('');
                    setEditComment('');
                    toast({
                      title: "Comment edited",
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

    function handleChange(event){
        setComment(event.target.value);
        event.target.rows = event.target.value.split('\n').length;
    }

    function handleEditChange(event){
        setEditComment(event.target.value);
        event.target.rows = event.target.value.split('\n').length;
    }

    function handleDelete(){
        const token = localStorage.getItem('token');
        if(token){
            fetch(`http://localhost:3000/api/video/${id}/deleteComment/${editId}`, {
                method: 'DELETE', 
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    text : editComment  
                })
              }).then((response) => response.json())
              .then(data => {
                if(data._id){
                    setComments(data.comments);
                    setEditId('');
                    setEditComment('');
                    toast({
                      title: "Comment deleted",
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
            {width > 770 ? <SideDrawer sideBarToggle={sideBarToggle} setSideBarToggle={setSideBarToggle} /> : <BottomBar />}
            {(playing) &&
            <Flex w={width > 770 ? '97vw' : '100vw'} minH='100vh' py='8vh' justifyContent='center'>
                <Flex direction='column' w={width > 770 ? '65%' : '100%'} h='100%' alignItems='center' pt={width > 770 ? '2rem' : '0'}>
                    <AspectRatio w={width > 770 ? '80%' : '100%'} h={undefined} aspectRatio={5/3}>
                    <iframe
                        title='Demo Video'
                        src={playing.url}
                        allowFullScreen
                    />
                    </AspectRatio>
                    <Box className="title" fontWeight='bold' fontSize='100%' w={width > 770 ? '80%' : '100%'} overflow='hidden' textOverflow='ellipsis'>{playing.title}</Box>
                    <Flex w={width > 770 ? '80%' : '97%'} h='10%' alignItems='center' justifyContent='space-between' mt='1rem'>
                        <Flex alignItems='center'>
                            <Link as={RouterLink} to={'/channel/'+playing.channelId}> <Text fontSize='3rem'> <FaUserCircle /> </Text> </Link>
                            <Box pl='1rem'>
                                <Link as={RouterLink} to={'/channel/'+playing.channelId} _hover={{textDecor:'none'}}> <Box className="channel">{playing.channelName}</Box> </Link>
                                <Link as={RouterLink} to={'channel/'+playing.channelId} _hover={{textDecor:'none'}}> <Box className="channel" fontSize='0.85rem'>{likesAndDislikes(playing.subscribers)+' subscribers'}</Box> </Link>
                            </Box>
                        </Flex>
                        <Flex alignItems='center' justifyContent='flex-end'>
                            <Button borderRightRadius= {width > 770 && '0'}>Subscribe</Button>
                            {width > 1025 && <>
                                <Button borderRadius='0'><Text pr='5px'><SlLike /></Text>{likesAndDislikes(playing.likes)}</Button>
                                <Button borderRadius='0'><Text pr='5px'><SlDislike /></Text>{likesAndDislikes(playing.dislikes)}</Button>
                                <Button borderRadius='0'><PiShareFatThin /></Button>
                                <Button borderLeftRadius='0'><PiDownloadSimpleThin /></Button>
                            </>}
                        </Flex>
                    </Flex>
                    {width <= 1025 && <Box mt='1rem'>
                        <Button borderRightRadius='0'><Text pr='5px'><SlLike /></Text>{likesAndDislikes(playing.likes)}</Button>
                        <Button borderRadius='0'><Text pr='5px'><SlDislike /></Text>{likesAndDislikes(playing.dislikes)}</Button>
                        <Button borderRadius='0'><PiShareFatThin /></Button>
                        <Button borderLeftRadius='0'><PiDownloadSimpleThin /></Button>
                    </Box>
                    }
                    <Box w={width > 770 ? '80%' : '97%'} bgColor='#E2E8F0' rounded='md' mt='1rem'>
                        <Flex w='100%' p='1rem' alignItems='center' justifyContent='space-between'>
                            <Text>{likesAndDislikes(playing.views)+" views"}</Text>
                            <Button onClick={()=>setToggleDiscription(pre => !pre)}>{toggleDiscription ? <FaChevronUp/> : <FaChevronDown/>}</Button>
                        </Flex>
                        {toggleDiscription && <p w='100%' style={{padding:'1rem'}}>
                            {playing.description}
                        </p>}
                    </Box>
                    { width < 616 && <Flex direction='column' width='100%' alignItems='flex-start' pt='1rem'>
                        {
                            sideVideos.map((svideo)=>(
                                <Flex key={svideo._id} w='100%' aspectRatio={6/5} pb='1rem' direction='column'>
                                    <Link as={RouterLink} to={`/playing/${svideo._id}`}>
                                        <Img src={svideo.thumbnailUrl} w='100%' h={undefined} aspectRatio={5/3} rounded='md'/>
                                    </Link>
                                    <Box pl='10px' w='100%'>
                                        <Box className="title" fontWeight='bold' fontSize='100%' w='100%'>
                                            <Link _hover={{textDecoration:'none'}} as={RouterLink} to={`/playing/${svideo._id}`}>
                                                {svideo.title}
                                            </Link>
                                        </Box>
                                        <Text className="channel" w='100%'><Link _hover={{textDecoration:'none'}} as={RouterLink} to={`/channel/${svideo.channelId}`}>{svideo.channelName}</Link></Text>
                                        <Text fontSize='0.9rem'><Link _hover={{textDecoration:'none'}} as={RouterLink} to={`/playing/${svideo._id}`}>{likesAndDislikes(svideo.views)} views</Link></Text>
                                    </Box>
                                </Flex>
                            ))
                        }
                        </Flex>}
                    { (width >= 616 && width < 770) && <Flex direction='column' width='100%' alignItems='flex-start' pt='1rem'>
                        {
                            sideVideos.map((svideo) => (
                                <Flex key={svideo._id} w='100%' h='30vh' pb='1rem'>
                                    <Link w='40%' as={RouterLink} to={`/playing/${svideo._id}`}>
                                        <Img src={svideo.thumbnailUrl} w='100%' h='100%' rounded='md'/>
                                    </Link>
                                    <Box pl='10px' w='60%'>
                                        <Box className="title" fontWeight='bold' fontSize='100%' w='100%'>
                                            <Link _hover={{textDecoration:'none'}} as={RouterLink} to={`/playing/${svideo._id}`}>
                                                {svideo.title}
                                            </Link>
                                        </Box>
                                        <Text className="channel" w='100%'><Link _hover={{textDecoration:'none'}} as={RouterLink} to={`/channel/${svideo.channelId}`}>{svideo.channelName}</Link></Text>
                                        <Text fontSize='0.9rem'><Link _hover={{textDecoration:'none'}} as={RouterLink} to={`/playing/${svideo._id}`}>{likesAndDislikes(svideo.views)} views</Link></Text>
                                    </Box>
                                </Flex>
                            ))
                        }
                        </Flex>}
                    <Box w={width > 770 ? '80%' : '97%'} mt='1rem'>
                        <Box w='100%'>{playing.comments.length} Comments</Box>
                        <Flex w='100%' alignItems='center' mt='1rem'>
                        {width > 770 && <Link> <Text fontSize='3rem'> <FaUserCircle /> </Text> </Link>}
                            <Textarea placeholder='Add your comment' borderLeftRadius='0' borderRightRadius='0' borderBottom='2px solid black' rows={1} onChange={(event) => handleChange(event)} value={comment}/>
                            <Button borderLeftRadius='0' disabled={(comment.trim().length > 0)?false:true} onClick={handleAddComment}>Add</Button>
                        </Flex>
                        {
                            comments.map((comment)=>(        
                                <Flex key={comment._id} w='100%' alignItems='flex-start' mt='1rem'>
                                    <Link> <Text fontSize={width > 770 ? '3rem' : '2.5rem'}> <FaUserCircle /> </Text> </Link>
                                    <Flex direction='column'>
                                        <Text>@{comment.emailId}</Text>
                                        {
                                            (editId == comment._id && user._id == comment.userId)? 
                                            (
                                                <Textarea placeholder='Edit your comment' w={width > 700 ? ((width*0.5044)-(48)) : ((width*0.97)-(40))} borderLeftRadius='0' borderRightRadius='0' borderBottom='2px solid black' rows={1} onChange={(event) => handleEditChange(event)} value={editComment}/>
                                            )
                                            : (
                                                <pre style={{ whiteSpace: 'pre-wrap', width:width > 700 ? ((width*0.5044)-(48)) : ((width*0.97)-(40))}}>
                                                    {comment.text}
                                                </pre>
                                            ) 
                                        }
                                        <Box>
                                        <Button borderRightRadius='0' size='xs'><Text pr='5px'><SlLike /></Text>{likesAndDislikes(comment.likes)}</Button>
                                        <Button borderRadius='0' size='xs'><Text pr='5px'><SlDislike /></Text>{likesAndDislikes(comment.dislikes)}</Button>
                                        {
                                            (user._id == comment.userId) && (
                                                (editId == comment._id)?(
                                                <>
                                                <Button borderRadius='0' size='xs' disabled={editComment.trim().length <= 0} onClick={handleEditComment}>Save</Button>
                                                <Button borderRadius='0' size='xs' onClick={()=>{setEditId('')}}>Cancel</Button>
                                                <Button borderRadius='0' size='xs' onClick={handleDelete}>Delete</Button>
                                                </>):
                                                <Button borderRadius='0' size='xs' onClick={()=>{setEditId(comment._id); setEditComment(comment.text)}}>Edit</Button>
                                            )   
                                        }
                                        <Button borderLeftRadius='0' size='xs'>Reply</Button>
                                        </Box>
                                    </Flex>
                                </Flex>
                            ))
                        }
                    </Box>
                </Flex>
                { width > 770 && <Flex direction='column' w='32%' h='100%' alignItems='flex-start' pt='2rem'>
                    {sideVideos.map((svideo)=>(
                            <Flex key={svideo._id} w='100%' h='17vh' pb='1rem'>
                            <Link w='40%' as={RouterLink} to={`/playing/${svideo._id}`}>
                                <Img src={svideo.thumbnailUrl} w='100%' h='100%' rounded='md'/>
                            </Link>
                            <Box pl='10px' w='60%'>
                                <Box className="title" fontWeight='bold' fontSize='100%' w='80%' overflow='hidden' textOverflow='ellipsis'>
                                    <Link _hover={{textDecoration:'none'}} as={RouterLink} to={`/playing/${svideo._id}`}>{svideo.title}</Link>
                                </Box>
                                <Text><Link _hover={{textDecoration:'none'}} as={RouterLink} to={`/channel/${svideo.channelId}`}>{svideo.channelName}</Link></Text>
                                <Text fontSize='0.9rem'><Link _hover={{textDecoration:'none'}} as={RouterLink} to={`/playing/${svideo._id}`}>{likesAndDislikes(svideo.views)} views</Link></Text>
                            </Box>
                        </Flex>
                    )
                    )}
                </Flex>}
            </Flex>}
        </>
    )
}