import React, { useState } from "react";
import { Box } from "@mui/material";
import ToolPage from "../toolPage";
import { ContinuousErrorAnalysis, IntermittentErrorAnalysis, ProactiveErrorAnalysis } from "../error_analysis";
import { ContinuousSocialBias, IntermittentSocialBias, ProactiveSocialBias } from "../social_bias";

const Tool = () => {

    // const [isPage, setPage] = useState(false)
    
    return (
        <Box sx={{ paddingTop:"80px", paddingLeft:2 }}>
            <ToolPage 
            title={"Social Bias"}
            pages={{
                intermittentPage: <IntermittentSocialBias></IntermittentSocialBias>,
                continuousPage: <ContinuousSocialBias></ContinuousSocialBias>,
                proactivePage: <ProactiveSocialBias></ProactiveSocialBias>
            }}
            />
        </Box>
    )
}

export default Tool;
