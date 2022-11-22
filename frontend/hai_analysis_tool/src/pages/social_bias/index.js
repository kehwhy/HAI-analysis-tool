import { Box,  Typography } from "@mui/material";
import React, { useState } from "react";
import FeatureList from "../../components/featureList";
import MouseOverPopover from "../../components/popover";
import ProtectedFeatures from "../../components/protectedFeatures";
import ProtectedSliderList from "../../components/protectedSliderList";
import RecidivismScore from "../../components/recidivismScore";

export const IntermittentSocialBias = () => {
    

    const [biasInfo, setBiasInfo] = useState({})
    const [showBiasInfo, setShowBiasInfo] = useState(false)
    

    const explanations = {
        DisparateImpact: "DisparateImpact explanation!",
        MeanDifference: "MeanDifference explanation!"
    }

    return (
        <Box sx={{display:'grid', gridTemplateRows: '1fr 1fr 1fr 1fr', gridTemplateColumns: '1fr 1fr 1fr 1fr'}}>
            <FeatureList/>
            <ProtectedFeatures setBiasInfo={setBiasInfo} setShowBiasInfo={setShowBiasInfo} />
            <RecidivismScore/>
            <Box hidden={!showBiasInfo} sx={{display:'block', textAlign:'center', gridRow:2, gridColumn:3, margin:3}}>
                <Typography variant='h4'>Bias information</Typography>
                {Object.keys(biasInfo).map((key)=> {
                    return (
                        <Box sx={{margin:2}}>
                            <Typography sx={{display:'inline', margin:'auto'}} variant="h5">{key}</Typography>
                            <MouseOverPopover text={explanations[key]}/>
                            <Typography sx={{display:'inline'}} variant="h6">{biasInfo[key]}</Typography>
                            
                        </Box>
                    )
                })}

            </Box>
        </Box>
    )
}

export const ContinuousSocialBias = () => {
    return (
        <Box sx={{display:'grid', gridTemplateRows: '1fr 1fr 1fr 1fr', gridTemplateColumns: '1fr 1fr 1fr 1fr'}}>
            <FeatureList/>
            <ProtectedSliderList/>
            <RecidivismScore/>
        </Box>
    )
}

export const ProactiveSocialBias = () => {
    return (
        <Box sx={{display:'grid', gridTemplateRows: '1fr 1fr 1fr 1fr', gridTemplateColumns: '1fr 1fr 1fr 1fr'}}>
            <FeatureList/>
            <RecidivismScore/>
        </Box>
    )
}