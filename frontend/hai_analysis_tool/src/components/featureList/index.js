import { Button, TextField, Typography } from "@mui/material"
import { Box } from "@mui/system"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { setFeatureValue, setRecidivismScore } from "../../features/model/modelSlice"


const FeatureList = () => {

    const CALCULATE_URL = 'http://127.0.0.1:105/generate/calculate_score'

    const dispatch = useDispatch()

    var features = useSelector((state) => state.model.features)

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
        <Box sx={{display:'block', gridColumn:1, gridRowEnd:'span 4', margin: 3}}>
        <Typography sx={{display:'block',  marginBottom: 4}} variant='h5'>All Features</Typography>
            {features.map((feature) => {
                return <TextField sx={{display:'block', margin:'auto', marginBottom: 4}} key={feature.name} type='text' onChange={(e) => onTextChange(feature.name, e.target.value)} value={feature.defaultValue} label={feature.name.toUpperCase()}></TextField>
            })}
            <Button onClick={onClickCalculateScore} variant='contained' sx={{display:'block'}}>Calculate Score</Button>
        </Box>
    )
}

export default FeatureList