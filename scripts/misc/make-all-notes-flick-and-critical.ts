import "frida-il2cpp-bridge"
import { GetAssemblyCSharpImage } from "../lib/exports/get/assembly"
import { SetProperty, GetField } from "../lib/utils/unity/get-set"
import { ChangeImpl_AutoRetire } from "./auto-retire"

Il2Cpp.perform(() => {
    ChangeImpl_AutoRetire()

    const AssemblyCSharpImage = GetAssemblyCSharpImage()

    AssemblyCSharpImage.class("Sekai.SUS.Converter").method("ConvertNormalNote").implementation = function(id, noteInfo: Il2Cpp.Reference<Il2Cpp.Object>, info, laneStart, laneEnd, category: Il2Cpp.Reference)
    {
        SetProperty(noteInfo.value, "Type", 1)
        category.value = GetField(AssemblyCSharpImage.class("Sekai.Live.NoteCategory"), "Flick")
        this.method("ConvertFlickNote").invoke(id, noteInfo, info, laneStart, laneEnd, category)
    }

    AssemblyCSharpImage.class("Sekai.SUS.Converter").method("ConvertFlickNote").implementation = function(id, noteInfo: Il2Cpp.Reference<Il2Cpp.Object>, info, laneStart, laneEnd, category: Il2Cpp.Reference)
    {
        SetProperty(noteInfo.value, "Type", 1)
        this.method("ConvertFlickNote").invoke(id, noteInfo, info, laneStart, laneEnd, category)
    }

    AssemblyCSharpImage.class("Sekai.SUS.Converter").method("ConvertFrictionNote").implementation = function(id, noteInfo: Il2Cpp.Reference<Il2Cpp.Object>, info, laneStart, laneEnd, category: Il2Cpp.Reference)
    {
        SetProperty(noteInfo.value, "Type", 1)
        category.value = GetField(AssemblyCSharpImage.class("Sekai.Live.NoteCategory"), "FrictionFlick")
        this.method("ConvertFrictionFlickNote").invoke(id, noteInfo, info, laneStart, laneEnd, category)
    }

    AssemblyCSharpImage.class("Sekai.SUS.Converter").method("ConvertFrictionFlickNote").implementation = function(id, noteInfo: Il2Cpp.Reference<Il2Cpp.Object>, info, laneStart, laneEnd, category: Il2Cpp.Reference)
    {
        SetProperty(noteInfo.value, "Type", 1)
        this.method("ConvertFrictionFlickNote").invoke(id, noteInfo, info, laneStart, laneEnd, category)
    }

    AssemblyCSharpImage.class("Sekai.SUS.Converter").method("ConvertLongNote").implementation = function(id, noteInfo: Il2Cpp.Reference<Il2Cpp.Object>, info, laneStart, laneEnd, category: Il2Cpp.Reference)
    {
        SetProperty(noteInfo.value, "Type", 1)
        this.method("ConvertLongNote").invoke(id, noteInfo, info, laneStart, laneEnd, category)
    }
})