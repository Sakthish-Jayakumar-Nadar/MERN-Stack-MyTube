import { Box, Button, useDisclosure } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { CiHome } from "react-icons/ci";
import { MdOutlineSubscriptions } from "react-icons/md";
import { GrChannel } from "react-icons/gr";
import { LuView } from "react-icons/lu";
import { useContext } from "react";
import loggedInUser from "../../utils/loggedInUser";
import CreateChannelModel from "./CreateChannelModel";


export default function Sidebar({sideBarToggle}){
    const {user} = useContext(loggedInUser)
    const {isOpen, onOpen, onClose} = useDisclosure();
    return (
        <>
        {
            (sideBarToggle) ? 
            (<Box position='fixed' left='0' top='8vh' bgColor='white' h='92vh' w='12rem' pt='1rem' borderWidth='1px' borderRightColor='#718096' px='5px'>
                <Button as={RouterLink} to='/' w='100%' display='flex' justifyContent='space-between'> <CiHome/> Home</Button>
                <Button w='100%' display='flex' justifyContent='space-between' mt='0.2rem'> <MdOutlineSubscriptions/> Subscriptions</Button>
                {
                    (user._id) && (
                        (user.creator) 
                        ?<Button w='100%' display='flex' justifyContent='space-between' mt='0.2rem' as={RouterLink} to={`/channel/${user.channelId}`}> <LuView/> View Channel</Button>
                        :<Button w='100%' display='flex' justifyContent='space-between' mt='0.2rem' onClick={onOpen}> <GrChannel/> Create Channel</Button>
                    )
                }
            </Box>) :
            (<Box position='fixed' left='0' top='8vh' bgColor='white' h='92vh' w='5rem' pt='1rem' borderWidth='1px' borderRightColor='#718096' px='5px'>
                <Button as={RouterLink} to='/' w='100%'> <CiHome/></Button>
                <Button w='100%' mt='0.2rem'> <MdOutlineSubscriptions/></Button>
                {
                    (user._id) && (
                        (user.creator) 
                        ?<Button w='100%' mt='0.2rem' as={RouterLink} to={`/channel/${user.channelId}`}><LuView/></Button>
                        :<Button w='100%' mt='0.2rem' onClick={onOpen}><GrChannel/></Button>
                    )
                }
            </Box>)
        }
        <CreateChannelModel isOpen={isOpen} onClose={onClose} />
        </>
    )
}