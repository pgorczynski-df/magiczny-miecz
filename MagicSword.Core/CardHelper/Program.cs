using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using Newtonsoft.Json;

namespace CardHelper
{
    class Program
    {
        static void Main(string[] args)
        {
            var sourceDir = "F:\\Zdarzenia";

            var targetDir = "F:\\ZdarzeniaOut";

            if (Directory.Exists(targetDir))
            {
                Directory.Delete(targetDir);
            }

            var result = new List<object>();

            foreach (var directory in Directory.GetDirectories(sourceDir))
            {
                var dirName = directory.Split(Path.DirectorySeparatorChar).Last();

                var catName = dirName.Split(' ')[1];

                var targetDirName = RemoveDiacritics(dirName.Replace(" ", "-"));

                var td = targetDir + "\\" + targetDirName;
                if (!Directory.Exists(td))
                {
                    Directory.CreateDirectory(td);
                }

                foreach (var file in Directory.GetFiles(directory))
                {
                    //Log(RemoveDiacritics(file));

                    var name = Path.GetFileName(file).Replace(".png", String.Empty);
                    var multiplicity = 1;

                    if (name.Contains("["))
                    {
                        var fsp = name.Split(" [");
                        name = fsp[0];

                        multiplicity = int.Parse(fsp[1].Replace("]", String.Empty));
                    }

                    var targetFileName = RemoveDiacritics(name.Replace(" ", String.Empty)) + ".png";

                    var targetPath = "/" + targetDirName + "/" + targetFileName;

                    result.Add(new
                    {
                        name = name,
                        type = "Zdarzenie",
                        subtype = catName,
                        imageUrl = targetPath,
                        multiplicity = multiplicity,
                    });

                    File.Copy(file, targetDir + targetPath);
                }
            }

            var json = JsonConvert.SerializeObject(result, Formatting.Indented);
            File.WriteAllText("out.json", json, Encoding.UTF8);

            Log(json);
        }

        public static string RemoveDiacritics(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return text;

            text = text.Normalize(NormalizationForm.FormD);
            var chars = text.Where(c => CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark).ToArray();
            return new string(chars).Normalize(NormalizationForm.FormC).Replace("ł", "l");
        }

        private static void Log(object obj)
        {
            Console.WriteLine(obj);
        }
    }
}
