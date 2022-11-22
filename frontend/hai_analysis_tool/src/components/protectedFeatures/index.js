import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material"
import axios from "axios"
import { useState } from "react"
import { useSelector } from "react-redux"


const ProtectedFeatures = ({setBiasInfo, setShowBiasInfo}) => {

    const BIAS_URL = 'http://127.0.0.1:105/generate/bias'

    const protectedFeatures = useSelector((state) => state.model.protectedFeatures)
    const modelInfo = useSelector((state) => state.model.modelInfo)

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

    return (
        <Box sx={{display:'block', gridColumn:2, gridRowEnd:'span 4', margin: 3}}>
        <Typography sx={{display:'block',  marginBottom: 4}} variant='h5'>Protected Features</Typography>
        {protectedFeatures.map((feature) => {
            return (
            <Box key={feature.name} sx={{marginBottom: 2}}>
                <Box sx={{marginBottom: 2, marginTop: 2}}>
                    <Typography variant='subtitle1' >{feature.name.toUpperCase()}</Typography>
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
    )
}

export default ProtectedFeatures