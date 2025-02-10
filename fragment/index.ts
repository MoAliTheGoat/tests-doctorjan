import { Fragment, fragmentMeta } from "./FragmentRegister";
import { registerGlobalContext } from "@plasmicapp/host";

// Register the fragment as a global context
registerGlobalContext(Fragment, fragmentMeta);
