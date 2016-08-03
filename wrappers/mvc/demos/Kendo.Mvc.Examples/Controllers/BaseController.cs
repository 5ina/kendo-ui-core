﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Kendo.Mvc.Examples.Models;
using IOFile = System.IO.File;
using System.Text.RegularExpressions;

namespace Kendo.Mvc.Examples.Controllers
{
    public abstract class BaseController : Controller
    {
        private static readonly JavaScriptSerializer Serializer = new JavaScriptSerializer();

        //protected static readonly IDictionary<String, String> MimeTypes =
        //    new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) {
        //        { ".js", "application/x-javascript" },
        //        { ".json", "application/json" },
        //        { ".css", "text/css" },
        //        { ".map", "application/json" },
        //        { ".less", "text/css" },
        //        { ".jpg", "image/jpg" },
        //        { ".gif", "image/gif" },
        //        { ".png", "image/png" },
        //        { ".svg", "image/svg+xml" },
        //        { ".eot", "application/vnd.ms-fontobject" },
        //        { ".ttf", "application/octet-stream" },
        //        { ".woff", "application/octet-stream" }
        //    };

        //protected static readonly IDictionary<String, String> AssetRoots =
        //    new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) {
        //        { "js", "src" },
        //        { "styles", Path.Combine("dist", "styles") }
        //    };

        //public ActionResult StaticContent(string path)
        //{
        //    var mimeType = MimeTypes[Path.GetExtension(path)];

        //    if (mimeType == null)
        //    {
        //        throw new HttpException(403, "Forbidden");
        //    }

        //    if (!IOFile.Exists(path))
        //    {
        //        throw new HttpException(404, "File Not Found");
        //    }

        //    return File(IOFile.ReadAllBytes(path), mimeType);
        //}

        public String CurrentProduct()
        {
            return "aspnet-mvc";
        }

        //public String CurrentProductName()
        //{
        //    string product = CurrentProduct();
        //    string productName = "Kendo UI";

        //    if (product == "aspnet-mvc") {
        //        productName = "UI for ASP.NET MVC";
        //    } else if (product == "php-ui") {
        //        productName = "UI for PHP";
        //    } else if (product == "jsp-ui") {
        //        productName = "UI for JSP";
        //    }

        //    return productName;
        //}

        public string CurrentNavProduct()
        {
            return "mvc";
        }

        protected void LoadNavigation()
        {
            ViewBag.Navigation = LoadWidgets();
        }

        protected IEnumerable<NavigationWidget> LoadWidgets()
        {
            return Serializer.Deserialize<NavigationWidget[]>(IOFile.ReadAllText(Server.MapPath("~/content/nav.json")));
        }

        protected void LoadCategories()
        {
            ViewBag.Categories = LoadWidgets().GroupBy(w => w.Category).ToList();
        }

        //protected bool IsMobileDevice()
        //{
        //    return Regex.IsMatch(Request.UserAgent, "(blackberry|bb1\\w?;|playbook|meego;\\s*nokia|android|silk|iphone|ipad|ipod|windows phone|Mobile.*Firefox)", RegexOptions.IgnoreCase);
        //}

        protected void SetTheme()
        {
            var theme = "material";
            var themeParam = HttpContext.Request.QueryString["theme"];
            var themeCookie = HttpContext.Request.Cookies["theme"];

            if (themeParam != null && Regex.IsMatch(themeParam, "[a-z0-9\\-]+", RegexOptions.IgnoreCase))
            {
                theme = themeParam;

                // update cookie
                HttpCookie cookie = new HttpCookie("theme");
                cookie.Value = theme;
                this.ControllerContext.HttpContext.Response.Cookies.Add(cookie);
            }
            else if (themeCookie != null)
            {
                theme = themeCookie.Value;
            }

            var CommonFileCookie = HttpContext.Request.Cookies["commonFile"];

            ViewBag.Theme = theme;
            ViewBag.CommonFile = CommonFileCookie == null ? "common-material" : CommonFileCookie.Value;
        }

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            base.OnActionExecuting(filterContext);

#if DEBUG
            ViewBag.Debug = true;
#else
            ViewBag.Debug = false;
#endif
        }
    }
}
