import { createSlice } from '@reduxjs/toolkit'

export const modelSlice = createSlice({
  name: 'model',
  initialState: {
    features: ["Feature1", "Feature2", "Feature3"],
    protectedFeatures: ["ProtectedFeature1", "ProtectedFeature2", "ProtectedFeature3"],
    modelInfo: {},
  },
  reducers: {
    setFeatures: (state, action) => {
      state.features = action.payload
    },
    setProtectedFeatures: (state, action) => {
      state.protectedFeatures = action.payload
    },
    setModelInfo: (state, action) => {
      state.modelInfo = action.payload
    },
  },
})

export const { setFeatures, setModelInfo } = modelSlice.actions

export default modelSlice.reducer