import { configureStore } from '@reduxjs/toolkit'
import modelSlice from './features/model/modelSlice'

export default configureStore({
  reducer: {
    model: modelSlice
  },
})