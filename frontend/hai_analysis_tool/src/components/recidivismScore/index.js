import { Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useSelector } from "react-redux"
import MouseOverPopover from "../popover"


const RecidivismScore = ({showBiasInfo, currFeature, biasInfo}) => {

    const modelInfo = useSelector((state) => state.model.modelInfo)
    const score = useSelector((state) => state.model.recidivismScore)

    const explanations = {
        DisparateImpact: "DisparateImpact explanation!",
        MeanDifference: "MeanDifference explanation!"
    }

    return (
        <Box sx={{display:'block', textAlign:'center', gridRow:1, gridColumn:4, margin: 3}}>
            <Typography variant="h1">{score}</Typography>
            <Typography variant="h3">{modelInfo.label}</Typography>
            <Box hidden={!showBiasInfo} sx={{display:'block', textAlign:'center', margin:3}}>
                <Typography variant='h4'>Bias information</Typography>
                <Typography variant='h6'>{currFeature.toUpperCase()}</Typography>
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

export default RecidivismScore 