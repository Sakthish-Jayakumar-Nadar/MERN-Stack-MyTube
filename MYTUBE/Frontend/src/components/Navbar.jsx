import { Box, Button, Input, IconButton, FormControl, useDisclosure, Text } from "@chakra-ui/react";
import { SearchIcon } from '@chakra-ui/icons'
import { CiMenuBurger } from "react-icons/ci";
import { SiYoutubekids } from "react-icons/si";
import { FaUserCircle } from "react-icons/fa";
import LoginModal from "./LoginModal";
import useWindowDimensions from "./useWindowDimensions";
import sidebarToggle from "../../utils/sidebarToggle";
import { useContext, useEffect, useState } from "react";
import loggedInUser from "../../utils/loggedInUser";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const { setSideBarToggle } = useContext(sidebarToggle);
    const { user } = useContext(loggedInUser);
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();
    useEffect(()=>{
        return () => {
            setSideBarToggle(false)
        }
    },[])
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { height, width } = useWindowDimensions();
    return (
        <>
            <Box position='fixed' top='0' left='0' zIndex='99' bgColor='white' h='8vh' w='100vw' display='flex' alignItems='center' justifyContent='space-between' pr='10px' borderWidth='1px' borderBottomColor='#718096'>
                <Box w='12rem' display='flex' alignItems='center' justifyContent='space-between' px='10px'>
                    {width > 770 && <Button onClick={() => setSideBarToggle(pre => !pre)}>
                        <CiMenuBurger />
                    </Button>}
                    <Box display='flex' alignItems='center' justifyContent='center'>
                        <Box pr='5px'>
                            <SiYoutubekids />
                        </Box>
                        <h1>MY_TUBE</h1>
                    </Box>
                </Box>
                <FormControl h='100%' maxW={width > 770 && '35rem'} display='flex' alignItems='center'>
                    <Input borderRightRadius='0px' borderColor='#718096' value={searchText} onChange={(e) => setSearchText(e.target.value)}/>
                    <IconButton aria-label='Search database' borderLeftRadius='0px' disabled={searchText.length <= 0} onClick={()=>{navigate('/searchVideos/'+searchText); setSearchText('')}} icon={<SearchIcon />} />
                </FormControl>
                {width > 770 && <Button fontSize='1.5rem' onClick={onOpen}>
                    {(user._id)?<Text color='blue.500' fontSize='1.3rem'>{user.emailId[0].toUpperCase()}</Text> : <FaUserCircle />}
                </Button>}
            </Box>
            <LoginModal isOpen={isOpen} onClose={onClose}/>
        </>
    )
}