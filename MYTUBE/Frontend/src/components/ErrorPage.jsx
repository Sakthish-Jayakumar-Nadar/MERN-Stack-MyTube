import { Button, Flex } from "@chakra-ui/react";
import { useNavigate, useRouteError } from "react-router-dom";

export default function ErrorPage(){
    const err = useRouteError();
    const navigate = useNavigate();
    return (
        <Flex direction='column' w='100vw' minH='100vh' alignItems='center'>
            <h1>Oops!!</h1>
            <h3>{err.status} {err.statusText}</h3>
            <h3>{err.data}</h3>
            <Button onClick={()=>{navigate('/')}}>Home</Button>
        </Flex>
    )
}