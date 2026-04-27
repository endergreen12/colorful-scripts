// Sekai.DisplayLayerType
export const DisplayLayerType = {
    Layer_BG: 0,
    Layer_UI: 1,
    Layer_Header: 2,
    Layer_Scenario: 3,
    Layer_Dialog: 4,
    Layer_Loading: 5,
    Layer_ScreenEffect: 6,
    Layer_Overlay: 7
} as const

// Sekai.DialogSize
export const DialogSize = {
    Small: 0,
    Medium: 1,
    Large: 2,
    Manual: 3
} as const

// Sekai.DialogType
export const DialogType = {
    Common1ButtonDialog: 0,
    Common1ButtonMediumDialog: 1,
    Common2ButtonDialog: 2,
    Common2ButtonMediumDialog: 3,
    SubWindowDialog: 240
} as const