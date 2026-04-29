## What I'm currently working on
Script cleanup is complete!

I initially planned to make every script completely independent, but copying and pasting the exact same code everywhere felt inefficient. Instead, I carefully evaluated which parts truly deserved to be functions and moved only the essential ones to lib/utils.ts.

Also, I’ve temporarily removed the feature that allowed tweaking script settings from within the game. The UI-related code was the main reason the scripts became so over-complicated in the first place. I plan to re-implement this once I find a much cleaner way to handle it.
