import React, { useState } from "react"
import axios, * as others from 'axios';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Modal, TextField } from "@mui/material";
import { Button, CircularProgress } from "@material-ui/core";
import SendIcon from "@mui/icons-material/Send";
import SyncIcon from '@mui/icons-material/Sync';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import BuildIcon from '@mui/icons-material/Build';

const FormData = require('form-data');


const Home = () => {
    
    const UPLOAD_URL = ""
    const navigate = useNavigate();

    const [isModalOpen, setModelOpen] = useState(false)
    const [loading, setLoading] = useState(false)
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
        //setTimeout(() => setLoading(false), 5000);

        const formData = new FormData();
        formData.append("label", label);
        formData.append("file", selectedFile);
      
        axios.post(UPLOAD_URL, formData)
          .then((res) => {
            setError("")
            navigate('/tool')
          })
          .catch((err) => {
            setError("There was a problem uploading the file.")
            navigate('/tool')
          });
        setLoading(false)
    };

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
                    { loading ? <CircularProgress></CircularProgress> :
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
                    marginTop: '125px',
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
                <Typography variant='p1'>Reveal an explanation for the prediction on command if your users require more information.</Typography>
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
                <Typography variant='p1'>Reveal an explanation for the prediction on command if your users require more information.</Typography>
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
                <Typography variant='p1'>Reveal an explanation for the prediction on command if your users require more information.</Typography>
            </Box>
        </Box>
        </Box>
        </Box>
    );
}
export default Home