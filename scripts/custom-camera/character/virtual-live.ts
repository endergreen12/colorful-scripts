import "frida-il2cpp-bridge"
import { GetAssemblyCSharpImage } from "../../lib/exports/get/assembly"
import { AttachCameraToCharacterModel, SetActiveOfCharModelPartsForFirstPerson } from "../lib/process"
import { GetField } from "../../lib/utils/unity/get-set"
import { GetTransform, SetParent } from "../../lib/utils/unity/transform"
import { CameraType, ChangeImpl_CreateOpenOptionDialogButton } from "../lib/options/dialog"

let storedTargetDesc: Il2Cpp.Object = null
Il2Cpp.perform(() => {
    ChangeImpl_CreateOpenOptionDialogButton(CameraType.CharacterCamera, true)
    
    const AssemblyCSharpImage = GetAssemblyCSharpImage()

    let isLockingOn = false
    AssemblyCSharpImage.class("Sekai.Core.VirtualLive.VirtualLiveCameraManager").method("LateUpdate").implementation = function()
    {
        if(!isLockingOn)
        {
            this.method("LateUpdate").invoke()
        }
    }

    AssemblyCSharpImage.class("Sekai.SuperVirtualLive.SuperVirtualLiveController").method(".ctor").implementation = function()
    {
        this.method(".ctor").invoke()

        storedTargetDesc = null
        isLockingOn = false
    }

    AssemblyCSharpImage.class("Sekai.Core.VirtualLive.LockOnModule").method("SetupNewTarget").implementation = function(desc: Il2Cpp.Object)
    {
        this.method("SetupNewTarget").invoke(desc)

        isLockingOn = true
        RestoreCharacterModelParts()
        storedTargetDesc = desc
        AttachCameraToCharacterModel(GetField(this, "camera"), GetField(desc, "characterModel"))
    }

    AssemblyCSharpImage.class("Sekai.Core.VirtualLive.LockOnModule").method("ClearTargetImpl").implementation = function(type: Il2Cpp.Object)
    {
        this.method("ClearTargetImpl").invoke(type)

        RestoreCharacterModelParts()
        SetParent(GetTransform(GetField(this, "camera")), NULL, false)
        isLockingOn = false
        storedTargetDesc = null
    }
})

function RestoreCharacterModelParts()
{
    if(storedTargetDesc !== null && !storedTargetDesc.isNull())
    {
        const characterModel = GetField(storedTargetDesc, "characterModel")
        if(!characterModel.isNull() && characterModel.class === GetAssemblyCSharpImage().class("Sekai.Core.CharacterModel"))
        {
            SetActiveOfCharModelPartsForFirstPerson(characterModel, true)
        }
    }
}