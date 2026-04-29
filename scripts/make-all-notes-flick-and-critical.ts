import "frida-il2cpp-bridge"
import { getAssemblyImage } from "../lib/utils"

Il2Cpp.perform(() => {
    const assemblyImage = getAssemblyImage()

    assemblyImage.class("Sekai.SUS.Converter").method("ConvertNormalNote").implementation = function(id, noteInfo: Il2Cpp.Reference<Il2Cpp.Object>, info, laneStart, laneEnd, category: Il2Cpp.Reference<Il2Cpp.ValueType>)
    {
        noteInfo.value.method("set_Type").invoke(1)
        category.value = assemblyImage.class("Sekai.Live.NoteCategory").field<Il2Cpp.ValueType>("Flick").value
        this.method("ConvertFlickNote").invoke(id, noteInfo, info, laneStart, laneEnd, category)
    }

    assemblyImage.class("Sekai.SUS.Converter").method("ConvertFlickNote").implementation = function(id, noteInfo: Il2Cpp.Reference<Il2Cpp.Object>, info, laneStart, laneEnd, category: Il2Cpp.Reference<Il2Cpp.ValueType>)
    {
        noteInfo.value.method("set_Type").invoke(1)
        this.method("ConvertFlickNote").invoke(id, noteInfo, info, laneStart, laneEnd, category)
    }

    assemblyImage.class("Sekai.SUS.Converter").method("ConvertFrictionNote").implementation = function(id, noteInfo: Il2Cpp.Reference<Il2Cpp.Object>, info, laneStart, laneEnd, category: Il2Cpp.Reference<Il2Cpp.ValueType>)
    {
        noteInfo.value.method("set_Type").invoke(1)
        category.value = assemblyImage.class("Sekai.Live.NoteCategory").field<Il2Cpp.ValueType>("FrictionFlick").value
        this.method("ConvertFrictionFlickNote").invoke(id, noteInfo, info, laneStart, laneEnd, category)
    }

    assemblyImage.class("Sekai.SUS.Converter").method("ConvertFrictionFlickNote").implementation = function(id, noteInfo: Il2Cpp.Reference<Il2Cpp.Object>, info, laneStart, laneEnd, category: Il2Cpp.Reference<Il2Cpp.ValueType>)
    {
        noteInfo.value.method("set_Type").invoke(1)
        this.method("ConvertFrictionFlickNote").invoke(id, noteInfo, info, laneStart, laneEnd, category)
    }

    assemblyImage.class("Sekai.SUS.Converter").method("ConvertLongNote").implementation = function(id, noteInfo: Il2Cpp.Reference<Il2Cpp.Object>, info, laneStart, laneEnd, category: Il2Cpp.Reference<Il2Cpp.ValueType>)
    {
        noteInfo.value.method("set_Type").invoke(1)
        this.method("ConvertLongNote").invoke(id, noteInfo, info, laneStart, laneEnd, category)
    }
})