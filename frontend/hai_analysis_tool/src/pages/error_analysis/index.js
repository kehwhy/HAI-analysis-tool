import { Box, Button, TextField, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

export const IntermittentErrorAnalysis = () => {

    const features = useSelector((state) => state.model.features)
    const protectedFeatures = useSelector((state) => state.model.protectedFeatures)

    return (
        <Box sx={{display:'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr'}}>
            <Box sx={{display:'block', gridColumn:1, margin: 3}}>
            <Typography sx={{display:'block',  marginBottom: 4}}varient='body1'>Heaviest Weighted Features</Typography>
                {features.map((feature) => {
                    return <TextField sx={{display:'block', margin:'auto', marginBottom: 4}} key={feature} type='text' label={feature}></TextField>
                })}
                <Button variant='contained' sx={{display:'block'}}>Calculate Score</Button>
            </Box>
            <Box sx={{display:'block', gridColumn:2, margin: 3}}>
                <Typography sx={{display:'block',  marginBottom: 4}}varient='body1'>Protected Features</Typography>
                {protectedFeatures.map((feature) => {
                    return (
                    <Box sx={{marginBottom: 2}}>
                    <TextField key={feature} type='text' label={feature}></TextField>
                    <Button sx={{marginTop:1, marginBottom:1}} variant='contained'>CALCULATE BIAS METRICS</Button>
                    </Box>
                    )
                })}
            </Box>
        </Box>
    )
}

export const ContinuousErrorAnalysis = () => {
    return (
        <Box>
            <Button>CONTINUOUS</Button>
        </Box>
    )
}

export const ProactiveErrorAnalysis = () => {
    return (
        <Box>
            <Button>PROACTIVE</Button>
        </Box>
    )
}