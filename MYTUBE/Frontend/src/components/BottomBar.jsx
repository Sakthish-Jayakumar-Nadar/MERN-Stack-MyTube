import { Box, Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { CiHome } from "react-icons/ci";
import { MdOutlineSubscriptions } from "react-icons/md";
import { Link as RouterLink } from "react-router-dom";
import LoginModal from "./LoginModal";
import { FaUserCircle } from "react-icons/fa";
import loggedInUser from "../../utils/loggedInUser";
import { useContext } from "react";

export default function BottomBar(){
    const {isOpen, onClose, onOpen} = useDisclosure()
    const {user} = useContext(loggedInUser);

    return(
        <>
            <Flex zIndex={999} alignItems='center' justifyContent='space-around' position='fixed' left='0' bottom='0' bgColor='white' h='8vh' w='100vw' borderWidth='1px' borderTopColor='#718096'>
                <Button w='32%' as={RouterLink} to={'/'}> <CiHome/></Button>
                <Button w='32%'> <MdOutlineSubscriptions/></Button>
                <Button w='32%' onClick={onOpen}>
                    {(user._id)?<Text color='blue.500'>{user.emailId[0].toUpperCase()}</Text> : <FaUserCircle />}
                </Button>
            </Flex>
            <LoginModal isOpen={isOpen} onClose={onClose} />
        </>
    )
}