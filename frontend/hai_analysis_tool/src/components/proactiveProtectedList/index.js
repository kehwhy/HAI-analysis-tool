import { Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material"
import { Box } from "@mui/system"
import axios from "axios"
import React, { useState } from "react"
import { useSelector } from "react-redux"

const ProactiveProtectedList = ({setBiasInfo, setShowBiasInfo, setCurrFeature}) => {

    const BIAS_URL = 'http://127.0.0.1:105/generate/bias'
    
    const protectedFeatures = useSelector((state) => state.model.protectedFeatures)
    const privilegeMap = useSelector((state) => state.model.privilegeMap)
    const modelInfo = useSelector((state) => state.model.modelInfo)
    const mean_difference = privilegeMap['Mean Difference']
    const disparate_impact = privilegeMap['Disparate Impact']

    const [selectedFeature, setSelectedFeature] = useState("sex")

    const getMappedValue = (featureName, value) => {
        if (featureName === 'age_cat') {
            switch (value){
                case 'Less than 25': 
                    return 'age_cat_less_than_25'
                case '25-45': 
                    return 'age_cat_25_to_45'
                case 'Greater than 45':
                    return 'age_cat_greater_than_45'
                default: 
                    return 'age_cat_less_than_25'
            }
        } else {
            return value
        }
    }

    const getReverseMappedValue = (featureName, value) => {
        if (featureName === 'age_cat') {
            switch (value){
                case 'age_cat_less_than_25':
                    return 'Less than 25'
                case 'age_cat_25_to_45': 
                    return '25-45'
                case 'age_cat_greater_than_45':
                    return 'Greater than 45'
                default: 
                    return 'age_cat_less_than_25'
            }
        } else {
            return value
        }
    }

    const onCalculateBiasMetrics = (featureName, privileged, unprivileged) => {

        setCurrFeature(featureName)

        const request = {
            protected: featureName,
            label: modelInfo.label,
            unprivileged: unprivileged,
            privileged: privileged
        }

        console.log(request)

        axios.post(BIAS_URL, request)
            .then((res) => {
                console.log(res)
                setBiasInfo(res.data)
                setShowBiasInfo(true)
                
            })
            .catch((err) => {
                console.log(err)
            });

    }

    return (
        <Box sx={{display:'block', gridColumnStart:2, gridColumnEnd:'span 2', gridRowStart:1,  gridRowEnd:'span 4', margin: 3}}>
            <Typography sx={{display:'block',  marginBottom: 4}} variant='h5'>Protected Features</Typography>
            <Box sx={{marginTop: 4, marginBottom: 2}}>
                <FormControl>
                    <InputLabel margin="dense">Feature</InputLabel>
                    <Select value={selectedFeature} onChange={(e) => setSelectedFeature(e.target.value)} label="Protected Feature">
                        {protectedFeatures.map((feature) => {
                            return (<MenuItem key={feature.name} value={feature.name}>{feature.name.toUpperCase()}</MenuItem>)
                        })}
                    </Select>
                </FormControl>
            </Box>
            <Typography sx={{display:'block', marginTop: 2, marginBottom: 4}} variant='body1'>For each group, a green button identifies a group that is considered privileged when compared and a red button identifies a group that is considered unprivileged when compared to this group.</Typography>
            {protectedFeatures.map((feature) => {
                return (
                    <Box sx={{marginTop:2}} hidden={selectedFeature !== feature.name}>
                        <Typography variant='h5'>{feature.name.toUpperCase()}</Typography>
                        {feature.values.map((value) => {
                            return (
                                <Box>
                                    <Typography variant='subtitle2'>{value}</Typography>
                                    <Box sx={{display:'inline-block'}}>
                                        {mean_difference[feature.name][getMappedValue(feature.name, value)].privileged.map((group) => {
                                            return (
                                                <Box sx={{ display:'inline-block', margin:1}}>
                                                    <Button onClick={(e) => onCalculateBiasMetrics(feature.name, value, getReverseMappedValue(feature.name, group[0]))} color='success' variant='contained'>{getReverseMappedValue(feature.name, group[0])}</Button>
                                                </Box>
                                            )
                                        })}
                                    </Box>
                                    {mean_difference[feature.name][getMappedValue(feature.name, value)].unprivileged.map((group) => {
                                            return (
                                                <Box sx={{display:'inline-block', margin:1}}>
                                                    <Button onClick={(e) => onCalculateBiasMetrics(feature.name, value, getReverseMappedValue(feature.name, group[0]))} color='error' variant='contained'>{getReverseMappedValue(feature.name, group[0])}</Button>
                                                </Box>
                                            )
                                        })}
                                </Box>
                            )
                        })}                    

                    </Box>
                )
            })}
        </Box>
    )
}

export default ProactiveProtectedList