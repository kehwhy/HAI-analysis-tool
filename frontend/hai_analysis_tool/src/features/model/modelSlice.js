import { createSlice } from '@reduxjs/toolkit'

export const modelSlice = createSlice({
  name: 'model',
  initialState: {
    features: [],
    protectedFeatures: [],
    recidivismScore: "Low",
    modelInfo: {
      Model: "",
      Evaluation: {
        accuracy: "",
      }
    },
  },
  reducers: {
    setFeatures: (state, action) => {
      const names = Object.keys(action.payload)
      const features = []
      for (var i = 0; i < names.length; i++){
        if (names[i] !== state.modelInfo.label){
          features.push ({
            "name": names[i],
            "defaultValue": action.payload[names[i]]
          })
        }
        state.features = features
      } 
    },
    setRecidivismScore: (state, action) => {
      switch (action.payload) {
        case 0:
          state.recidivismScore = 'Low'
          break
        case 1:
          state.recidivismScore = 'Medium'
          break
        case 2:
          state.recidivismScore = 'High'
          break
        default: 
          state.recidivismScore = ''       
      }
    },
    setProtectedFeatures: (state, action) => {
      const names = Object.keys(action.payload)
      const protectedFeatures = []
      for (var i = 0; i < names.length; i++) {
        protectedFeatures.push({
          "name": names[i],
          "values": Object.keys(action.payload[names[i]])
        })
      }
      state.protectedFeatures = protectedFeatures
    },
    setModelInfo: (state, action) => {
      state.modelInfo = action.payload
    },
    setFeatureValue: (state, action) => {
      for (var i = 0; i < state.features.length;i++) {
        if (state.features[i].name === action.payload.key){
            state.features[i].defaultValue = action.payload.value
        }
    }
    }
  },
})

export const { setFeatures, setRecidivismScore, setProtectedFeatures, setModelInfo, setFeatureValue } = modelSlice.actions

export default modelSlice.reducer