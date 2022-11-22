import { Slider, Typography } from "@mui/material"
import { Box } from "@mui/system"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { setFeatureValue, setRecidivismScore } from "../../features/model/modelSlice"


const ProtectedSliderList = () => {

    const dispatch = useDispatch()

    const CALCULATE_URL = 'http://127.0.0.1:105/generate/calculate_score'
    
    const protectedFeatures = useSelector((state) => state.model.protectedFeatures)
    const features = useSelector((state) => state.model.features)

    const onChangeSlider = (feature, value) => {
        dispatch(setFeatureValue({"key":feature.name, "value":feature.values[value]}))
    }

    const onChangeCommitted = () => {
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
        })
    }
    
    return (
        <Box sx={{display:'block', gridColumnStart:2, gridColumnEnd:'span 3', gridRowStart:2,  gridRowEnd:'span 4', margin: 3}}>
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
                            <Box sx={{marginLeft:2}}>
                            <Slider
                                onChange={(e) => onChangeSlider(feature, e.target.value)}
                                onChangeCommitted={onChangeCommitted()}
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