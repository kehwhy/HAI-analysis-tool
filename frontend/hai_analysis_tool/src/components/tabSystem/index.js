import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";


const TabSystem = ({intermittentPage, continuousPage, proactivePage}) => {

    const [tabIndex, setTabIndex] = useState(0)

    return (
        <Box>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={(e) => setTabIndex(e.target.tabIndex)} aria-label="basic tabs example">
            <Tab tabIndex={0} label="INTERMITTENT" />
            <Tab tabIndex={1} label="CONTINUOUS" />
            <Tab tabIndex={2} label="PROACTIVE" />
        </Tabs>
        </Box>
        <Box sx={{ margin:2 }} hidden={tabIndex!==0}>
            {intermittentPage}
        </Box>
        <Box sx={{ margin:2 }} hidden={tabIndex!==1}>
            {continuousPage}
        </Box>
        <Box sx={{ margin:2 }} hidden={tabIndex!==2}>
            {proactivePage}
        </Box>
        </Box>
    )
}

export default TabSystem;