import { Box,  Typography } from "@mui/material";
import React, { useState } from "react";
import FeatureList from "../../components/featureList";
import MouseOverPopover from "../../components/popover";
import ProactiveProtectedList from "../../components/proactiveProtectedList";
import ProtectedFeatures from "../../components/protectedFeatures";
import ProtectedSliderList from "../../components/protectedSliderList";
import RecidivismScore from "../../components/recidivismScore";

export const IntermittentSocialBias = () => {
    

    const [biasInfo, setBiasInfo] = useState({})
    const [showBiasInfo, setShowBiasInfo] = useState(false)
    const [currFeature, setCurrFeature] = useState("")

    return (
        <Box sx={{display:'grid', gridTemplateRows: '1fr 1fr 1fr 1fr', gridTemplateColumns: '1fr 1fr 1fr 1fr'}}>
            <FeatureList/>
            <ProtectedFeatures setBiasInfo={setBiasInfo} setShowBiasInfo={setShowBiasInfo} setCurrFeature={setCurrFeature}/>
            <RecidivismScore biasInfo={biasInfo} showBiasInfo={showBiasInfo} currFeature={currFeature}/>
        </Box>
    )
}

export const ContinuousSocialBias = () => {

    const [biasInfo, setBiasInfo] = useState({})
    const [showBiasInfo, setShowBiasInfo] = useState(false)
    const [currFeature, setCurrFeature] = useState("")
    

    return (
        <Box sx={{display:'grid', gridTemplateRows: '1fr 1fr 1fr 1fr', gridTemplateColumns: '1fr 1fr 1fr 1fr'}}>
            <FeatureList/>
            <ProtectedSliderList setCurrFeature={setCurrFeature} setBiasInfo={setBiasInfo} setShowBiasInfo={setShowBiasInfo}/>
            <RecidivismScore biasInfo={biasInfo} showBiasInfo={showBiasInfo} currFeature={currFeature}/>

        </Box>
    )
}

export const ProactiveSocialBias = () => {

    const [biasInfo, setBiasInfo] = useState({})
    const [showBiasInfo, setShowBiasInfo] = useState(false)
    const [currFeature, setCurrFeature] = useState("")

    return (
        <Box sx={{display:'grid', gridTemplateRows: '1fr 1fr 1fr 1fr', gridTemplateColumns: '1fr 1fr 1fr 1fr'}}>
            <FeatureList/>
            <RecidivismScore biasInfo={biasInfo} showBiasInfo={showBiasInfo} currFeature={currFeature}/>
            <ProactiveProtectedList setCurrFeature={setCurrFeature} setBiasInfo={setBiasInfo} setShowBiasInfo={setShowBiasInfo}/>
        </Box>
    )
}