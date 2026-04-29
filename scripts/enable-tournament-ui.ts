import "frida-il2cpp-bridge"
import { getAssemblyImage } from "../lib/utils"

Il2Cpp.perform(() => {
    const assemblyImage = getAssemblyImage()

    assemblyImage.class("Sekai.Live.LiveFrontView").method("RhythmGameStart").implementation = function()
    {
        this.method("RhythmGameStart").invoke()

        const dict = this.field<Il2Cpp.Object>("spriteRendererAlphaDict").value
        const enumerator = dict.method<Il2Cpp.ValueType>("GetEnumerator").invoke()

        const removeKeyArray: Il2Cpp.Object[] = []
        while(enumerator.method<boolean>("MoveNext").invoke())
        {
            const current = enumerator.method<Il2Cpp.ValueType>("get_Current").invoke()
            const key = current.method<Il2Cpp.Object>("get_Key").invoke()
            const name = key.method<Il2Cpp.String>("get_name").invoke().toString()
            
            if(!name.toLowerCase().includes("lane") && !name.toLowerCase().includes("combo") && name !== '"result"' && name !== '"timing"')
            {
                removeKeyArray.push(key)
            }
        }

        removeKeyArray.forEach((key: Il2Cpp.Object) => {
            dict.method<boolean>("Remove").invoke(key)
        })

        const comboRenderers = this.field<Il2Cpp.Object>("comboView").value.method<Il2Cpp.Array<Il2Cpp.Object>>("get_NumberSpriteRenderers").invoke()
        for(let i = 0; i < comboRenderers.length; i++)
        {
            dict.method("Add").invoke(comboRenderers.get(i), 1)
        }
    }

    assemblyImage.class("Sekai.Live.ScreenEffectView").method("Excute").implementation = () => {}
    assemblyImage.class("Sekai.Live.LiveFrontView").method("UpdateScore").implementation = () => {}
    assemblyImage.class("Sekai.Core.Live.ScoreLogic").method("Damage").implementation = () => {}
    assemblyImage.class("Sekai.Core.Live.SoloLiveController").method("OnPause").implementation = () => {}
})