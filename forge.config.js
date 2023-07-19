module.exports = {
  packagerConfig: {
    asar: true,
    icon:"icons/Avatar"
  },
  rebuildConfig: {},
  makers: [
    {
      // Path to the icon to use for the app in the DMG window
      name: '@electron-forge/maker-dmg',
      config: {
        icon: 'icons/Avatar.icns'
      }
    },
    {
      // Path to a single image that will act as icon for the application
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: 'icons/Avatar.png'
        }
      }
    },
    {
      name: '@electron-forge/maker-wix',
      config: {
        icon: 'icons/Avatar.ico'
      }
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};
