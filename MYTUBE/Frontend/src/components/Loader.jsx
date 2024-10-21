import { Flex, Spinner } from "@chakra-ui/react";

export default function Loader(){
    return (
        <Flex bg="#EDF2F7" alignItems="center" justifyContent="center" minH="90vh">
            <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='#2D3748'
                size='xl'
                />
        </Flex>
    )
}