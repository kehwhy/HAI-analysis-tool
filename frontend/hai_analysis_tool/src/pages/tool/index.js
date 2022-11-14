import React, { useState } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Typography, Box, Tabs, Tab } from "@mui/material";
import { indigo, pink, } from "@material-ui/core/colors";


const Tool = () => {

    const [tabIndex, setTabIndex] = useState(0)

    const theme = createTheme({
        palette: {
        primary: indigo,
        secondary: pink,
        },
      });

    return (
        <ThemeProvider theme={theme}>
        <Box sx={{ paddingTop:"80px", paddingLeft:2 }}> 
        <Typography sx={{ padding:1, display:'inline' }} variant='body1'>Model type: </Typography>
        <Typography sx={{ padding:1, paddingLeft:25, display:'inline' }} variant='body1'>Model accuracy: </Typography>
        <Typography sx={{ padding:1 }} variant='h5'>Error Analysis </Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabIndex} onChange={(e) => setTabIndex(e.target.tabIndex)} aria-label="basic tabs example">
                <Tab tabIndex={0} label="INTERMITTENT" />
                <Tab tabIndex={1} label="CONTINUOUS" />
                <Tab tabIndex={2} label="PROACTIVE" />
            </Tabs>
            </Box>
            <Box sx={{ margin:2 }} hidden={tabIndex!==0}>
                 Tab 1
            </Box>
            <Box sx={{ margin:2 }} hidden={tabIndex!==1}>
                Tab 2
            </Box>
            <Box sx={{ margin:2 }} hidden={tabIndex!==2}>
                Tab 3
            </Box>
        </Box>
        </ThemeProvider>
        
    )
}
export default Tool;
