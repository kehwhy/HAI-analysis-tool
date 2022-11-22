import React from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Typography, Box, Button } from "@mui/material";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { indigo, pink, } from "@material-ui/core/colors";
import TabSystem from "../../components/tabSystem";
import { useSelector } from "react-redux";


const ToolPage = ({title, onClick, hidden, buttonTitle, pages}) => {

    const modelInfo = useSelector((state) => state.model.modelInfo)

    const theme = createTheme({
        palette: {
        primary: indigo,
        secondary: pink,
        },
      });

    return (
        <ThemeProvider theme={theme}>
            <Box hidden={hidden}> 
                <Typography sx={{ padding:2, display:'inline' }} variant='body1'>Model type: {modelInfo.Model}</Typography>
                <Typography sx={{ padding:2, marginLeft:25, display:'inline' }} variant='body1'>Model accuracy: {modelInfo.Evaluation.accuracy}</Typography>
                <Button sx={{ float:'right', padding:1, marginRight:5, display:'inline'}} startIcon={<ArrowCircleRightIcon fontSize='large'/>} onClick={onClick}>{buttonTitle}</Button>

                <Typography sx={{ padding:3, paddingLeft:2 }} variant='h5'>{title}</Typography>
                
                <TabSystem {...pages} ></TabSystem>
            </Box>
        </ThemeProvider>
        
    )
}
export default ToolPage;
