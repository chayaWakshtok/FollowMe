using QualiAPI.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using RestSharp;
using QualiAPI.Properties;
using Newtonsoft.Json;
using System.Net.Mail;
using Newtonsoft.Json.Linq;

namespace QualiAPI.Controllers
{
    public class SuspendedUserController : ApiController
    {

        public IHttpActionResult Post(User user)
        {
            try
            {
                string response = Service.isSuspendedUser(user.email);
                string status=(string)(((JObject)(JsonConvert.DeserializeObject(response))).GetValue("status"));
                return Ok(status);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.NotFound, ex.Message);
            }
        }

        public void Options() { }
    }
}
