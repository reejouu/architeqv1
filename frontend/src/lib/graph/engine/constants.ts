import { LayoutConfig } from "./types";

export const DEFAULT_CONFIG: LayoutConfig = {
    nodeWidth: 240,         // matches ArchNode width: 240
    nodeHeight: 72,         // matches ArchNode rendered height (~72px with padding)
    layerGap: 80,           // vertical breathing room between layers
    nodeGap: 40,            // horizontal minimum between nodes (accounts for box-shadow)
    canvasPadding: 60,      // outer margin
    maxBarycenterPasses: 4, // diminishing returns after 4
    maxNudgePasses: 10,     // hard limit to prevent infinite loop
};
