function ChromeSystemCPUAPI() {}

ChromeSystemCPUAPI.get_info = chrome.system.cpu.getInfo; // {numOfProcessors, archName, modelName, features, processors}


function ChromeSystemMemoryAPI() {}

ChromeSystemMemoryAPI.get_info = chrome.system.memory.getInfo; // {capacity, availableCapacity}


function ChromeSystemStorageAPI() {}
// Storage unit properties
// id		The transient ID that uniquely identifies the storage device. This ID will be persistent within the same run of a single application.
// name		The name of the storage unit.
// type		The media type of the storage unit.
//   "fixed"		The storage has fixed media, e.g. hard disk or SSD.
//   "removable"	The storage is removable, e.g. USB flash drive.
//   "unknown"		The storage type is unknown.
// capacity	The total amount of the storage space, in bytes.

ChromeSystemStorageAPI.get_info = chrome.system.storage.getInfo; // [Storage units]

// [!] Dev channek only
// ChromeSystemStorageAPI.get_available_capacity = (device_id, callback) => chrome.system.storage.getAvailableCapacity(device_id, callback); // {id, availableCapacity}


function ChromeSystemDisplayAPI() {}
// Display properties
// 1. General
// id					The unique identifier of the display.
// name				The user-friendly name (e.g. "HP LCD monitor").
// isPrimary			True if this is the primary display.
// isInternal			True if this is an internal display.
// isEnabled			True if this display is enabled.
// isUnified			True for all displays when in unified desktop mode. See documentation for enableUnifiedDesktop.
// dpiX				The number of pixels per inch along the x-axis.
// dpiY				The number of pixels per inch along the y-axis.
// bounds				The display's logical bounds.
// workArea			The usable work area of the display within the display bounds. The work area excludes areas of the display reserved for OS, for example taskbar and launcher.
// hasTouchSupport		True if this display has a touch input device associated with it.
// displayZoomFactor	The ratio between the display's current and default zoom. For example, value 1 is equivalent to 100% zoom, and value 1.5 is equivalent to 150% zoom.
//
// 2. ChromeOS specific
// mirroringSourceId			Identifier of the display that is being mirrored if mirroring is enabled, otherwise empty. This will be set for all displays (including the display being mirrored).
// mirroringDestinationIds		Identifiers of the displays to which the source display is being mirrored. Empty if no displays are being mirrored. This will be set to the same value for all displays. This must not include |mirroringSourceId|.
// modes						The list of available display modes. The current mode will have isSelected=true. Will be set to an empty array on other platforms.
// rotation					(Exclusive yet) The display's clockwise rotation in degrees relative to the vertical position. Will be set to 0 on other platforms.
// overscan					(Exclusive yet) The display's insets within its screen's bounds. Currently exposed only on ChromeOS. Will be set to empty insets on other platforms.

ChromeSystemDisplayAPI.get_info = chrome.system.display.getInfo; // [Displays]

