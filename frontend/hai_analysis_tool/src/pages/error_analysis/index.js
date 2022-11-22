import { Box, Button, FormControl, FormControlLabel, InputLabel, MenuItem, Popover, Radio, RadioGroup, Select, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MouseOverPopover from "../../components/popover";

export const IntermittentErrorAnalysis = () => {
    return (
        <Box>
            <Button>INTERMITTENT</Button>
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