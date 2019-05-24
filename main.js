// this file is used to create desktop application

const { app, BrowserWindow, Menu, shell } = require('electron')
const openAboutWindow = require('about-window').default
const join = require('path').join

let win

const createWindow = () => {
  // create the browser window
  win = new BrowserWindow({ width: 900, height: 600, webPreferences: { nodeIntegration: true } })

  // load the index.html of the app
  win.loadFile('src/index.html')

  // win.webContents.openDevTools()
  // set application menu from template
  const appMenu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(appMenu)

  // emitted when the window is closed
  win.on('closed', () => {
    win = null
  })
}

// menu template
const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        role: 'reload'
      },
      {
        role: 'quit',
        accelerator: 'Ctrl+Q'
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'delete' }
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'View source',
        click () { shell.openExternal('https://github.com/mahdiyari/nfa-dfa-tools') }
      },
      {
        label: 'About',
        click () {
          openAboutWindow({
            icon_path: join(__dirname, 'assets/icons/win/icon.png'),
            product_name: 'NFA & DFA tools',
            description: 'Convert NFA to DFA and minimize DFA',
            bug_report_url: 'https://github.com/mahdiyari/nfa-dfa-tools/issues',
            homepage: 'https://github.com/mahdiyari/nfa-dfa-tools',
            win_options: {
              parent: win,
              modal: true
            },
            show_close_button: 'Close',
            package_json_dir: __dirname
          })
        }
      }
    ]
  }
]

app.on('ready', createWindow)

// Quit when all windows are closed
app.on('window-all-closed', () => app.quit())
