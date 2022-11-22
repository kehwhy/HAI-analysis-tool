import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MouseOverPopover from "../../components/popover";
import { setFeatureValue, setRecidivismScore } from "../../features/model/modelSlice";

export const IntermittentSocialBias = () => {
    const BIAS_URL = 'http://127.0.0.1:105/generate/bias'
    const CALCULATE_URL = 'http://127.0.0.1:105/generate/calculate_score'

    const dispatch = useDispatch()

    var features = useSelector((state) => state.model.features)
    const protectedFeatures = useSelector((state) => state.model.protectedFeatures)
    const modelInfo = useSelector((state) => state.model.modelInfo)
    const score = useSelector((state) => state.model.recidivismScore)
    const [biasInfo, setBiasInfo] = useState({})
    const [showBiasInfo, setShowBiasInfo] = useState(false)
    const [ privelegeMap, setPrivelegeMap] = useState({
        sex: {
            "privileged": 'Female',
            "unprivileged": 'Male'
        },
        "age_cat": {
            "privileged": "Less than 25",
            "unprivileged": "Greater than 45"
        },
        "race": {
            "privileged": "Caucasion",
            "unprivileged": "African-American"
        }
    })

    const explanations = {
        DisparateImpact: "DisparateImpact explanation!",
        MeanDifference: "MeanDifference explanation!"
    }

    const onCalculateBiasMetrics = (featureName) => {

        const request = {
            protected: featureName,
            label: modelInfo.label,
            unprivileged: privelegeMap[featureName]["unprivileged"],
            privileged: privelegeMap[featureName]["privileged"] 
        }

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

    const onSelectChange = (feature, privilege, value) => {
        const temp1 = {}
        const temp2 = {}
        temp1[privilege] = value
        temp2[feature] = {...privelegeMap[feature], ...temp1}
        setPrivelegeMap({...privelegeMap, ...temp2})
    }

    const onTextChange = (key, value) => {
        dispatch(setFeatureValue({"key":key, "value":value}))
    }

    const onClickCalculateScore = () => {

        const featurejson = {}
        for (var i = 0; i < features.length; i++){
            featurejson[features[i].name] = {
                'r1': features[i].defaultValue
            }
        }

        axios.post(CALCULATE_URL, featurejson)
        .then((res) => {
            console.log(res)
            dispatch(setRecidivismScore(res.data[0]))
        })
        .catch((err) => {
            console.log(err)
        });
    }

    return (
        <Box sx={{display:'grid', gridTemplateRows: '1fr 1fr 1fr 1fr', gridTemplateColumns: '1fr 1fr 1fr 1fr'}}>
            <Box sx={{display:'block', gridColumn:1, gridRowEnd:'span 4', margin: 3}}>
            <Typography sx={{display:'block',  marginBottom: 4}} variant='h5'>All Features</Typography>
                {features.map((feature) => {
                    return <TextField sx={{display:'block', margin:'auto', marginBottom: 4}} key={feature.name} type='text' onChange={(e) => onTextChange(feature.name, e.target.value)} value={feature.defaultValue} label={feature.name}></TextField>
                })}
                <Button onClick={onClickCalculateScore} variant='contained' sx={{display:'block'}}>Calculate Score</Button>
            </Box>
            <Box sx={{display:'block', gridColumn:2, gridRowEnd:'span 4', margin: 3}}>
                <Typography sx={{display:'block',  marginBottom: 4}} variant='h5'>Protected Features</Typography>
                {protectedFeatures.map((feature) => {
                    return (
                    <Box key={feature.name} sx={{marginBottom: 2}}>
                        <Box sx={{marginBottom: 2, marginTop: 2}}>
                            <Typography variant='subtitle1' >{feature.name}</Typography>
                        </Box>
                        <Box sx={{display:'block', margin:2}}>
                            <FormControl>
                                <InputLabel margin="dense">Privileged Group</InputLabel>
                                <Select value={privelegeMap[feature.name]['privileged']} onChange={(e) => onSelectChange(feature.name, 'privileged', e.target.value)} label="Privileged Group">
                                    {feature.values.map((value) => {
                                        return (<MenuItem key={value} value={value}>{value}</MenuItem>)
                                    })}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{display:'block', margin:2}}>
                            <FormControl>
                                <InputLabel margin="dense">Unprivileged Group</InputLabel>
                                <Select value={privelegeMap[feature.name]['unprivileged']} onChange={(e) => onSelectChange(feature.name, 'unprivileged', e.target.value)}>
                                    {feature.values.map((value) => {
                                        return (<MenuItem key={value} value={value}>{value}</MenuItem>)
                                    })}
                                </Select>
                            </FormControl>
                        </Box>
                        <Button sx={{marginTop:1, marginBottom:1}} onClick={() => onCalculateBiasMetrics(feature.name)} variant='contained'>CALCULATE BIAS METRICS</Button>
                    </Box>
                    )
                })}
            </Box>
            <Box sx={{display:'block', textAlign:'center', gridRow:1, gridColumn:3, margin: 3}}>
                <Typography variant="h1">{score}</Typography>
                <Typography variant="h3">{modelInfo.label}</Typography>
            </Box>
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
        <Box>
            <Button>CONTINUOUS</Button>
        </Box>
    )
}

export const ProactiveSocialBias = () => {
    return (
        <Box>
            <Button>PROACTIVE</Button>
        </Box>
    )
}