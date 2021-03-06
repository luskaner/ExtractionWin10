﻿using SharpShell.Attributes;
using SharpShell.SharpContextMenu;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Windows.Forms;

namespace ExtractAllExtension
{
    [ComVisible(true)]
    [COMServerAssociation(AssociationType.ClassOfExtension, ".7z", ".zip", ".rar", ".001", ".cab", ".iso", ".xz", ".txz", ".lzma", ".tar", ".cpio", ".bz2", ".bzip2", ".tbz2", ".tbz", ".gz", ".gzip", ".tgz", ".tpz", ".z", ".taz", ".lzh", ".lha", ".rpm", ".deb", ".argj", ".iso", ".wim", ".swm", ".fat", ".ntfs", ".dmg", ".hfs", ".xar", ".squashfs")]
    public class AAExtractAllExtension : SharpContextMenu
    {
        protected override bool CanShowMenu()
        {
            return true;
        }

        protected override ContextMenuStrip CreateMenu()
        {
            //  Create the menu strip.
            var menu = new ContextMenuStrip();

            //  Create a 'count lines' item.
            var itemExtractAll = new ToolStripMenuItem
            {
                Text = "Extraer todo...",
                Image = new Icon(Properties.Resources.Icon, new Size(16, 16)).ToBitmap()
            };

            //  When we click, we'll call the 'CountLines' function.
            itemExtractAll.Click += (sender, args) => ExecuteExtractAll();

            //  Add the item to the context menu.
            menu.Items.Add(itemExtractAll);

            //  Return the menu.
            return menu;
        }

        private void ExecuteExtractAll()
        {
            string firstFilePath = null;
            foreach (var filePath in SelectedItemPaths)
            {
                firstFilePath = filePath;
                break;
            }
            Process.Start(Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), @"..\ExtractionWin10.exe"), '"' + firstFilePath + '"');
        }
    }
}
