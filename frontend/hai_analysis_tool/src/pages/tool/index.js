import React, { useState } from "react";
import { Box } from "@mui/material";
import ToolPage from "../toolPage";
import { ContinuousErrorAnalysis, IntermittentErrorAnalysis, ProactiveErrorAnalysis } from "../error_analysis";
import { ContinuousSocialBias, IntermittentSocialBias, ProactiveSocialBias } from "../social_bias";

const Tool = () => {

    const [isPage, setPage] = useState(false)
    
    return (
        <Box sx={{ paddingTop:"80px", paddingLeft:2 }}>
            <ToolPage 
            title={"Error Analysis"}
            onClick={() => setPage(!isPage)}
            hidden={isPage}
            buttonTitle={"Social Bias"}
            pages={{
                intermittentPage: <IntermittentErrorAnalysis></IntermittentErrorAnalysis>,
                continuousPage: <ContinuousErrorAnalysis></ContinuousErrorAnalysis>,
                proactivePage: <ProactiveErrorAnalysis></ProactiveErrorAnalysis>

            }}
            />
            <ToolPage 
            title={"Social Bias"}
            onClick={() => setPage(!isPage)}
            hidden={!isPage}
            buttonTitle={"Error Analysis"}
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
