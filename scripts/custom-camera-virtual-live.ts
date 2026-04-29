import "frida-il2cpp-bridge"
import { setActiveOfCharPartsForCamera, attachCamToChar, getAssemblyImage } from "../lib/utils"

let currentTargetCharModel: Il2Cpp.Object = null
let rootObj: Il2Cpp.Object = null
let isLockingOn = false
let isThirdPersonEnabled = false

Il2Cpp.perform(() => {
    const assemblyImage = getAssemblyImage()

    assemblyImage.class("Sekai.Core.VirtualLive.VirtualLiveCameraManager").method("LateUpdate").implementation = function()
    {
        if(!isLockingOn)
        {
            this.method("LateUpdate").invoke()
        }
    }

    assemblyImage.class("Sekai.SuperVirtualLive.SuperVirtualLiveController").method(".ctor").implementation = function()
    {
        this.method(".ctor").invoke()

        currentTargetCharModel = null
        rootObj = null
        isLockingOn = false
    }

    assemblyImage.class("Sekai.Core.VirtualLive.LockOnModule").method("SetupNewTarget").implementation = function(desc: Il2Cpp.ValueType)
    {
        this.method("SetupNewTarget").invoke(desc)

        isLockingOn = true

        const camera = this.field<Il2Cpp.Object>("camera").value
        if(currentTargetCharModel !== null && !currentTargetCharModel.isNull())
        {
            setActiveOfCharPartsForCamera(currentTargetCharModel, true)
        }
        if(rootObj === null)
        {
            rootObj = camera.method<Il2Cpp.Object>("get_transform").invoke().method<Il2Cpp.Object>("get_parent").invoke()
        }

        currentTargetCharModel = desc.field<Il2Cpp.Object>("characterModel").value
        setActiveOfCharPartsForCamera(currentTargetCharModel, false)
        attachCamToChar(camera, currentTargetCharModel, isThirdPersonEnabled)
    }

    assemblyImage.class("Sekai.Core.VirtualLive.LockOnModule").method("ClearTargetImpl").implementation = function(type: Il2Cpp.ValueType)
    {
        this.method("ClearTargetImpl").invoke(type)

        this.field<Il2Cpp.Object>("camera").value.method<Il2Cpp.Object>("get_transform").invoke().method("SetParent", 2).invoke(rootObj, false)
        if(currentTargetCharModel !== null && !currentTargetCharModel.isNull())
        {
            setActiveOfCharPartsForCamera(currentTargetCharModel, true)
        }
        isLockingOn = false
        currentTargetCharModel = null
    }
})