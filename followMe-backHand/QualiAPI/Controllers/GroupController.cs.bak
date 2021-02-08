using MongoDB.Driver;
using MongoDB.Driver.Linq;
using QualiAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Device.Location;
using Twilio.AspNet.Mvc;
using System.Threading.Tasks;
using Twilio.Clients;
using DAL.Models;
using MongoDB.Bson;
using DAL;

namespace QualiAPI.Controllers
{


    public class GroupController : ApiController
    {


        /// <summary>
        ///   קבלת כל הקבוצות שהמשתמש רשום עליהם והם פעילות
        /// </summary>
        /// <param name="phone"></param>
        /// <returns></returns>
        ///
        [HttpGet]
        [Route("api/groupOfUser/{phone}")]
        public async Task<IHttpActionResult> groupOfUser([FromUri] string phone)
        {
            try
            {
                List<Group> gro = await BL.GroupS.getGroupOpenToUser(phone);
                return Ok(gro);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.BadRequest, ex.Message);
            }
        }

        /// <summary>
        /// קבלת כל הקבוצות שהמשתמש רשום עליהם והם כרגע לא פעילות
        /// </summary>
        /// <param name="phone"></param>
        /// <returns></returns>


        [HttpGet]
        [Route("api/groupOfUserStatusFalse/{phone}")]
        public async Task<IHttpActionResult> groupOfUserStatusFalse([FromUri] string phone)
        {
            try
            {
                List<Group> gro = await BL.GroupS.groupOfUserStatusFalse(phone);
                return Ok(gro);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.BadRequest, ex.Message);
            }
        }

        /// <summary>
        /// בדיקה האם קיים קוד קבוצה כזאת
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("api/checkCodeGroup/{Code}/{phone}")]
        public async Task<IHttpActionResult> checkCodeGroup([FromUri] string Code, string phone)
        {
            try
            {
                var gro = await BL.GroupS.checkCodeGroup(Code);
                if (gro != null)
                {
                    await BL.GroupS.AddToGroup(Code, phone);
                    return Ok(gro);
                }
                return Content(HttpStatusCode.BadRequest, "לא היתה אפשרות להצטרף לקבוצה");
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.BadRequest, ex.Message);
            }
        }


        /// <summary>
        /// קבלת כל הקבוצות הרלוונטיות
        /// </summary>
        /// <param name="phone"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("api/getAllGroups")]
        public IHttpActionResult getAllGroups()
        {
            try
            {
                var gro = BL.GroupS.getAllGroups();
                return Ok(gro);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.BadRequest, ex.Message);
            }
        }

        /// <summary>
        /// קבלת כל הקבוצות שלא פעילות כרגע
        /// </summary>
        /// <returns></returns>
        
        //TODO:מה הפונקציה עושה
        [HttpGet]
        [Route("api/getAllGroupsDisable")]
        public IHttpActionResult getAllGroupsDisable()
        {
            try
            {
                var gro = BL.GroupS.getAllGroups();
                return Ok(gro);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.BadRequest, ex.Message);
            }
        }

        /// <summary>
        /// הוספת קבוצה חדשה
        /// </summary>
        /// <param name="group"></param>
        /// <returns></returns>
        ///
        [HttpPost]
        [Route("api/addGroup")]
        public async Task<IHttpActionResult> addGroup([FromBody]Group group)
        {

            try
            {
                Group newGroup = await BL.GroupS.addGroup(group);
                if (newGroup == null)
                    return Content(HttpStatusCode.BadRequest, "הוספת הקבוצה נכשלה");
                return Ok(newGroup);
            }
            catch (Exception ex)
            {

                return Content(HttpStatusCode.BadRequest, ex.Message);
            }

        }


        /// <summary>
        /// מחיקת קבוצה
        /// </summary>
        /// <param name="password"></param>
        /// <returns></returns>
        [Route("api/deleteGroup/{password}")]
        [HttpDelete]
        public async Task<IHttpActionResult> Delete([FromUri]string password)
        {
            try
            {
                bool b = await BL.GroupS.deleteGroup1(password);
                if (b == true)
                    return Ok(b);
                return NotFound();
            }
            catch (Exception)
            {
                return Content(HttpStatusCode.NotFound, true);
            }

        }

        /// <summary>
        /// עדכון פרטי קבוצה 
        /// </summary>
        /// <param name="group2"></param>
        /// <returns></returns>
        [Route("api/updateGroup")]
        [HttpPost]
        public async Task<IHttpActionResult> updateGroup([FromBody]Group group2)
        {

            Group group = await BL.GroupS.UpdateGroup1(group2);
            if (group == null)
                return NotFound();
            return Ok(group);

        }

        /// <summary>
        /// משתמשים של קבוצה מסוימת
        /// </summary>
        /// <param name="pass"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("api/UsersOfGroup/{pass}")]
        public async Task<IHttpActionResult> UsersOfGroup([FromUri] string pass)
        {
            try
            {
                var gro = await BL.GroupS.GetUserOfGroup1(pass);
                return Ok(gro);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.BadRequest, ex.Message);
            }
        }

        /// <summary>
        /// נקודות של מנהלי קבוצה מסוימת
        /// </summary>
        /// <param name="pass"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("api/getManagmentsMarker")]
        public async Task<IHttpActionResult> getManagmentsMarker([FromBody] Group pass)
        {
            try
            {
                var g = await BL.GroupS.getGroupByPass(pass.Password);
                List<string> users = g.ListManagment.Select(p => p.PhoneManagment).ToList();
                List<Marker> markers = new List<Marker>();
                foreach (var item in users)
                {
                    UserProfile user = await conectDB.getUser(item);
                    if (user != null)
                        markers.Add(user.Marker);
                }


                return Ok(markers);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.BadRequest, ex.Message);
            }
        }

        [HttpPost]
        [Route("api/getUsersMarker")]
        public async Task<IHttpActionResult> getUsersMarker([FromBody] Group pass)
        {
            try
            {
                var g = await BL.GroupS.getGroupByPass(pass.Password);
                List<string> users = g.Users.Select(p => p.UserPhoneGroup).ToList();
                List<Marker> markers = new List<Marker>();
                foreach (var item in users)
                {
                    UserProfile user = await conectDB.getUser(item);
                    if (user != null)
                        markers.Add(user.Marker);
                }


                return Ok(markers);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.BadRequest, ex.Message);
            }
        }




        /// <summary>
        /// הוספת משתמש לקבוצה
        /// </summary>
        /// <param name="group"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("api/updateUsersGroup")]
        public async Task<IHttpActionResult> updateUsersGroup([FromBody]Group group)
        {
            try
            {
                bool b = await BL.GroupS.updateUsersGroup(group);
                if (b == true)
                    return Ok(b);
                return Content(HttpStatusCode.BadRequest, "תקלה בשמירת הנתונים");
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.BadRequest, ex.Message);
            }
        }


        /// <summary>
        /// קבלת קבוצה
        /// </summary>
        /// <param name="pass"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("api/getGroupByPass")]
        public async Task<IHttpActionResult> getGroupByPass([FromBody]string pass)
        {
            try
            {
                Group group = await BL.GroupS.getGroupByPass(pass);
                    return Ok(group);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.BadRequest, ex.Message);
            }
        }

    }

}

