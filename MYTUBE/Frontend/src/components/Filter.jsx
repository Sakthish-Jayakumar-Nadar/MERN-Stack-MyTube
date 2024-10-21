import { Box, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Filter({width, sideBarToggle, setVideos}){
    const [categories, setCategories] = useState([]);
    useEffect(()=>{
        fetch('http://localhost:3000/api/video/category')
        .then(response => response.json())
        .then((data)=>{setCategories(data)})
        .catch((err)=>{console.log("error : "+err)});
    },[])

    function handleFilter(category){
        fetch('http://localhost:3000/api/video/category/'+category)
        .then(response => response.json())
        .then((data)=>{setVideos(data)})
        .catch((err)=>{console.log("error : "+err)});
    }

    function handleFilterAll(){
        fetch('http://localhost:3000/api/videos')
        .then(response => response.json())
        .then((data)=>{setVideos(data)})
        .catch((err)=>{console.log("error : "+err)});
    }

    return (
        <Box whiteSpace='nowrap'  mt='8vh' ml= {width < 770 ? '0' : (sideBarToggle ? '12rem' : '5rem')} overflowX='scroll'>
            <Button size='xs' minW='7rem' m='3px' onClick={handleFilterAll}>All</Button>
            { categories.map((category)=>( <Button key={category} size='xs' minW='7rem' m='3px' onClick={()=>{handleFilter(category)}}>{category}</Button> )) }
        </Box>
    )
}