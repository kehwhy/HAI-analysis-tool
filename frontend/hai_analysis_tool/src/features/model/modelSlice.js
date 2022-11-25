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
    privilegeMap: {
      'Mean Difference': {
        'sex': {
          'Male': {
            'privileged': [],
            'unprivileged': [],
          }, 
          'Female': {
            'privileged': [],
            'unprivileged': [],
          }
        },
        'age_cat': {
          'age_cat_less_than_25': {
            'privileged': [],
            'unprivileged': [],
          }, 
          'age_cat_25_to_45': {
            'privileged': [],
            'unprivileged': [],
          },
          'age_cat_greater_than_45': {
            'privileged': [],
            'unprivileged': [],
          },
        },
        'race': {
          'African-American': {
            'privileged': [],
            'unprivileged': [],
          }, 
          'Asian': {
            'privileged': [],
            'unprivileged': [],
          },
          'Caucasion': {
            'privileged': [],
            'unprivileged': [],
          },
          'Hispanic': {
            'privileged': [],
            'unprivileged': [],
          }, 
          'Native American': {
            'privileged': [],
            'unprivileged': [],
          },
          'Other': {
            'privileged': [],
            'unprivileged': [],
          }
        }
      },
      'Disparate Impact': {
        'sex': {
          'Male': {
            'privileged': [],
            'unprivileged': [],
          }, 
          'Female': {
            'privileged': [],
            'unprivileged': [],
          }
        },
        'age_cat': {
          'age_cat_less_than_25': {
            'privileged': [],
            'unprivileged': [],
          }, 
          'age_cat_25_to_45': {
            'privileged': [],
            'unprivileged': [],
          },
          'age_cat_greater_than_45': {
            'privileged': [],
            'unprivileged': [],
          },
        },
        'race': {
          'African-American': {
            'privileged': [],
            'unprivileged': [],
          }, 
          'Asian': {
            'privileged': [],
            'unprivileged': [],
          },
          'Caucasion': {
            'privileged': [],
            'unprivileged': [],
          },
          'Hispanic': {
            'privileged': [],
            'unprivileged': [],
          }, 
          'Native American': {
            'privileged': [],
            'unprivileged': [],
          },
          'Other': {
            'privileged': [],
            'unprivileged': [],
          }
        }
      }
    }
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
    }, 
    setPrivilegeMap: (state, action) => {
      var categories = action.payload['Mean Difference']
      var cat_keys = Object.keys(categories)
      for (var i = 0; i < cat_keys.length; i++) {
        var items = (categories[cat_keys[i]])
        var item_keys = Object.keys(items)
        for (var j = 0; j < item_keys.length; j++) {
          if (item_keys[j] < 0) {
           state.privilegeMap['Mean Difference'][cat_keys[i]][categories[cat_keys[i]][item_keys[j]]['unprivileged']].privileged.push([categories[cat_keys[i]][item_keys[j]]['privileged']])
          } else {
            state.privilegeMap['Mean Difference'][cat_keys[i]][categories[cat_keys[i]][item_keys[j]]['unprivileged']].unprivileged.push([categories[cat_keys[i]][item_keys[j]]['privileged']])
          }
        }
      }

      categories = action.payload['Disparate Impact']
      cat_keys = Object.keys(categories)
      for (i = 0; i < cat_keys.length; i++) {
        items = (categories[cat_keys[i]])
        item_keys = Object.keys(items)
        for (j = 0; j < item_keys.length; j++) {
          if (item_keys[j] < 1) {
            state.privilegeMap['Disparate Impact'][cat_keys[i]][categories[cat_keys[i]][item_keys[j]]['privileged']].unprivileged.push([categories[cat_keys[i]][item_keys[j]]['unprivileged']])
          } else {
            state.privilegeMap['Disparate Impact'][cat_keys[i]][categories[cat_keys[i]][item_keys[j]]['privileged']].privileged.push([categories[cat_keys[i]][item_keys[j]]['unprivileged']])
          }
        }
      }
    }
  },
})

export const { setFeatures, setRecidivismScore, setProtectedFeatures, setModelInfo, setFeatureValue, setPrivilegeMap } = modelSlice.actions

export default modelSlice.reducer