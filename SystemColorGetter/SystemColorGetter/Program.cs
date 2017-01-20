using System;

namespace SystemColorGetter
{
    class Program
    {
        static void Main(string[] args)
        {
            var c = AccentColorSet.ActiveSet["SystemAccent"];
            Console.Write(String.Format("{0},{1},{2},{3}", c.R, c.G, c.B, Math.Round(c.A / 255.0, 3)));
        }
    }
}
