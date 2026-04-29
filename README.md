## What I'm currently working on
Script cleanup is complete!

I initially planned to make every script completely independent, but copying and pasting the exact same code everywhere felt inefficient. Instead, I carefully evaluated which parts truly deserved to be functions and moved only the essential ones to lib/utils.ts.

Also, I’ve temporarily removed the feature that allowed tweaking script settings from within the game. Consequently, scripts for starting lives or playing stories now trigger as soon as the script is loaded.

The reason for this change is that the UI-related code was making the scripts unnecessarily complex. I plan to re-implement this once I find a better, cleaner approach.
