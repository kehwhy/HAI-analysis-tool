import { FormControl, InputLabel, MenuItem, Select, Slider, Typography } from "@mui/material"
import { Box } from "@mui/system"
import axios from "axios"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setFeatureValue, setRecidivismScore } from "../../features/model/modelSlice"


const ProtectedSliderList = ({setBiasInfo, setShowBiasInfo, setCurrFeature}) => {

    const dispatch = useDispatch()

    const CALCULATE_URL = 'http://127.0.0.1:105/generate/calculate_score'
    const BIAS_URL = 'http://127.0.0.1:105/generate/bias'
    
    const protectedFeatures = useSelector((state) => state.model.protectedFeatures)
    const features = useSelector((state) => state.model.features)
    const modelInfo = useSelector((state) => state.model.modelInfo)


    const [ privelegeMap, setPrivelegeMap] = useState({
        "sex": {
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

    const onChangeSlider = (feature, value) => {
        dispatch(setFeatureValue({"key":feature.name, "value":value}))
        setCurrFeature(feature.name)
        
        const temp1 = {...privelegeMap}
        temp1[feature.name]['unprivileged'] = value
        setPrivelegeMap({...temp1})
    }

    const onChangeCommitted = (featureName) => {
        
        const featurejson = {}
        for (var i = 0; i < features.length; i++){
            featurejson[features[i].name] = {
                'r1': features[i].defaultValue
            }
        }

        const request = {
            protected: featureName,
            label: modelInfo.label,
            unprivileged: privelegeMap[featureName]["unprivileged"],
            privileged: privelegeMap[featureName]["privileged"] 
        }

        axios.post(CALCULATE_URL, featurejson)
            .then((res) => {
                console.log(res)
                dispatch(setRecidivismScore(res.data[0]))
            })
            .catch((err) => {
                console.log(err)
            })

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

    const onSelectChange = (feature, value) => {
        dispatch(setFeatureValue({"key":feature, "value":value}))
        const temp1 = {...privelegeMap}
        temp1[feature]['privileged'] = value
        setPrivelegeMap({...temp1})
    }
    
    return (
        <Box sx={{display:'block', gridColumnStart:2, gridColumnEnd:'span 2', gridRowStart:1,  gridRowEnd:'span 4', margin: 3}}>
            <Typography sx={{display:'block',  marginBottom: 4}} variant='h5'>Protected Features</Typography>
                {protectedFeatures.map((feature) => {
                    const marks = []
                    for (var i = 0; i < feature.values.length; i++){
                            marks.push({
                                "value": i,
                                "label": feature.values[i]
                            })
                    }
                    return (
                        <Box sx={{marginTop:2}}>
                            <Typography variant='subtitle1'>{feature.name.toUpperCase()}</Typography>
                            <Box sx={{marginTop:3}}>
                            <FormControl>
                                <InputLabel margin="dense">Privileged Group</InputLabel>
                                <Select value={privelegeMap[feature.name]['privileged']} onChange={(e) => onSelectChange(feature.name, e.target.value)} label="Privileged Group">
                                    {feature.values.map((value) => {
                                        return (<MenuItem key={value} value={value}>{value}</MenuItem>)
                                    })}
                                </Select>
                            </FormControl>
                            </Box>
                            <Box sx={{marginLeft:2}}>
                            <Slider
                                onChange={(e) => onChangeSlider(feature, feature.values[e.target.value])}
                                onChangeCommitted={(e) => onChangeCommitted(feature.name)}
                                defaultValue={0}
                                step={1}
                                valueLabelDisplay="off"
                                min={0}
                                max={feature.values.length-1}
                                marks={marks}
                            />
                            </Box>
                        </Box>
                    )
                })}
        </Box>
    )
}

export default ProtectedSliderList