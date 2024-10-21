import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    useDisclosure,
    Box,
    Button,
  } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom';
import { useContext, useEffect } from 'react'
import { CiHome, CiMenuBurger } from 'react-icons/ci';
import { MdOutlineSubscriptions } from 'react-icons/md';
import { SiYoutubekids } from 'react-icons/si';
import loggedInUser from '../../utils/loggedInUser';
import { LuView } from 'react-icons/lu';
import { GrChannel } from 'react-icons/gr';
import CreateChannelModel from './CreateChannelModel';

  export default function SideDrawer({ sideBarToggle, setSideBarToggle }) {
    const {user} = useContext(loggedInUser);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const {isOpen : Open, onOpen : open, onClose : close} = useDisclosure();
    useEffect(()=>{
        sideBarToggle ? onOpen() : onClose();
    },[sideBarToggle])
    return (
        <>
            <Drawer placement={'left'} onClose={onClose} isOpen={isOpen} size='xs'>
                <DrawerOverlay />
                <DrawerContent>
                <DrawerHeader h='8vh' display='flex' alignItems='center' justifyContent='space-between' px='10px' borderBottomWidth='1px'>
                    <Button onClick={() => setSideBarToggle(pre => !pre)}>
                        <CiMenuBurger />
                    </Button>
                    <Box display='flex' alignItems='center' justifyContent='center'>
                        <Box pr='5px'>
                            <SiYoutubekids />
                        </Box>
                        <h1>MY_TUBE</h1>
                    </Box>
                </DrawerHeader>
                <DrawerBody>
                    <Button as={RouterLink} to='/' w='100%' display='flex' justifyContent='space-between'> <CiHome/> Home</Button>
                    <Button w='100%' display='flex' justifyContent='space-between' mt='0.2rem'> <MdOutlineSubscriptions/> Subscriptions</Button>
                    {
                        (user._id) && (
                            (user.creator) 
                            ?<Button w='100%' display='flex' justifyContent='space-between' mt='0.2rem' as={RouterLink} to={`/channel/${user.channelId}`}> <LuView/> View Channel</Button>
                            :<Button w='100%' display='flex' justifyContent='space-between' mt='0.2rem' onClick={open}> <GrChannel/> Create Channel</Button>
                        )
                    }
                </DrawerBody>
                </DrawerContent>
            </Drawer>
            <CreateChannelModel isOpen={Open} onClose={close}/>
        </>
    )
  }