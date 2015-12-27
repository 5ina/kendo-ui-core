using System;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

namespace Download
{

    public abstract class ServiceBase : IHttpHandler
    {
        const string COMPONENTS_KEY = "c";
        const string VERSION_KEY = "v";
        const string MIN_KEY = "min";
        const double CACHE_DAYS = 0.5;
        readonly Regex CommentRegex = new Regex("/\\*(?:.|[\\n\\r])*?\\*/", RegexOptions.Compiled);

        public bool IsReusable
        {
            get
            {
                return true;
            }
        }

        public void ProcessRequest(HttpContext context)
        {
            var components = (context.Request[COMPONENTS_KEY] ?? "").Split(new char[] { ',' });
            var version = context.Request[VERSION_KEY];
            var minified = context.Request[MIN_KEY] == "1";

            var versionRoot = MapPath("~/App_Data/" + version);
            var jsRoot = Path.Combine(versionRoot, minified ? "js" : "source/js");
            var suffix = (minified ? ".min" : "") + ".js";

            var combinedScript = new StringBuilder();
            var index = 0;
            foreach (var name in components)
            {
                if (!string.IsNullOrWhiteSpace(name))
                {
                    var fullName = Path.Combine(jsRoot, "kendo." + name + suffix);
                    if (Path.GetDirectoryName(fullName) == jsRoot)
                    {
                        var scriptContent = System.IO.File.ReadAllText(fullName);
                        if (index++ > 0)
                        {
                            // Strip license from all files, except the first
                            scriptContent = CommentRegex.Replace(scriptContent, "");
                        }

                        combinedScript.AppendFormat("{0};", scriptContent);
                    }
                }
            }

            ProcessScripts(combinedScript.ToString(), minified, context.Response);
            SetCachePolicy(context.Response);
        }

        protected abstract void ProcessScripts(string combinedScript, bool minified, HttpResponse response);

        protected virtual void SetCachePolicy(HttpResponse response)
        {
            HttpCachePolicy cache = response.Cache;
            cache.SetCacheability(HttpCacheability.Public);
            cache.VaryByParams[COMPONENTS_KEY] = true;
            cache.VaryByParams[VERSION_KEY] = true;
            cache.VaryByParams[MIN_KEY] = true;
            cache.SetOmitVaryStar(true);
            cache.SetExpires(DateTime.Now.AddDays(CACHE_DAYS));
            cache.SetMaxAge(TimeSpan.FromDays(CACHE_DAYS));
            cache.SetValidUntilExpires(true);
        }

        private string MapPath(string path)
        {
            return HttpContext.Current.Server.MapPath(path);
        }
    }
}
