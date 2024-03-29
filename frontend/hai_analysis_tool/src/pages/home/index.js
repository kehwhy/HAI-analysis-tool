import React, { useState } from "react"
import axios, * as others from 'axios';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Modal, TextField } from "@mui/material";
import { Button, CircularProgress } from "@material-ui/core";
import SendIcon from "@mui/icons-material/Send";
import SyncIcon from '@mui/icons-material/Sync';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import BuildIcon from '@mui/icons-material/Build';
import { useDispatch } from "react-redux";
import { setFeatures, setModelInfo, setPrivilegeMap, setProtectedFeatureNames, setProtectedFeatures, setRecidivismScore } from "../../features/model/modelSlice";

const FormData = require('form-data');


const Home = () => {
    
    const UPLOAD_URL = 'http://127.0.0.1:105/generate/model'
    const DEFAULT_VALUES_URL = 'http://127.0.0.1:105/generate/default'
    const PROTECTED_VALUES_URL = 'http://127.0.0.1:105/protected'
    const PROACTIVE_VALUES_URL = 'http://127.0.0.1:105/generate/proactive'

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isModalOpen, setModelOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [ready, setReady] = useState(false)
    const [error, setError] = useState("")
    const [selectedFile, setSelectedFile] = useState(null);
    const [label, setLabel] = useState("");

    const openModal = () => {
        setModelOpen(true)
    }

    const openLearnMore = () => {
        window.open("https://auto.gluon.ai", '_blank', 'noopener,noreferrer');
    }

    const submitForm = () => {
        setLoading(true)

        const formData = new FormData();
        formData.append("label", label);
        formData.append("file", selectedFile);
      
        axios.post(UPLOAD_URL, formData)
          .then((res) => {
            console.log(res)
            setError("")
            setLoading(false)
            dispatch(setModelInfo({...res.data, "label": label}))
            setReady(true)

          })
          .catch((err) => {
            setError("There was a problem uploading the file.")
            console.log(err)
            setLoading(false)
          });
        
    };

    const onInteractiveToolButtonClick = () => {
        axios.post(DEFAULT_VALUES_URL, "")
            .then((res) => {
                console.log(res)
                dispatch(setFeatures(res.data[0]))
                dispatch(setRecidivismScore(res.data[0][label]))
                
            })
            .catch((err) => {
                console.log(err)
            });

        axios.post(PROTECTED_VALUES_URL, "")
        .then((res) => {
            console.log(res)
            dispatch(setProtectedFeatures(res.data))
            //navigate('/tool')
        })
        .catch((err) => {
            console.log(err)
        });

        axios.post(PROACTIVE_VALUES_URL, {"label": label})
        .then((res) => {
            console.log(res)
            dispatch(setPrivilegeMap(res.data))
            navigate('/tool')
        })
        .catch((err) => {
            console.log(err)
        });

        
    }

    const onChangeFileInput = (e) => {
        setSelectedFile(e.target.files[0])
    }

    const onChangeLabelInput = (e) => {
        setLabel(e.target.value)
    }

    return (
        <Box>
            <Modal
            sx = {{ display:'flex' }}
            open={isModalOpen}
            onClose={() => setModelOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
                <Box sx = {{ diplay: 'flex', margin:'auto', maxWidth:0.5, maxHeight:0.5, borderRadius:'5px'}}>
                    { ready ? <Button onClick={onInteractiveToolButtonClick} variant='contained' endIcon={<SendIcon/>}>Go to interactive tool.</Button> : loading ? <CircularProgress></CircularProgress> :
                    <Box sx = {{ backgroundColor:'white', display:'block', margin:'auto', padding:2}} >
                    <Typography sx={{padding:1, paddingLeft:2}} variant="h5">Upload your CSV file</Typography>
                    <form method="POST" action="" encType="multipart/form-data">
                        <Box sx={{padding:1, marginTop:'auto', paddingLeft:2, display: 'block'}}><TextField sx={{padding:0}} type="file" name="file" onChange={(e) => onChangeFileInput(e)}/></Box>
                        <Box sx={{padding:1, marginTop:'auto', paddingLeft:2, display: 'block'}}><TextField sx={{padding:0}} type="text" label="Label Column Header" name="label" onChange={(e) => onChangeLabelInput(e)} /></Box>
                        <Typography sx={{padding:1, marginTop:'auto', paddingLeft:2, display: 'block'}} color="error" variant='subtitle2'>{error}</Typography>
                        <Box sx={{padding:1, marginTop:'auto', paddingLeft:2, display: 'block'}}><Button onClick={() => submitForm()} variant="contained" color="primary" endIcon={<SendIcon />} >Submit</Button></Box>
                    </form>
                    </Box>
                    }
                </Box>
            </Modal>
            <Box 
                sx={{
                    display: 'flex',
                    width:'100%',
                    marginTop: '100px',
                    marginBottom: '50px',
                    flexWrap: 'wrap',
                }}
            >
                <Typography 
                    variant="h3" 
                    sx={{ 
                        display: 'inline-block',
                        margin:'auto',
                        align: 'center',
                        width: '60%',
                        marginBottom: 1,
                        
                    }}
                >
                Upload your dataset and explore different ways to interact with your data.
                </Typography>
            <Typography 
                variant="h5" 
                sx={{ 
                    display: 'inline-block',
                    margin:'auto',
                    align: 'center',
                    width: '60%',
                    marginTop: 1
                }}
            >
            HAII uses AutoGluon to choose the best model for your dataset. After choosing a model, the tool will provide 3 interaction methods that can be used with the data and its' results. These methods can be explored to determine the most effective way to present your model and data to users.
            </Typography>
            </Box>
            <Box
            sx={{ 
                display: 'block',
                margin:'auto',
                align: 'center',
                width: '60%',
                marginTop: 1
            }}
        >
        <Box
            sx = {{display: 'inline-block', padding: 1}}
        >
            <Button
                variant="contained"
                color="primary"
                component="label"
                onClick={() => openModal()}>
            Upload File
            </Button>
        </Box>
        <Box
        sx = {{display: 'inline-block', padding: 1}}
        >
            <Button onClick={() => openLearnMore()}>Learn More</Button>
        </Box>

        <Box
        sx = {{
            paddingTop: 5,
            display: "grid",
            textAlign:'center'
        }}
        >
            <Box
            sx = {{
                padding:1,
                display: "inline",
                gridRow: 1,
            }}
            >
                <Typography variant='h6'>Intermittent</Typography>
                <Box
                sx = {{
                    margin: 1
                }}
                ><SwapVertIcon></SwapVertIcon></Box>
                <Typography variant='p1'> An intermittent interaction model describes when the user initiates the interaction with the AI, and the AI responds to the user's request. </Typography>
            </Box>
            <Box
            sx = {{
                padding:1,
                display: "inline",
                gridRow: 1,
            }}
            >
                <Typography variant='h6'>Continuous</Typography>
                <Box
                sx = {{
                    margin: 1
                }}
                ><SyncIcon></SyncIcon></Box>
                <Typography variant='p1'>A continuous interaction relies on the AI to continuously interact with the user, providing immediate feedback or support as the input data changes.</Typography>
            </Box>
            <Box
            sx = {{
                padding:1,
                display: "inline",
                gridRow: 1,
            }}
            >
                <Typography variant='h6'>Proactive</Typography>
                <Box
                sx = {{
                    margin: 1
                }}
                ><BuildIcon></BuildIcon></Box>
                <Typography variant='p1'>A proactive interaction refers to when an AI proactively interacts with the user by trying to predict and prioritize the information that the user will want.</Typography>
            </Box>
        </Box>
        </Box>
        </Box>
    );
}
export default Home