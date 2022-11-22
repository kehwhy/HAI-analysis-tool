import { Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useSelector } from "react-redux"


const RecidivismScore = () => {

    const modelInfo = useSelector((state) => state.model.modelInfo)
    const score = useSelector((state) => state.model.recidivismScore)

    return (
        <Box sx={{display:'block', textAlign:'center', gridRow:1, gridColumn:3, margin: 3}}>
            <Typography variant="h1">{score}</Typography>
            <Typography variant="h3">{modelInfo.label}</Typography>
        </Box>
    )
}

export default RecidivismScore 